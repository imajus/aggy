// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./interfaces/IAggyToken.sol";
import "./interfaces/IAggyTask.sol";

contract AggyTask {
    address public aggyCore;
    IAggyToken public aggyToken;

    IAggyTask.Task public task;

    event TaskCreated(address indexed task, IAggyTask.Task taskData);
    event TaskClaimed(address indexed task, IAggyTask.Task taskData);
    event TaskCompleted(address indexed task, IAggyTask.Task taskData);
    event TaskConfirmed(address indexed task, IAggyTask.Task taskData);
    event TaskFailed(address indexed task, IAggyTask.Task taskData);
    event TaskCancelled(address indexed task, IAggyTask.Task taskData);

    modifier onlyAggy() {
        require(msg.sender == aggyCore, "AggyTaskFactory: must be Aggy");
        _;
    }

    constructor(
        address _aggyCore,
        address _aggyToken,
        IAggyTask.Task memory _task
    ) {
        aggyCore = _aggyCore;
        aggyToken = IAggyToken(_aggyToken);

        task = _task;
        task.status = IAggyTask.TaskStatus.Created; // explicitly set status to Created

        emit TaskCreated(address(this), _task);
    }

    /// @notice Get the task's token balance
    function tokenBalance() external view returns (uint256) {
        return aggyToken.balanceOf(address(this));
    }

    /// @notice Claim the task to start work on it
    function claimTask() external {
        require(
            task.status == IAggyTask.TaskStatus.Created,
            "AggyTask: task must be Created"
        );

        task.status = IAggyTask.TaskStatus.InProgress;
        task.contractor = msg.sender;

        // transfer stake amount from contractor to this contract as a bond against failure
        // to complete the task by the contractor
        require(
            aggyToken.transfer(task.contractor, task.stakeAmount),
            "AggyTask: failed to transfer stake amount"
        );

        emit TaskClaimed(address(this), task);
    }

    /// @notice Complete the task and put it into a review state
    function completeTask() external {
        require(
            task.status == IAggyTask.TaskStatus.InProgress,
            "AggyTask: task must be InProgress"
        );
        require(msg.sender == task.contractor, "AggyTask: must be contractor");

        task.status = IAggyTask.TaskStatus.UnderReview;

        emit TaskCompleted(address(this), task);
    }

    /// @notice Confirm the task and transfer the reward amount to the contractor
    function confirmTask() external onlyAggy {
        require(
            task.status == IAggyTask.TaskStatus.UnderReview,
            "AggyTask: task must be UnderReview"
        );

        task.status = IAggyTask.TaskStatus.Confirmed;

        // transfer reward + stake amount from this contract to contractor
        require(
            aggyToken.transfer(
                task.contractor,
                task.stakeAmount + task.rewardAmount // could also do AggyToken.balanceOf(address(this))
            ),
            "AggyTask: failed to transfer reward amount"
        );

        emit TaskConfirmed(address(this), task);
    }

    /// @notice Fail the task and transfer the stake and reward amounts back to Aggy Core
    function failTask() external onlyAggy {
        require(
            task.status == IAggyTask.TaskStatus.UnderReview ||
                block.timestamp > task.deadline,
            "AggyTask: task must be UnderReview or past the deadline"
        );

        task.status = IAggyTask.TaskStatus.Failed;

        // transfer stake and reward amounts from this contract to Aggy Core
        require(
            aggyToken.transfer(
                aggyCore,
                task.stakeAmount + task.rewardAmount // could also do AggyToken.balanceOf(address(this))
            ),
            "AggyTask: failed to transfer stake and reward amounts"
        );

        emit TaskFailed(address(this), task);
    }

    /// @notice Cancel the task and transfer the stake and reward amounts back to contractor and Aggy Core
    function cancelTask() external onlyAggy {
        require(
            task.status == IAggyTask.TaskStatus.Created ||
                task.status == IAggyTask.TaskStatus.InProgress || // allow cancelling in progress tasks
                task.status == IAggyTask.TaskStatus.UnderReview,
            "AggyTask: task must not be Confirmed, Failed, or Cancelled"
        );

        task.status = IAggyTask.TaskStatus.Cancelled;

        // split the difference - transfer stake amount back to contractor and reward amount back to Aggy Core
        require(
            aggyToken.transfer(task.contractor, task.stakeAmount),
            "AggyTask: failed to transfer stake amount"
        );
        require(
            aggyToken.transfer(aggyCore, task.rewardAmount),
            "AggyTask: failed to transfer reward amount"
        );

        emit TaskCancelled(address(this), task);
    }
}
