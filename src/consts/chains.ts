import { defineChain } from "thirdweb";
import { 
  avalancheFuji as baseAvalancheFuji, 
  sepolia as baseEthSepoliaChain, 
  polygonAmoy as basePolygonAmoy,
  base as baseChain,
  baseSepolia as baseBaseSepoliaChain,
  arbitrum as baseArbitrumChain,
  arbitrumSepolia as baseArbitrumSepoliaChain
} from "thirdweb/chains";

/**
 * Custom chain configurations with RPC URLs
 */
export const sepolia = {
  ...baseEthSepoliaChain,
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
 * Base and Arbitrum chains
 */
// Base mainnet
export const base = {
  ...baseChain,
  // You can override the default RPC URL if needed
  rpc: "https://mainnet.base.org" 
};

// Base Sepolia testnet
export const baseSepolia = {
  ...baseBaseSepoliaChain,
  rpc: "https://sepolia.base.org"
};

// Arbitrum One (mainnet)
export const arbitrum = {
  ...baseArbitrumChain,
  rpc: "https://arb1.arbitrum.io/rpc"
};

// Arbitrum Sepolia testnet
export const arbitrumSepolia = {
  ...baseArbitrumSepoliaChain,
  rpc: "https://sepolia-rollup.arbitrum.io/rpc"
};

/**
 * Define any custom chain using `defineChain`
 */
export const example_customChain1 = defineChain(0.001); // don't actually use this
