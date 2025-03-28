// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

interface IAggyToken {
    function decimals() external view returns (uint8);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function mint(address to, uint256 amount) external;

    function burn(uint256 amount) external;
}
