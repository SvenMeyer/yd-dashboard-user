"use client";

import { useState, useEffect } from "react";
import { Box, Wrap, WrapItem, Text, Flex } from "@chakra-ui/react";
import { client } from "@/consts/client";
import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { DDCCard } from "@/components/ddc/DDCCard";
import { stringToTokenId } from "@/lib/mapping-tokenId-string";

import type { NftContract } from "@/consts/nft_contracts";

type Props = {
  tokenId: bigint | string;
  selectedCollection: NftContract;
};

export function SearchResult({ tokenId, selectedCollection }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Handle numeric input by converting to string first
  const tokenIdStr = typeof tokenId === 'bigint' ? tokenId.toString() : tokenId;

  const contract = getContract({
    client,
    address: selectedCollection.address,
    chain: selectedCollection.chain
  });

  // Try to convert the tokenId to a uint256 safely
  let tokenIdUint256: bigint;
  try {
    // If it's already a bigint, use it directly
    if (typeof tokenId === 'bigint') {
      tokenIdUint256 = tokenId;
    } else {
      // Otherwise use the stringToTokenId function for conversion
      tokenIdUint256 = stringToTokenId(tokenIdStr);
    }
  } catch (err) {
    console.error('Error converting token ID:', err);
    setError('Invalid token ID format');
    setIsLoading(false);
    tokenIdUint256 = BigInt(0); // Fallback value
  }
  
  const { data: tokenOwner, isLoading: ownerLoading, error: ownerError } = useReadContract({
    contract,
    method: "function ownerOf(uint256 tokenId) returns (address)",
    params: [tokenIdUint256],
    queryOptions: {
      enabled: !error, // Only run if there's no conversion error
      retry: 2,
    }
  });

  useEffect(() => {
    if (!ownerLoading || ownerError || error) {
      setIsLoading(false);
    }
  }, [ownerLoading, ownerError, error]);

  if (isLoading) {
    return (
      <Flex justify="center" width="100%">
        <Text fontSize="md" px={4} py={2}>
          Searching for DDC ...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" width="100%">
        <Text fontSize="md" px={4} py={2}>
          Invalid token ID format
        </Text>
      </Flex>
    );
  }

  const isFound = tokenOwner !== undefined && !ownerError;

  return (
    <Box>
      {isFound ? (
        <Wrap spacing={6} justify="center" align="center">
          <WrapItem>
            <DDCCard 
              tokenId={tokenIdUint256}
              contract={contract}
            />
          </WrapItem>
        </Wrap>
      ) : (
        <Flex justify="center" width="100%">
          <Text fontSize="md" px={4} py={2}>
            No DDC found with ID: {tokenIdStr}
          </Text>
        </Flex>
      )}
    </Box>
  );
}