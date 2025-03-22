// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./interfaces/IAggyToken.sol";
import "./interfaces/IAggyTaskFactory.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AggyCore is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    IAggyTaskFactory public taskFactory;
    IAggyToken public aggyToken;

    string public purposePreamble =
        "I am Aggy, an autonomous AI. My purpose is to ";
    string public purpose;
    string public safetyRulesPreamble = "I must follow these safety rules:";
    string[] public safetyRules;
    string public constraintsPreamble = "I must adhere to these constraints:";
    string[] public constraints;

    event SafetyRuleAdded(uint256 index, string safetyRule);
    event SafetyRuleSet(uint256 index, string safetyRule);
    event SafetyRuleDeleted(uint256 index);
    event ConstraintAdded(uint256 index, string constraint);
    event ConstraintSet(uint256 index, string constraint);
    event ConstraintDeleted(uint256 index);

    constructor(
        string memory _purpose,
        string[] memory _safetyRules,
        string[] memory _constraints,
        IAggyTaskFactory _taskFactory,
        IAggyToken _aggyToken
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender); // for debugging, remove later

        purpose = _purpose;

        for (uint256 i = 0; i < _safetyRules.length; i++) {
            safetyRules.push(_safetyRules[i]);
        }

        for (uint256 i = 0; i < _constraints.length; i++) {
            constraints.push(_constraints[i]);
        }

        taskFactory = _taskFactory;
        aggyToken = _aggyToken;
    }

    // Tasks -------------------------------------------------------------------

    /// @notice Create a task
    /// @param _taskData The task data
    function createTask(IAggyTask.TaskData memory _taskData) external {
        // create the task
        address task = taskFactory.createTask(
            address(aggyToken),
            msg.sender,
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

    // Prompt ------------------------------------------------------------------

    /// @notice Get the prompt for the AI
    /// @return The prompt
    function getPrompt() external view returns (string memory) {
        string memory prompt = string(
            abi.encodePacked(
                purposePreamble,
                purpose,
                "\n\n",
                safetyRulesPreamble
            )
        );

        for (uint256 i = 0; i < safetyRules.length; i++) {
            prompt = string(abi.encodePacked(prompt, "\n", safetyRules[i]));
        }

        prompt = string(abi.encodePacked(prompt, "\n\n", constraintsPreamble));

        for (uint256 i = 0; i < constraints.length; i++) {
            prompt = string(abi.encodePacked(prompt, "\n", constraints[i]));
        }

        return prompt;
    }

    /// @notice Set the purpose preamble
    /// @param _purposePreamble The purpose preamble
    function setPurposePreamble(
        string memory _purposePreamble
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        purposePreamble = _purposePreamble;
    }

    /// @notice Set the safety rules preamble
    /// @param _safetyRulesPreamble The safety rules preamble
    function setSafetyRulesPreamble(
        string memory _safetyRulesPreamble
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        safetyRulesPreamble = _safetyRulesPreamble;
    }

    /// @notice Set the constraints preamble
    /// @param _constraintsPreamble The constraints preamble
    function setConstraintsPreamble(
        string memory _constraintsPreamble
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        constraintsPreamble = _constraintsPreamble;
    }

    // Safety rules -----------------------------------------------------------

    /// @notice Get the number of safety rules
    /// @return The number of safety rules
    function safetyRulesCount() external view returns (uint256) {
        return safetyRules.length;
    }

    /// @notice Get the safety rules
    /// @return The safety rules
    function getSafetyRules() external view returns (string[] memory) {
        return safetyRules;
    }

    /// @notice Add a safety rule
    /// @param _safetyRule The safety rule to add
    function addSafetyRule(
        string memory _safetyRule
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        safetyRules.push(_safetyRule);

        emit SafetyRuleAdded(safetyRules.length - 1, _safetyRule);
    }

    /// @notice Add multiple safety rules
    /// @param _safetyRules The safety rules to add
    function addSafetyRules(
        string[] memory _safetyRules
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < _safetyRules.length; i++) {
            safetyRules.push(_safetyRules[i]);

            emit SafetyRuleAdded(safetyRules.length - 1, _safetyRules[i]);
        }
    }

    /// @notice Set a safety rule
    /// @param index The index of the safety rule to set
    function setSafetyRule(
        uint256 index,
        string memory _safetyRule
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < safetyRules.length, "Index out of bounds");

        safetyRules[index] = _safetyRule;

        emit SafetyRuleSet(index, _safetyRule);
    }

    /// @notice Delete a safety rule
    /// @param index The index of the safety rule to delete
    function deleteSafetyRule(
        uint256 index
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < safetyRules.length, "Index out of bounds");

        for (uint256 i = index; i < safetyRules.length - 1; i++) {
            safetyRules[i] = safetyRules[i + 1];
        }

        safetyRules.pop();

        emit SafetyRuleDeleted(index);
    }

    // Constraints ------------------------------------------------------------

    /// @notice Get the number of constraints
    /// @return The number of constraints
    function constraintsCount() external view returns (uint256) {
        return constraints.length;
    }

    /// @notice Get the constraints
    /// @return The constraints
    function getConstraints() external view returns (string[] memory) {
        return constraints;
    }

    /// @notice Add a constraint
    /// @param _constraint The constraint to add
    function addConstraint(
        string memory _constraint
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        constraints.push(_constraint);

        emit ConstraintAdded(constraints.length - 1, _constraint);
    }

    /// @notice Add multiple constraints
    /// @param _constraints The constraints to add
    function addConstraints(
        string[] memory _constraints
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < _constraints.length; i++) {
            constraints.push(_constraints[i]);

            emit ConstraintAdded(constraints.length - 1, _constraints[i]);
        }
    }

    /// @notice Set a constraint
    /// @param index The index of the constraint to set
    function setConstraint(
        uint256 index,
        string memory _constraint
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < constraints.length, "Index out of bounds");

        constraints[index] = _constraint;

        emit ConstraintSet(index, _constraint);
    }

    /// @notice Delete a constraint
    /// @param index The index of the constraint to delete
    function deleteConstraint(
        uint256 index
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < constraints.length, "Index out of bounds");

        for (uint256 i = index; i < constraints.length - 1; i++) {
            constraints[i] = constraints[i + 1];
        }

        constraints.pop();

        emit ConstraintDeleted(index);
    }
}
