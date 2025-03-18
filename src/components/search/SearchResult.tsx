import { useState, useEffect } from "react";
import { Box, Wrap, WrapItem, Text, Flex, Alert, AlertIcon } from "@chakra-ui/react";
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
    
    console.log('Token ID conversion in SearchResult:', {
      original: tokenId,
      uint256: tokenIdUint256.toString()
    });
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
    
    if (ownerError) {
      console.error('Error fetching token owner:', ownerError);
      setError('Token not found or contract error');
    }
  }, [ownerLoading, ownerError, error]);

  if (isLoading) {
    return <Text fontSize="default" fontWeight="default" color="default">Searching for DDC ...</Text>;
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" borderRadius="md">
        <AlertIcon />
        <Text fontWeight="bold">{error}</Text>
      </Alert>
    );
  }

  const isFound = tokenOwner !== undefined;

  return (
    <Box>
      <Alert
        status={isFound ? "success" : "error"}
        variant="subtle"
        borderRadius="md"
        mb={4}
      >
        <Flex align="center" width="100%">
          <AlertIcon />
          <Text fontWeight="bold" mr={2}>
            {isFound 
              ? `DDC with Token ID ${tokenIdStr} found` 
              : `DDC with Token ID ${tokenIdStr} not found`}
          </Text>
        </Flex>
      </Alert>
      
      {isFound && (
        <Wrap spacing={6} justify="center" align="center">
          <WrapItem>
            <DDCCard 
              tokenId={tokenIdStr}
              collection={selectedCollection}
              ddcData={null} // We'll fetch this data in the DDCCard component
            />
          </WrapItem>
        </Wrap>
      )}
    </Box>
  );
}