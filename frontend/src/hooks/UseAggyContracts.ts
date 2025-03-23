"use client";

import type {
  PostMethodArgs,
  MethodCallResponse,
  TransactionToSignResponse,
} from "@curvegrid/multibaas-sdk";
import { Configuration, ContractsApi } from "@curvegrid/multibaas-sdk";
import { useMemo, useCallback } from "react";
import { useAccount } from "wagmi";

/**
 * Adjust these return types as needed based on how your contract returns data:
 * e.g., bytes32, address, string, number, etc.
 */
type Bytes32 = string;
type Address = string;
type UInt256 = string;
type Bool = boolean;

interface AggyReadHook {
  getDefaultAdminRole: () => Promise<Bytes32 | null>;
  getVerifierRole: () => Promise<Bytes32 | null>;
  getAggyToken: () => Promise<Address | null>;
  getConstraints: () => Promise<string | null>;
  getConstraintsPreamble: () => Promise<string | null>;
  getDecimals: () => Promise<number | null>;
  getCombinedInstructions: () => Promise<string | null>;
  getRoleAdmin: (role: Bytes32) => Promise<Bytes32 | null>;
  hasRole: (role: Bytes32, account: Address) => Promise<Bool | null>;
  getInstructions: () => Promise<string | null>;
  getInstructionsPreamble: () => Promise<string | null>;
  getOptimisticOracle: () => Promise<Address | null>;
  getSafetyRules: () => Promise<string | null>;
  getSafetyRulesPreamble: () => Promise<string | null>;
  getSupportsInterface: (interfaceId: Bytes32) => Promise<Bool | null>;
  getTaskFactory: () => Promise<Address | null>;
}

/**
 * A MultiBaas hook that exposes read calls to your Aggy contract.
 * Replace method names/args as needed to match your contract’s ABI.
 */
