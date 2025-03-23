// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./interfaces/IAggyToken.sol";
import "./interfaces/IAggyTaskFactory.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AggyCore is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    IAggyTaskFactory public taskFactory;
    IAggyToken public aggyToken;

    string public instructionsPreamble = "## General instructions";
    string public instructions;
    string public safetyRulesPreamble = "## Safety rules";
    string public safetyRules;
    string public constraintsPreamble = "## Constraints";
    string public constraints;

    address public optimisticOracle;

    constructor(
        string memory _instructions,
        string memory _safetyRules,
        string memory _constraints,
        IAggyTaskFactory _taskFactory,
        IAggyToken _aggyToken,
        address _optimisticOracle
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender); // for debugging, remove later

        instructions = _instructions;
        safetyRules = _safetyRules;
        constraints = _constraints;

        taskFactory = _taskFactory;
        aggyToken = _aggyToken;
        optimisticOracle = _optimisticOracle;
    }

    // Uma ---------------------------------------------------------------------

    /// @notice Set the optimistic oracle address
    /// @param _optimisticOracle The optimistic oracle address
    function setOptimisticOracle(
        address _optimisticOracle
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        optimisticOracle = _optimisticOracle;
    }

    /// @notice Set the optimistic oracle address on a specified task
    /// @param taskId The task ID
    /// @param _optimisticOracle The optimistic oracle address
    function setTaskOptimisticOracle(
        string memory taskId,
        address _optimisticOracle
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).setUmaOracle(_optimisticOracle);
    }

    /// @notice Set the optimistic oracle liveness on a specified task
    /// @param taskId The task ID
    /// @param _liveness The liveness
    function setTaskUmaLiveness(
        string memory taskId,
        uint64 _liveness
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).setUmaLiveness(_liveness);
    }

    // Tasks -------------------------------------------------------------------

    /// @notice Create a task
    /// @param _taskData The task data
    function createTask(IAggyTask.TaskData memory _taskData) external {
        // create the task
        address task = taskFactory.createTask(
            address(aggyToken),
            msg.sender,
            optimisticOracle,
            _taskData
        );

        // transfer the reward tokens
        require(
            aggyToken.transferFrom(msg.sender, task, _taskData.rewardAmount),
            "AggyCore: failed to transfer reward amount"
        );
    }

    /// @notice Claim a task by ID
    /// @param taskId The task ID
    function claimTask(string memory taskId) external {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).claimTask(msg.sender);

        IAggyTask.Task memory task = IAggyTask(taskAddress).getTask();

        // transfer stake amount from contractor to the task contract as a bond against failure
        // to complete the task by the contractor
        require(
            aggyToken.transferFrom(
                task.state.contractor,
                taskAddress,
                task.data.stakeAmount
            ),
            "AggyTask: failed to transfer stake amount"
        );
    }

    /// @notice Complete a task by ID
    /// @param taskId The task ID
    function completeTask(string memory taskId) external {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).completeTask(msg.sender);
    }

    /// @notice Resolve a task by ID
    /// @param taskId The task ID
    function resolveTask(string memory taskId) external {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).resolveTask();
    }

    /// @notice Confirm a task by ID
    /// @param taskId The task ID
    function confirmTask(
        string memory taskId
    ) external onlyRole(VERIFIER_ROLE) {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).confirmTask();
    }

    /// @notice Fail a task by ID
    /// @param taskId The task ID
    function failTask(string memory taskId) external onlyRole(VERIFIER_ROLE) {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).failTask();
    }

    /// @notice Cancel a task by ID
    /// @param taskId The task ID
    function cancelTask(string memory taskId) external {
        address taskAddress = taskFactory.getTaskAddressById(taskId);
        IAggyTask(taskAddress).cancelTask(msg.sender);
    }

    // Tokens ------------------------------------------------------------------

    /// @notice Get the number of decimals of the token
    /// @return The number of decimals
    function decimals() public view returns (uint8) {
        return aggyToken.decimals();
    }

    /// @notice Transfer tokens
    /// @param to The recipient
    /// @param amount The amount
    function transferTokens(
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            aggyToken.transfer(to, amount),
            "AggyCore: failed to transfer tokens"
        );
    }

    /// @notice Mint tokens
    /// @param to The recipient
    /// @param amount The amount
    function mintTokens(
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        aggyToken.mint(to, amount);
    }

    /// @notice Burn tokens
    /// @param amount The amount
    function burnTokens(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        aggyToken.burn(amount);
    }

    // Instructions, safety rules, and constraints -----------------------------

    /// @notice Get the combined instructions, safety rules, and constraints for the AI
    /// @return The combined instructions, safety rules, and constraints
    function getCombinedInstructions() external view returns (string memory) {
        string memory combined = string(
            abi.encodePacked(
                instructionsPreamble,
                "\n\n",
                instructions,
                "\n\n",
                safetyRulesPreamble,
                "\n\n",
                safetyRules,
                "\n\n",
                constraintsPreamble,
                "\n\n",
                constraints
            )
        );

        return combined;
    }

    /// @notice Set the instructions preamble
    /// @param _instructionsPreamble The instructions preamble
    function setInstructionsPreamble(
        string memory _instructionsPreamble
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        instructionsPreamble = _instructionsPreamble;
    }

    /// @notice Set the instructions
    /// @param _instructions The instructions
    function setInstructions(
        string memory _instructions
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        instructions = _instructions;
    }

    /// @notice Set the safety rules preamble
    /// @param _safetyRulesPreamble The safety rules preamble
    function setSafetyRulesPreamble(
        string memory _safetyRulesPreamble
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        safetyRulesPreamble = _safetyRulesPreamble;
    }

    /// @notice Set the safety rules
    /// @param _safetyRules The safety rules
    function setSafetyRules(
        string memory _safetyRules
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        safetyRules = _safetyRules;
    }

    /// @notice Set the constraints preamble
    /// @param _constraintsPreamble The constraints preamble
    function setConstraintsPreamble(
        string memory _constraintsPreamble
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        constraintsPreamble = _constraintsPreamble;
    }

    /// @notice Set the constraints
    /// @param _constraints The constraints
    function setConstraints(
        string memory _constraints
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        constraints = _constraints;
    }
}
