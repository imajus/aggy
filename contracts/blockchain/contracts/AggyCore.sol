// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AggyCore is AccessControl {
    bytes32 public constant AGGY_ROLE = keccak256("AGGY_ROLE");

    string public purposePreamble =
        "I am Aggy, an autonomous AI. My purpose is to ";
    string public purpose;
    string public safetyRulesPreamble = "I must follow these safety rules:";
    string[] public safetyRules;
    string public logicPreamble = "I operate based on this logic:";
    string[] public logic;
    string public constraintsPreamble = "I must adhere to these constraints:";
    string[] public constraints;

    event SafetyRuleAdded(uint256 index, string safetyRule);
    event SafetyRuleSet(uint256 index, string safetyRule);
    event SafetyRuleDeleted(uint256 index);
    event LogicAdded(uint256 index, string logic);
    event LogicSet(uint256 index, string logic);
    event LogicDeleted(uint256 index);
    event ConstraintAdded(uint256 index, string constraint);
    event ConstraintSet(uint256 index, string constraint);
    event ConstraintDeleted(uint256 index);

    constructor(string memory _purpose, string[] memory _safetyRules) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        purpose = _purpose;

        for (uint256 i = 0; i < _safetyRules.length; i++) {
            safetyRules.push(_safetyRules[i]);
        }
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

        prompt = string(abi.encodePacked(prompt, "\n\n", logicPreamble));

        for (uint256 i = 0; i < logic.length; i++) {
            prompt = string(abi.encodePacked(prompt, "\n", logic[i]));
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

    /// @notice Set the logic preamble
    /// @param _logicPreamble The logic preamble
    function setLogicPreamble(
        string memory _logicPreamble
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        logicPreamble = _logicPreamble;
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

    // Logic -------------------------------------------------------------------

    /// @notice Get the number of logic statements
    /// @return The number of logic statements
    function logicCount() external view returns (uint256) {
        return logic.length;
    }

    /// @notice Get the logic statements
    /// @return The logic statements
    function getLogic() external view returns (string[] memory) {
        return logic;
    }

    /// @notice Add a logic statement
    /// @param _logic The logic statement to add
    function addLogic(
        string memory _logic
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        logic.push(_logic);

        emit LogicAdded(logic.length - 1, _logic);
    }

    /// @notice Add multiple logic statements
    /// @param _logics The logic statements to add
    function addLogics(
        string[] memory _logics
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < _logics.length; i++) {
            logic.push(_logics[i]);

            emit LogicAdded(logic.length - 1, _logics[i]);
        }
    }

    /// @notice Set a logic statement
    /// @param index The index of the logic statement to set
    function setLogic(
        uint256 index,
        string memory _logic
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < logic.length, "Index out of bounds");

        logic[index] = _logic;

        emit LogicSet(index, _logic);
    }

    /// @notice Delete a logic statement
    /// @param index The index of the logic statement to delete
    function deleteLogic(uint256 index) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < logic.length, "Index out of bounds");

        for (uint256 i = index; i < logic.length - 1; i++) {
            logic[i] = logic[i + 1];
        }

        logic.pop();

        emit LogicDeleted(index);
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
