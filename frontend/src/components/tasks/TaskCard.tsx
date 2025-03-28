import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { STATUS_MAP } from './TasksList';
import { WalletWithMetadata } from '@privy-io/react-auth';
import { fetchTaskPrivateData } from '@/lib/api';

interface Task {
  id: string;
  name: string;
  details: string;
  deadline: number;
  reward: number;
  penalty: number;
  status: 0 | 1 | 2 | 3 | 4 | 5;
  contractor: string | null;
}

interface TaskCardProps {
  task: Task;
  delegatedWallet?: WalletWithMetadata;
  authenticated?: boolean;
  claimingTaskId: string | null;
  userId?: string;
  onClaimTask: (task: Task) => void;
  onSubmitResult: (task: Task) => void;
}

export function TaskCard({
  task,
  delegatedWallet,
  authenticated,
  claimingTaskId,
  userId,
  onClaimTask,
  onSubmitResult
}: TaskCardProps) {
  const [privateData, setPrivateData] = useState<string | null>(null);
  const [isLoadingPrivateData, setIsLoadingPrivateData] = useState(false);

  useEffect(() => {
    async function loadPrivateData() {
      if (
        task.status === 1 && 
        task.contractor === delegatedWallet?.address &&
        userId
      ) {
        setIsLoadingPrivateData(true);
        try {
          const data = await fetchTaskPrivateData(userId, task.id);
          setPrivateData(data);
        } catch (error) {
          console.error(`Failed to fetch private data for task ${task.id}:`, error);
        } finally {
          setIsLoadingPrivateData(false);
        }
      }
    }

    loadPrivateData();
  }, [task.id, task.status, task.contractor, delegatedWallet?.address, userId]);

  return (
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
            privateData && (
            <div className="mt-4">
              <h3 className="font-medium text-sm">Private Data</h3>
              {isLoadingPrivateData ? (
                <p className="text-sm text-muted-foreground mt-1">Loading...</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  {privateData}
                </p>
              )}
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
              onClick={() => onClaimTask(task)}
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
              onClick={() => onSubmitResult(task)}
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
  );
} 