/**
 * Utility functions for mapping between string IDs and uint256 token IDs
 *
 * These functions handle the conversion between string identifiers (like "IGI-11111111")
 * and uint256 values used as tokenIds in the NFT contract
 */

/**
 * Convert a string ID to a uint256 token ID
 *
 * @param tokenIdStr The string token ID (e.g., "IGI-11111111")
 * @returns A BigInt representing the uint256 token ID
 */
export function stringToTokenId(tokenIdStr: string): bigint {
  // Extract all numeric characters from the string
  const numericPart = tokenIdStr.replace(/\D/g, "");

  // If there are no numeric characters, return 0
  if (numericPart.length === 0) {
    throw new Error("String must contain at least one digit");
  }

  // Convert to bigint
  return BigInt(numericPart);
}

/**
 * Convert a uint256 token ID to a string ID
 *
 * @param tokenId The uint256 token ID as a BigInt
 * @returns A string token ID (e.g., "IGI-11111111")
 */
export function tokenIdToString(tokenId: bigint): string {
  // For now, simply format as an IGI prefixed string
  // TODO: Improve this mapping in the future
  return `IGI-${tokenId.toString()}`;
}

/**
 * Test if two token IDs match (accounting for different representations)
 *
 * @param id1 First token ID (string or bigint)
 * @param id2 Second token ID (string or bigint)
 * @returns true if the IDs match semantically
 */
export function tokenIdsMatch(id1: string | bigint, id2: string | bigint): boolean {
  const id1Normalized = typeof id1 === "string" ? stringToTokenId(id1) : id1;
  const id2Normalized = typeof id2 === "string" ? stringToTokenId(id2) : id2;

  return id1Normalized === id2Normalized;
}
