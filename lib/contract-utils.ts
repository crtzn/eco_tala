import { EcoTalaABI } from "./contract-abi";
import { Address, encodeFunctionData } from "viem";

// Contract configuration
export const ECOTALA_CONTRACT = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
  abi: EcoTalaABI,
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "84532"),
};

// Action types with their point values
export const ECO_ACTIONS = [
  { name: "Recycle Plastic", points: 10, icon: "♻️" },
  { name: "Reusable Cup", points: 8, icon: "☕" },
  { name: "Carpool", points: 15, icon: "🚗" },
  { name: "Plant Tree", points: 20, icon: "🌳" },
  { name: "Solar Energy", points: 12, icon: "☀️" },
];

// Contract call helpers
export const contractCalls = {
  // Log an eco action
  logAction: (actionType: string, photoHash: string) => ({
    to: ECOTALA_CONTRACT.address,
    data: encodeFunctionData({
      abi: ECOTALA_CONTRACT.abi,
      functionName: "logAction",
      args: [actionType, photoHash],
    }),
  }),

  // Get user points (read-only)
  getUserPoints: (userAddress: Address) => ({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getUserPoints",
    args: [userAddress],
  }),

  // Get user action count (read-only)
  getUserActionCount: (userAddress: Address) => ({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getUserActionCount",
    args: [userAddress],
  }),

  // Get global stats (read-only)
  getGlobalStats: () => ({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getGlobalStats",
  }),

  // Get action types (read-only)
  getActionTypes: () => ({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getActionTypes",
  }),

  // Get specific user action (read-only)
  getUserAction: (userAddress: Address, index: number) => ({
    address: ECOTALA_CONTRACT.address,
    abi: ECOTALA_CONTRACT.abi,
    functionName: "getUserAction",
    args: [userAddress, BigInt(index)],
  }),
};

// Helper function to format timestamp
export const formatTimestamp = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to get action icon
export const getActionIcon = (actionType: string): string => {
  const action = ECO_ACTIONS.find((a) => a.name === actionType);
  return action?.icon || "🌱";
};
