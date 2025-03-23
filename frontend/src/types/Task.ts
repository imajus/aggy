export interface TaskData {
    data: {
      deadline: string;
      details: string;
      id: string;
      name: string;
      rewardAmount: string;
      stakeAmount: string;
    };
    state: {
      contractor: string;
      created: string;
      finished: string;
      requester: string;
      started: string;
      status: number;
      submitted: string;
      updated: string;
    };
  }

  export enum TaskStatus {
    CREATED = 0,
    IN_PROGRESS = 1,
    SUBMITTED = 2,
    COMPLETED = 3,
  }

  export const stringToTaskStatus = (status: string) => {
    return TaskStatus[status as keyof typeof TaskStatus];
  }


  export const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Created';
      case 1:
        return 'In Progress';
      case 2:
        return 'Submitted';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  export interface TaskResponse {
    status: number;
    message: string;
    result: {
      kind: string;
      output: TaskData[];
    };
  }