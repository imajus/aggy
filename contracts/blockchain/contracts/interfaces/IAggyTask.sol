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
        // timestamps (UNIX)
        uint64 created; // task created
        uint64 started; // task claimed
        uint64 submitted; // task completed (submitted for review)
        uint64 finished; // task confirmed, failed, or cancelled
        uint64 updated; // last state change
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

    event TaskAssertionMade(bytes32 assertionId, address indexed task);
    event TaskDisputed(address indexed taskAddress, bytes32 assertionId);

    function getTask() external view returns (Task memory);

    function claimTask(address _contractor) external;

    function completeTask(address _contractor) external;

    function resolveTask() external;

    function confirmTask() external;

    function failTask() external;

    function cancelTask(address _requester) external;

    // convenience functions for debugging, mostly
    function setUmaOracle(address _oracle) external;

    function setUmaLiveness(uint64 _liveness) external;

    function tokenBalance() external view returns (uint256);
}
