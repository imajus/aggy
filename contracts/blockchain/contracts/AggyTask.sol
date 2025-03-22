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
        address _requester,
        IAggyTask.TaskData memory _taskData
    ) {
        aggyCore = _aggyCore;
        aggyToken = IAggyToken(_aggyToken);

        task.data = _taskData;
        task.state.requester = _requester;

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
    /// @param _contractor The contractor's address
    function claimTask(address _contractor) external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.Created,
            "AggyTask: task must be Created"
        );

        task.state.status = IAggyTask.TaskStatus.InProgress;
        task.state.contractor = _contractor;

        emit IAggyTask.TaskClaimed(address(this), task);
    }

    /// @notice Complete the task and put it into a review state
    function completeTask(address _contractor) external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.InProgress,
            "AggyTask: task must be InProgress"
        );
        require(
            _contractor == task.state.contractor,
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

        // transfer stake and reward amounts from this contract to the requester
        require(
            aggyToken.transfer(
                task.state.requester,
                task.data.stakeAmount + task.data.rewardAmount // could also do AggyToken.balanceOf(address(this))
            ),
            "AggyTask: failed to transfer stake and reward amounts"
        );

        emit IAggyTask.TaskFailed(address(this), task);
    }

    /// @notice Cancel the task and transfer the stake and reward amounts back to contractor and Aggy Core
    function cancelTask(address _requester) external onlyAggy {
        require(
            task.state.status == IAggyTask.TaskStatus.Created ||
                task.state.status == IAggyTask.TaskStatus.InProgress,
            "AggyTask: task must be Created or InProgress"
        );
        require(
            _requester == task.state.requester,
            "AggyTask: must be requester"
        );

        task.state.status = IAggyTask.TaskStatus.Cancelled;

        // split the difference - transfer stake amount back to contractor and reward amount back to the requester
        require(
            aggyToken.transfer(task.state.contractor, task.data.stakeAmount),
            "AggyTask: failed to transfer stake amount"
        );
        require(
            aggyToken.transfer(task.state.requester, task.data.rewardAmount),
            "AggyTask: failed to transfer reward amount"
        );

        emit IAggyTask.TaskCancelled(address(this), task);
    }
}
