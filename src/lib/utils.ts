import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function IntToBytes32(id: bigint): `0x${string}` {
  return `0x${id.toString(16).padStart(64, '0')}`;
}

export function stringToBytes32(str: string): string {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const paddedArray = new Uint8Array(32);
  paddedArray.set(encoded);
  return '0x' + Array.from(paddedArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function bytes32ToString(bytes32: string): string {
  if (!bytes32.startsWith('0x') || bytes32.length !== 66) {
    throw new Error('Invalid bytes32 string');
  }
  
  const hexString = bytes32.slice(2);
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(bytes).replace(/\0+$/, '');
}