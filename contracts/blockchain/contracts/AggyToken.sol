// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.29;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

contract AggyToken is
    ERC20,
    ERC20Burnable,
    AccessControl,
    ERC20Permit,
    ERC20Votes
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    address public aggyCore;
    bool public initialized;

    constructor() ERC20("AggyToken", "AGGY") ERC20Permit("AggyToken") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Get the number of decimals
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /// @notice Initialize the contract
    /// @param _aggyCore The AggyCore contract address
    function initialize(address _aggyCore) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!initialized, "AggyToken: already initialized");
        initialized = true;

        aggyCore = _aggyCore;
        _grantRole(DEFAULT_ADMIN_ROLE, _aggyCore);
        _grantRole(MINTER_ROLE, _aggyCore);

        // initial supply
        _mint(aggyCore, 1000000000 * (10 ** decimals()));

        _revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Mint tokens
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /// @notice Not sure what this is for - part of the ERC20Votes interface?
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    /// @notice Not sure what this is for - part of the ERC20Votes interface?
    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
