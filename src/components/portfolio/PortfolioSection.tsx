"use client";

import { client } from "@/consts/client";
import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { Box, Wrap, WrapItem, Text, Flex, Alert, AlertIcon, Center } from "@chakra-ui/react";
import type { NftContract } from "@/consts/nft_contracts";
import { DDCCard } from "@/components/ddc/DDCCard";

// Helper function to convert uint256 to string format for display
function formatTokenId(tokenId: bigint): string {
  return tokenId.toString();
}

type Props = {
  address: string;
  selectedCollection: NftContract;
};

export function PortfolioSection({ address, selectedCollection }: Props) {
  // Initialize contract
  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  // Get all token IDs using walletOfOwner
  const { data: tokenIds, error: tokenIdsError, isLoading } = useReadContract({
    contract,
    method: "function walletOfOwner(address) returns (uint256[])",
    params: [address],
  });

  if (isLoading) {
    return (
      <Center w="100%">
        <Text>Loading your DDCs...</Text>
      </Center>
    );
  }

  if (tokenIdsError) {
    return (
      <Center w="100%">
        <Alert status="error" flexDirection="column" alignItems="start" width="100%" maxWidth="600px" p={4}>
          <Flex w="100%" alignItems="center">
            <AlertIcon />
            <Text fontWeight="bold">Error loading your DDCs</Text>
          </Flex>
          <Text mt={2}>{tokenIdsError.message}</Text>
        </Alert>
      </Center>
    );
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <Center w="100%">
        <Alert status="info">
          <AlertIcon />
          No DDCs found in your account
        </Alert>
      </Center>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto" px={4}>
      <Flex direction="column" gap="4">
        <Text 
          fontSize="xl" 
          fontWeight="bold" 
          textAlign="center" 
          w="100%" 
          my={5}
        >
          DDCs in Account: {tokenIds.length}
        </Text>
        <Center>
          <Wrap spacing="30px" justify="center">
            {tokenIds.map((tokenId) => (
              <WrapItem key={tokenId.toString()}>
                <DDCCard 
                  tokenId={tokenId}
                  contract={contract}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Center>
      </Flex>
    </Box>
  );
}