export default function useAggyContract(): AggyReadHook {
  const mbBaseUrl = process.env.NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL || "";
  const mbApiKey = process.env.NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY || "";
  const contractLabel =
    process.env.NEXT_PUBLIC_MULTIBAAS_AGGY_CONTRACT_LABEL || ""; // Adjust as needed
  const addressLabel =
    process.env.NEXT_PUBLIC_MULTIBAAS_AGGY_ADDRESS_LABEL || ""; // Adjust as needed

  // If your contract is deployed to Ethereum, keep "ethereum" or replace with chain name if needed.
  const chain = "ethereum";

  const chainId = process.env.NEXT_PUBLIC_MULTIBAAS_CHAIN_ID || "";

  // 1) Memoize the MultiBaas config
  const mbConfig = useMemo(() => {
    return new Configuration({
      basePath: new URL("/api/v0", mbBaseUrl).toString(),
      accessToken: mbApiKey,
    });
  }, [mbBaseUrl, mbApiKey]);

  // 2) Create the ContractsApi instance
  const contractsApi = useMemo(() => new ContractsApi(mbConfig), [mbConfig]);

  // 3) Grab user’s address for `from:` if needed
  const { address, isConnected } = useAccount();

  // 4) Helper: Call any contract function by name
  const callContractFunction = useCallback(
    async (
      methodName: string,
      args: PostMethodArgs["args"] = []
    ): Promise<MethodCallResponse["output"] | TransactionToSignResponse["tx"]> => {
      const payload: PostMethodArgs = {
        args,
        contractOverride: true,
        // If you want the transaction to come from the user’s wallet
        ...(isConnected && address ? { from: address } : {}),
      };

      const response = await contractsApi.callContractFunction(
        chain,
        addressLabel,  // The address ID in MultiBaas
        contractLabel, // The contract label in MultiBaas
        methodName,    // The function name in your contract
        payload
      );

      if (response.data.result.kind === "MethodCallResponse") {
        return response.data.result.output;
      } else if (response.data.result.kind === "TransactionToSignResponse") {
        // Typically read calls won't return a tx, but handle it anyway
        return response.data.result.tx;
      } else {
        throw new Error(`Unexpected response type: ${response.data.result.kind}`);
      }
    },
    [contractsApi, chain, addressLabel, contractLabel, isConnected, address]
  );

  // 5) Define each read method in your contract

  const getDefaultAdminRole = useCallback(async (): Promise<Bytes32 | null> => {
    try {
      // If your contract’s function is literally called `DEFAULT_ADMIN_ROLE()` in the ABI
      // it might be accessible by that name. If not, rename here.
      return (await callContractFunction("DEFAULT_ADMIN_ROLE")) as Bytes32;
    } catch (err) {
      console.error("Error reading DEFAULT_ADMIN_ROLE:", err);
      return null;
    }
  }, [callContractFunction]);

  const getVerifierRole = useCallback(async (): Promise<Bytes32 | null> => {
    try {
      return (await callContractFunction("VERIFIER_ROLE")) as Bytes32;
    } catch (err) {
      console.error("Error reading VERIFIER_ROLE:", err);
      return null;
    }
  }, [callContractFunction]);

  const getAggyToken = useCallback(async (): Promise<Address | null> => {
    try {
      return (await callContractFunction("aggyToken")) as Address;
    } catch (err) {
      console.error("Error reading aggyToken:", err);
      return null;
    }
  }, [callContractFunction]);

  const getConstraints = useCallback(async (): Promise<string | null> => {
    try {
      return (await callContractFunction("constraints")) as string;
    } catch (err) {
      console.error("Error reading constraints:", err);
      return null;
    }
  }, [callContractFunction]);

  const getConstraintsPreamble = useCallback(async (): Promise<string | null> => {
    try {
      return (await callContractFunction("constraintsPreamble")) as string;
    } catch (err) {
      console.error("Error reading constraintsPreamble:", err);
      return null;
    }
  }, [callContractFunction]);

  const getDecimals = useCallback(async (): Promise<number | null> => {
    try {
      // If your contract’s decimals() returns a uint8 or uint256, cast accordingly.
      // Then parseInt if you want a number in JS.
      const result = await callContractFunction("decimals");
      return parseInt(result as string, 10);
    } catch (err) {
      console.error("Error reading decimals:", err);
      return null;
    }
  }, [callContractFunction]);

  const getCombinedInstructions = useCallback(async (): Promise<string | null> => {
    try {
      return (await callContractFunction("getCombinedInstructions")) as string;
    } catch (err) {
      console.error("Error reading getCombinedInstructions:", err);
      return null;
    }
  }, [callContractFunction]);

  const getRoleAdmin = useCallback(
    async (role: Bytes32): Promise<Bytes32 | null> => {
      try {
        // If getRoleAdmin(bytes32) expects a single bytes32 argument
        return (await callContractFunction("getRoleAdmin", [role])) as Bytes32;
      } catch (err) {
        console.error("Error reading getRoleAdmin:", err);
        return null;
      }
    },
    [callContractFunction]
  );

  const hasRole = useCallback(
    async (role: Bytes32, account: Address): Promise<Bool | null> => {
      try {
        // e.g. hasRole(bytes32 role, address account)
        return (await callContractFunction("hasRole", [role, account])) as Bool;
      } catch (err) {
        console.error("Error reading hasRole:", err);
        return null;
      }
    },
    [callContractFunction]
  );

  const getInstructions = useCallback(async (): Promise<string | null> => {
    try {
      return (await callContractFunction("instructions")) as string;
    } catch (err) {
      console.error("Error reading instructions:", err);
      return null;
    }
  }, [callContractFunction]);

  const getInstructionsPreamble = useCallback(async (): Promise<string | null> => {
    try {
      return (await callContractFunction("instructionsPreamble")) as string;
    } catch (err) {
      console.error("Error reading instructionsPreamble:", err);
      return null;
    }
  }, [callContractFunction]);

  const getOptimisticOracle = useCallback(async (): Promise<Address | null> => {
    try {
      return (await callContractFunction("optimisticOracle")) as Address;
    } catch (err) {
      console.error("Error reading optimisticOracle:", err);
      return null;
    }
  }, [callContractFunction]);

  const getSafetyRules = useCallback(async (): Promise<string | null> => {
    try {
      return (await callContractFunction("safetyRules")) as string;
    } catch (err) {
      console.error("Error reading safetyRules:", err);
      return null;
    }
  }, [callContractFunction]);

  const getSafetyRulesPreamble = useCallback(async (): Promise<string | null> => {
    try {
      return (await callContractFunction("safetyRulesPreamble")) as string;
    } catch (err) {
      console.error("Error reading safetyRulesPreamble:", err);
      return null;
    }
  }, [callContractFunction]);

  const getSupportsInterface = useCallback(
    async (interfaceId: Bytes32): Promise<Bool | null> => {
      try {
        // supportsInterface(bytes4 interfaceID)
        // But sometimes it’s bytes4, sometimes bytes32. Adjust accordingly.
        return (await callContractFunction("supportsInterface", [interfaceId])) as Bool;
      } catch (err) {
        console.error("Error reading supportsInterface:", err);
        return null;
      }
    },
    [callContractFunction]
  );

  const getTaskFactory = useCallback(async (): Promise<Address | null> => {
    try {
      return (await callContractFunction("taskFactory")) as Address;
    } catch (err) {
      console.error("Error reading taskFactory:", err);
      return null;
    }
  }, [callContractFunction]);

  // 6) Return all read methods
  return {
    getDefaultAdminRole,
    getVerifierRole,
    getAggyToken,
    getConstraints,
    getConstraintsPreamble,
    getDecimals,
    getCombinedInstructions,
    getRoleAdmin,
    hasRole,
    getInstructions,
    getInstructionsPreamble,
    getOptimisticOracle,
    getSafetyRules,
    getSafetyRulesPreamble,
    getSupportsInterface,
    getTaskFactory,
  };
}
