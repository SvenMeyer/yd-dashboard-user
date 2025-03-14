import { defineChain } from "thirdweb";
import { avalancheFuji as baseAvalancheFuji, sepolia as baseSepolia, polygonAmoy as basePolygonAmoy } from "thirdweb/chains";

/**
 * Custom chain configurations with RPC URLs
 */
export const sepolia = {
  ...baseSepolia,
  // Use Alchemy's public RPC URL for Sepolia which has higher rate limits
  rpc: "https://eth-sepolia.g.alchemy.com/v2/demo"
};

export const polygonAmoy = {
  ...basePolygonAmoy,
  // Use a public RPC URL for Polygon Amoy
  rpc: "https://polygon-amoy.blockpi.network/v1/rpc/public"
};

// Re-export avalancheFuji for consistency
export const avalancheFuji = baseAvalancheFuji;

/**
 * Define any custom chain using `defineChain`
 */
export const example_customChain1 = defineChain(0.001); // don't actually use this
