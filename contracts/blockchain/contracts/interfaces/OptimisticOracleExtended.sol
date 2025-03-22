// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {OptimisticOracleV3Interface} from "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";

interface OptimisticOracleExtended is OptimisticOracleV3Interface {
    function defaultCurrency() external view returns (address);
}
