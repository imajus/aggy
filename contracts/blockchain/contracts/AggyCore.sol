// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AggyCore is AccessControl {
    bytes32 public constant AGGY_ROLE = keccak256("AGGY_ROLE");

    string public purpose;
    string[] public safetyRules;
    string[][] public logic;
    string[] public constraints;

    event SafetyRuleAdded(uint256 index, string safetyRule);
    event SafetyRuleSet(uint256 index, string safetyRule);
    event SafetyRuleDeleted(uint256 index);
    event LogicAdded(uint256 index, string[] logic);
    event LogicSet(uint256 index, string[] logic);
    event LogicDeleted(uint256 index);
    event ConstraintAdded(uint256 index, string constraint);
    event ConstraintUpdated(uint256 index, string constraint);
    event ConstraintDeleted(uint256 index);

    constructor(string memory _purpose, string[] memory _safetyRules) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        purpose = _purpose;

        for (uint256 i = 0; i < _safetyRules.length; i++) {
            safetyRules.push(_safetyRules[i]);
        }
    }

    function safetyRulesCount() external view returns (uint256) {
        return safetyRules.length;
    }

    function addSafetyRule(
        string memory _safetyRule
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        safetyRules.push(_safetyRule);

        emit SafetyRuleAdded(safetyRules.length - 1, _safetyRule);
    }

    function addSafetyRules(
        string[] memory _safetyRules
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < _safetyRules.length; i++) {
            safetyRules.push(_safetyRules[i]);

            emit SafetyRuleAdded(safetyRules.length - 1, _safetyRules[i]);
        }
    }

    function setSafetyRule(
        uint256 index,
        string memory _safetyRule
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < safetyRules.length, "Index out of bounds");

        safetyRules[index] = _safetyRule;

        emit SafetyRuleSet(index, _safetyRule);
    }

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

    function logicCount() external view returns (uint256) {
        return logic.length;
    }

    function logicAtIndex(
        uint256 index
    ) external view returns (string[] memory) {
        require(index < logic.length, "Index out of bounds");

        return logic[index];
    }

    function logicCountAtIndex(uint256 index) external view returns (uint256) {
        require(index < logic.length, "Index out of bounds");

        return logic[index].length;
    }

    function addLogic(
        string[] memory _logic
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        logic.push(_logic);

        emit LogicAdded(logic.length - 1, _logic);
    }

    function addLogics(
        string[][] memory _logics
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < _logics.length; i++) {
            logic.push(_logics[i]);

            emit LogicAdded(logic.length - 1, _logics[i]);
        }
    }

    function setLogic(
        uint256 index,
        string[] memory _logic
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < logic.length, "Index out of bounds");

        logic[index] = _logic;

        emit LogicSet(index, _logic);
    }

    function deleteLogic(uint256 index) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < logic.length, "Index out of bounds");

        for (uint256 i = index; i < logic.length - 1; i++) {
            logic[i] = logic[i + 1];
        }

        logic.pop();

        emit LogicDeleted(index);
    }

    function addConstraint(
        string memory _constraint
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        constraints.push(_constraint);

        emit ConstraintAdded(constraints.length - 1, _constraint);
    }

    function addConstraints(
        string[] memory _constraints
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < _constraints.length; i++) {
            constraints.push(_constraints[i]);

            emit ConstraintAdded(constraints.length - 1, _constraints[i]);
        }
    }

    function updateConstraint(
        uint256 index,
        string memory _constraint
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(index < constraints.length, "Index out of bounds");

        constraints[index] = _constraint;

        emit ConstraintUpdated(index, _constraint);
    }

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
