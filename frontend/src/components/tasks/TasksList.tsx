'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';
import { fetchTasks, approveToken, claimTask, completeTask, fetchTaskPrivateData } from '@/lib/api';
import { usePrivy, useSendTransaction, WalletWithMetadata } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

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
  const [tasks, setTasks] = useState<TaskWithPrivateData[]>([]);
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

      // Fetch private data for in-progress tasks assigned to the user
      const tasksWithPrivateData = await Promise.all(
        sortedTasks.map(async (task) => {
          if (
            task.status === 1 && 
            task.contractor === delegatedWallet?.address
          ) {
            try {
              const privateData = await fetchTaskPrivateData(user.id, task.id);
              return { ...task, privateData };
            } catch (error) {
              console.error(`Failed to fetch private data for task ${task.id}:`, error);
              return task;
            }
          }
          return task;
        })
      );
      
      setTasks(tasksWithPrivateData);
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
              <Card key={task.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{task.name}</h2>
                    <p className="text-muted-foreground mt-1">{task.details}</p>
                    {task.status === 2 && (
                      <a
                        href={`https://testnet.oracle.uma.xyz/?search=${task.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Check the review progress
                      </a>
                    )}
                    {task.status === 1 && 
                      task.contractor === delegatedWallet?.address && 
                      task.privateData && (
                      <div className="mt-4">
                        <h3 className="font-medium text-sm">Private Data</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.privateData}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="default"
                      className={`${STATUS_MAP[task.status].color} text-white`}
                    >
                      {STATUS_MAP[task.status].label}
                    </Badge>
                    {task.status === 0 && authenticated && delegatedWallet && (
                      <Button
                        size="sm"
                        variant="default"
                        className="text-white"
                        onClick={() => handleClaimTask(task)}
                        disabled={claimingTaskId === task.id}
                      >
                        {claimingTaskId === task.id ? 'Claiming...' : 'Claim Task'}
                      </Button>
                    )}
                    {task.status === 1 && 
                      authenticated && 
                      delegatedWallet &&
                      task.contractor === delegatedWallet.address && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleSubmitResult(task)}
                      >
                        Submit Result
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-medium">
                      {formatDistanceToNow(task.deadline, { addSuffix: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reward</p>
                    <p className="font-medium text-green-600">
                      {task.reward} AGGY
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Penalty</p>
                    <p className="font-medium text-red-600">
                      {task.penalty} AGGY
                    </p>
                  </div>
                </div>
              </Card>
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