// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./IAggyTask.sol";

interface IAggyTaskFactory {
    function createTask(
        IAggyTask.TaskData memory _taskData,
        address _aggyToken
    ) external returns (address);

    function getTaskAddressById(string memory _taskId) external view returns (address);
}
