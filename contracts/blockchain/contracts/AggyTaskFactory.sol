// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./interfaces/IAggyTask.sol";
import "./AggyTask.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AggyTaskFactory is AccessControl {
    address public aggyCore;

    address[] public tasks;
    mapping(string => uint256) public TaskIdToIndex;
    mapping(string => address) public TaskIdToAddress;

    modifier onlyAggy() {
        require(msg.sender == aggyCore, "AggyTaskFactory: must be Aggy");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setAggyCore(address _aggyCore) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "AggyTaskFactory: must have DEFAULT_ADMIN_ROLE to set AggyCore"
        );

        aggyCore = _aggyCore;
    }

    // Tasks -------------------------------------------------------------------

    /// @notice Create a task
    /// @param _taskData The task
    function createTask(
        IAggyTask.Task memory _taskData,
        address aggyToken
    ) external onlyAggy returns (address) {
        // ensure we don't have a task with the same ID
        require(
            TaskIdToAddress[_taskData.id] == address(0),
            "AggyTaskFactory: task already exists"
        );

        // create the task
        AggyTask task = new AggyTask(aggyCore, aggyToken, _taskData);

        // add to indexes
        tasks.push(address(task));
        TaskIdToIndex[_taskData.id] = tasks.length - 1;
        TaskIdToAddress[_taskData.id] = address(task);

        return address(task);
    }

    /// @notice Get all task addresses
    /// @return The task addresses
    function getTaskAddresses() external view returns (address[] memory) {
        return tasks;
    }

    /// @notice Get the number of tasks
    /// @return The number of tasks
    function getTaskCount() external view returns (uint256) {
        return tasks.length;
    }

    /// @notice Get a task address by ID
    /// @param _taskId The task ID
    /// @return The task address
    function getTaskAddressById(
        string memory _taskId
    ) public view returns (address) {
        require(
            TaskIdToAddress[_taskId] != address(0),
            "AggyTaskFactory: task not found"
        );

        return TaskIdToAddress[_taskId];
    }

    /// @notice Get a task by ID
    /// @param _taskId The task ID
    /// @return The task
    function getTaskById(
        string memory _taskId
    ) external view returns (IAggyTask.Task memory) {
        address taskAddress = getTaskAddressById(_taskId);

        return IAggyTask(taskAddress).getTask();
    }

    /// @notice Get a task by index
    /// @param _index The task index
    /// @return The task
    function getTaskByIndex(
        uint256 _index
    ) external view returns (IAggyTask.Task memory) {
        return IAggyTask(tasks[_index]).getTask();
    }

    /// @notice Get all tasks
    /// @return The tasks
    function getTasks() external view returns (IAggyTask.Task[] memory) {
        IAggyTask.Task[] memory taskDatas = new IAggyTask.Task[](tasks.length);
        for (uint256 i = 0; i < tasks.length; i++) {
            taskDatas[i] = IAggyTask(tasks[i]).getTask();
        }

        return taskDatas;
    }
}
