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
    PENDING_REVIEW = 2,
    UNDER_REVIEW = 3,
    CONFIRMED = 4,
    FAILED = 5,
    CANCELLED = 6,
  }

  export const stringToTaskStatus = (status: string) => {
    return TaskStatus[status as keyof typeof TaskStatus];
  }


  export const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.CREATED:
        return 'Created';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.PENDING_REVIEW:
        return 'Pending Review';
      case TaskStatus.UNDER_REVIEW:
        return 'Under Review';
      case TaskStatus.CONFIRMED:
        return 'Confirmed';
      case TaskStatus.FAILED:
        return 'Failed';
      case TaskStatus.CANCELLED:
        return 'Cancelled';
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