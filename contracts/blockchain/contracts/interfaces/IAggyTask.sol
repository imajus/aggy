// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

interface IAggyTask {
    enum TaskStatus {
        Created,
        InProgress,
        UnderReview,
        Confirmed,
        Failed,
        Cancelled
    }

    struct TaskData {
        string name;
        string id; // UUID string
        string details;
        uint256 rewardAmount;
        uint256 stakeAmount;
        uint256 deadline; // UNIX timestamp
    }

    struct TaskState {
        TaskStatus status;
        address contractor;
        address requester;
        uint256 updated;
    }

    struct Task {
        TaskData data;
        TaskState state;
    }

    event TaskCreated(address indexed taskAddress, IAggyTask.Task task);
    event TaskClaimed(address indexed taskAddress, IAggyTask.Task task);
    event TaskCompleted(address indexed taskAddress, IAggyTask.Task task);
    event TaskConfirmed(address indexed taskAddress, IAggyTask.Task task);
    event TaskFailed(address indexed taskAddress, IAggyTask.Task task);
    event TaskCancelled(address indexed taskAddress, IAggyTask.Task task);

    function getTask() external view returns (Task memory);

    function claimTask(address _contractor) external;

    function completeTask(address _contractor) external;

    function confirmTask() external;

    function failTask() external;

    function cancelTask(address _requester) external;
}
