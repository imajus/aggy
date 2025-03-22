// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./interfaces/IAggyToken.sol";
import "./interfaces/IAggyTask.sol";

contract AggyTask {
    address public aggyCore;
    IAggyToken public aggyToken;

    IAggyTask.Task public task;

    modifier onlyAggy() {
        require(msg.sender == aggyCore, "AggyTaskFactory: must be Aggy");
        _;
    }

    constructor(
        address _aggyCore,
        address _aggyToken,
        IAggyTask.TaskData memory _taskData
    ) {
        aggyCore = _aggyCore;
        aggyToken = IAggyToken(_aggyToken);

        task.data = _taskData;

        emit IAggyTask.TaskCreated(address(this), task);
    }

    /// @notice Get the task's token balance
    function tokenBalance() external view returns (uint256) {
        return aggyToken.balanceOf(address(this));
    }

    /// @notice Get the task's data
    /// @return The task's data
    function getTask() external view returns (IAggyTask.Task memory) {
        return task;
    }

    /// @notice Claim the task to start work on it
    function claimTask() external {
        require(
            task.state.status == IAggyTask.TaskStatus.Created,
            "AggyTask: task must be Created"
        );

        task.state.status = IAggyTask.TaskStatus.InProgress;
        task.state.contractor = msg.sender;

        // transfer stake amount from contractor to this contract as a bond against failure
        // to complete the task by the contractor
        require(
            aggyToken.transferFrom(
                task.state.contractor,
                address(this),
                task.data.stakeAmount
            ),
            "AggyTask: failed to transfer stake amount"
        );

        emit IAggyTask.TaskClaimed(address(this), task);
    }

    /// @notice Complete the task and put it into a review state
    function completeTask() external {
        require(
            task.state.status == IAggyTask.TaskStatus.InProgress,
            "AggyTask: task must be InProgress"
        );
        require(
            msg.sender == task.state.contractor,
            "AggyTask: must be contractor"
        );

        task.state.status = IAggyTask.TaskStatus.UnderReview;

        emit IAggyTask.TaskCompleted(address(this), task);
    }

    /// @notice Confirm the task and transfer the reward amount to the contractor
    function confirmTask() external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.UnderReview,
            "AggyTask: task must be UnderReview"
        );

        task.state.status = IAggyTask.TaskStatus.Confirmed;

        // transfer reward + stake amount from this contract to contractor
        require(
            aggyToken.transfer(
                task.state.contractor,
                task.data.stakeAmount + task.data.rewardAmount // could also do AggyToken.balanceOf(address(this))
            ),
            "AggyTask: failed to transfer reward amount"
        );

        emit IAggyTask.TaskConfirmed(address(this), task);
    }

    /// @notice Fail the task and transfer the stake and reward amounts back to Aggy Core
    function failTask() external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.UnderReview ||
                block.timestamp > task.data.deadline,
            "AggyTask: task must be UnderReview or past the deadline"
        );

        task.state.status = IAggyTask.TaskStatus.Failed;

        // transfer stake and reward amounts from this contract to Aggy Core
        require(
            aggyToken.transfer(
                aggyCore,
                task.data.stakeAmount + task.data.rewardAmount // could also do AggyToken.balanceOf(address(this))
            ),
            "AggyTask: failed to transfer stake and reward amounts"
        );

        emit IAggyTask.TaskFailed(address(this), task);
    }

    /// @notice Cancel the task and transfer the stake and reward amounts back to contractor and Aggy Core
    function cancelTask() external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.Created ||
                task.state.status == IAggyTask.TaskStatus.InProgress || // allow cancelling in progress tasks
                task.state.status == IAggyTask.TaskStatus.UnderReview,
            "AggyTask: task must not be Confirmed, Failed, or Cancelled"
        );

        task.state.status = IAggyTask.TaskStatus.Cancelled;

        // split the difference - transfer stake amount back to contractor and reward amount back to Aggy Core
        require(
            aggyToken.transfer(task.state.contractor, task.data.stakeAmount),
            "AggyTask: failed to transfer stake amount"
        );
        require(
            aggyToken.transfer(aggyCore, task.data.rewardAmount),
            "AggyTask: failed to transfer reward amount"
        );

        emit IAggyTask.TaskCancelled(address(this), task);
    }
}
