import { ethers } from "ethers";

/**
 * Converts a string to bytes32 format
 * @param str String to convert (must be 31 characters or less)
 * @returns Bytes32 representation as a hex string
 */
export function stringToBytes32(str: string): string {
  // Ensure string isn't too long
  const bytes = ethers.toUtf8Bytes(str);
  if (bytes.length > 31) {
    throw new Error("String too long for bytes32 (max 31 characters)");
  }

  // Pad right with zeros to get 32 bytes total
  return ethers.hexlify(ethers.concat([bytes, ethers.zeroPadBytes("0x", 32 - bytes.length)]));
}

/**
 * Converts a bytes32 value to a string
 * @param bytes32Value Bytes32 value as a hex string
 * @returns The string representation
 */
export function bytes32ToString(bytes32Value: string): string {
  try {
    // First ensure the input is a proper bytes32 hex string
    const normalized = ethers.hexlify(bytes32Value);

    // Find the first occurrence of a null byte (00)
    let endPos = 2; // Start after the '0x' prefix
    const hex = normalized.substring(2); // Remove '0x' prefix

    for (let i = 0; i < hex.length; i += 2) {
      if (hex.substr(i, 2) === "00") {
        break;
      }
      endPos += 2;
    }

    // If there are no null bytes, use the whole string
    const nonNullHex = normalized.substring(0, endPos);

    // Convert to string
    if (nonNullHex === "0x") {
      return "";
    }

    return ethers.toUtf8String(nonNullHex);
  } catch (error) {
    console.error("Error converting bytes32 to string:", error);
    return "";
  }
}

/**
 * Example usage
 */
// const exampleString = "Hello, Ethereum!";
// const asBytes32 = stringToBytes32(exampleString);
// console.log(`String to bytes32: ${asBytes32}`);
// const backToString = bytes32ToString(asBytes32);
// console.log(`Bytes32 to string: ${backToString}`);
