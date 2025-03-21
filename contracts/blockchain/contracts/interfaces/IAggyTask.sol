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

    struct Task {
        string name;
        string id; // UUID string
        TaskStatus status;
        address contractor;
        string details;
        uint256 rewardAmount;
        uint256 stakeAmount;
        uint256 deadline; // UNIX timestamp
    }

    function getTask() external view returns (Task memory);

    function confirmTask() external;

    function failTask() external;

    function cancelTask() external;
}
