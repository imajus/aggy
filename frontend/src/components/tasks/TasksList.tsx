'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { fetchTasks, approveToken, claimTask, completeTask, fetchTaskPrivateData } from '@/lib/api';
import { usePrivy, useSendTransaction, WalletWithMetadata } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { TaskCard } from './TaskCard';

export interface Task {
  id: string;
  name: string;
  details: string;
  deadline: number;
  reward: number;
  penalty: number;
  status: 0 | 1 | 2 | 3 | 4 | 5;
  contractor: string | null;
}

interface TaskWithPrivateData extends Task {
  privateData?: string;
}

export const STATUS_MAP = {
  0: { label: 'Created', color: 'bg-gray-500' },
  1: { label: 'In Progress', color: 'bg-blue-500' },
  2: { label: 'Under Review', color: 'bg-yellow-500' },
  3: { label: 'Completed', color: 'bg-green-500' },
  4: { label: 'Failed', color: 'bg-red-500' },
  5: { label: 'Cancelled', color: 'bg-slate-500' },
};

interface TasksListProps {
  title: string;
  filterStatus?: number[];
  showOnlyMine?: boolean;
}

export function TasksList({ title, filterStatus, showOnlyMine }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [resultText, setResultText] = useState('');
  const { user, authenticated } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  const router = useRouter();

  // Find delegated wallet
  const delegatedWallet = user?.linkedAccounts.find(
    (account): account is WalletWithMetadata => 
      account.type === 'wallet' && 
      account.walletClientType === 'privy' &&
      account.delegated
  );

  async function loadTasks() {
    try {
      const data = await fetchTasks();
      
      // Apply filters and sorting
      let filteredTasks = filterStatus 
        ? data.filter(task => filterStatus.includes(task.status))
        : data;

      if (showOnlyMine && delegatedWallet) {
        filteredTasks = filteredTasks.filter(
          task => task.contractor === delegatedWallet.address
        );
      }
      
      const sortedTasks = [...filteredTasks].sort((a, b) => {
        return b.deadline - a.deadline;
      });
      
      setTasks(sortedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClaimTask = async (task: Task) => {
    if (!delegatedWallet) return;
    
    setClaimingTaskId(task.id);
    try {
      // First approve token transfer
      const approveTx = await approveToken(delegatedWallet.address, task.penalty.toString());
      await sendTransaction({
        to: approveTx.to,
        chainId: process.env.NEXT_PUBLIC_MULTIBAAS_CHAIN_ID! as unknown as number,
        nonce: approveTx.nonce ?? 0,
        data: approveTx.data,
        value: approveTx.value,
        type: approveTx.type,
        maxFeePerGas: approveTx.gasFeeCap,
        maxPriorityFeePerGas: approveTx.gasTipCap,
      });

      // Then claim the task
      const claimTx = await claimTask(delegatedWallet.address, task.id);
      await sendTransaction({
        to: claimTx.to,
        chainId: process.env.NEXT_PUBLIC_MULTIBAAS_CHAIN_ID! as unknown as number,
        nonce: claimTx.nonce ?? 0,
        data: claimTx.data,
        value: claimTx.value,
        type: claimTx.type,
        maxFeePerGas: claimTx.gasFeeCap,
        maxPriorityFeePerGas: claimTx.gasTipCap,
      });

      // Redirect to My Tasks page after successful claim
      router.push('/my-tasks');
    } catch (err) {
      console.error('Failed to claim task:', err);
      setError('Failed to claim task. Please try again.');
    } finally {
      setClaimingTaskId(null);
    }
  };

  const handleSubmitResult = (task: Task) => {
    setSelectedTask(task);
    setResultText('');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitForm = async () => {
    if (!selectedTask || !resultText.trim()) return;

    try {
      const completeTx = await completeTask(delegatedWallet.address, selectedTask.id, resultText);
      await sendTransaction({
        to: completeTx.to,
        chainId: process.env.NEXT_PUBLIC_MULTIBAAS_CHAIN_ID! as unknown as number,
        nonce: completeTx.nonce ?? 0,
        data: completeTx.data,
        value: completeTx.value,
        type: completeTx.type,
        maxFeePerGas: completeTx.gasFeeCap,
        maxPriorityFeePerGas: completeTx.gasTipCap,
      });
      setIsSubmitModalOpen(false);
      setSelectedTask(null);
      setResultText('');
    } catch (error) {
      console.error('Failed to submit result:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filterStatus, showOnlyMine, delegatedWallet?.address]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div className="flex items-center justify-center h-64">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <Card className="p-6 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        
        {tasks.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">No tasks found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                delegatedWallet={delegatedWallet}
                authenticated={authenticated}
                claimingTaskId={claimingTaskId}
                userId={user?.id}
                onClaimTask={handleClaimTask}
                onSubmitResult={handleSubmitResult}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold">Submit Task Result</DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium">Task Name</h3>
                <p className="text-muted-foreground">{selectedTask.name}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Task Details</h3>
                <p className="text-muted-foreground">{selectedTask.details}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Your Result</h3>
                <Textarea
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  placeholder="Describe your work and provide any relevant links..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="default"
              className="bg-white hover:bg-gray-50"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSubmitForm}
              disabled={!resultText.trim()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 