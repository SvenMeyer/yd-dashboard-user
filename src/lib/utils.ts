import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Keeping these functions for backward compatibility and transition
export function uint256ToBytes32(id: bigint): `0x${string}` {
  return `0x${id.toString(16).padStart(64, '0')}`;
}

export function bytes32ToUint256(bytes32: string): bigint {
  // Remove '0x' prefix if present
  const hexString = bytes32.startsWith('0x') ? bytes32.slice(2) : bytes32;
  
  // Ensure the input is a valid 256-bit (64 character) hexadecimal string
  if (!/^[0-9a-fA-F]{64}$/.test(hexString)) {
    throw new Error('Invalid bytes32 string');
  }
  
  return BigInt(`0x${hexString}`);
}

// Updated to work with uint256 instead of bytes32
export function stringToUint256(str: string): bigint {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const paddedArray = new Uint8Array(32);
  paddedArray.set(encoded);
  const hexString = Array.from(paddedArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return BigInt(`0x${hexString}`);
}

// Legacy function for backward compatibility
export function stringToBytes32(str: string): `0x${string}` {
  const value = stringToUint256(str);
  return uint256ToBytes32(value);
}

export function uint256ToString(value: bigint): string {
  const hexString = value.toString(16).padStart(64, '0');
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(bytes).replace(/\0+$/, '');
}

// Legacy function for backward compatibility
export function bytes32ToString(bytes32: string): string {
  if (!bytes32.startsWith('0x') || bytes32.length !== 66) {
    throw new Error('Invalid bytes32 string');
  }
  
  const hexString = bytes32.slice(2);
  const value = BigInt(`0x${hexString}`);
  return uint256ToString(value);
}

// Updated naming for clarity
export function Uint256ToString(value: bigint): string {
  return uint256ToString(value);
}

export function StringToUint256(str: string): bigint {
  return stringToUint256(str);
}