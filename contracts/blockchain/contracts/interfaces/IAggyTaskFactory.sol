// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./IAggyTask.sol";

interface IAggyTaskFactory {
    function createTask(
        address _aggyToken,
        address _requester,
        address _optimisticOracle,
        IAggyTask.TaskData memory _taskData
    ) external returns (address);

    function getTaskAddressById(
        string memory _taskId
    ) external view returns (address);
}
