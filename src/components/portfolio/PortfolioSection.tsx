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
  // Check if the address is valid before proceeding
  const isValidAddress = address && address.startsWith('0x') && address.length === 42;
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('PortfolioSection rendering for address:', address);
    console.log('Address valid:', isValidAddress);
    console.log('Using client ID:', client.clientId);
  }
  
  // Return early if address is not valid to prevent unnecessary contract calls
  if (!isValidAddress) {
    return (
      <Center w="100%">
        <Alert status="info">
          <AlertIcon />
          Waiting for wallet connection...
        </Alert>
      </Center>
    );
  }

  // Initialize contract
  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });
  
  // Debug logging for contract
  if (typeof window !== 'undefined') {
    console.log('Contract initialized:', contract.address, contract.chain.id);
  }

  // Get balance first
  const { data: balance, error: balanceError } = useReadContract({
    contract,
    method: "function balanceOf(address) returns (uint256)",
    params: [address],
    queryOptions: {
      enabled: isValidAddress && !!contract  // Only run if address is valid and contract is initialized
      // Limiting retry to prevent excessive calls
      // retry: 3
    }
  });
  
  // Debug logging for balance
  if (typeof window !== 'undefined') {
    if (balance) {
      console.log('Balance fetched successfully:', balance.toString());
    }
    // Only log real errors (not empty objects that occur during initialization)
    if (balanceError && Object.keys(balanceError).length > 0) {
      console.error('Error fetching balance:', balanceError);
    }
  }

  // Get all token IDs using walletOfOwner
  const { data: tokenIds, error: tokenIdsError } = useReadContract({
    contract,
    method: "function walletOfOwner(address) returns (uint256[])",
    params: [address],
    queryOptions: {
      enabled: isValidAddress && !!contract && !!balance && balance > 0n
      // Limiting retry to prevent excessive calls
      // retry: 3
    }
  });
  
  // Debug logging for token IDs
  if (typeof window !== 'undefined') {
    if (tokenIds) {
      console.log('Token IDs fetched successfully:', tokenIds.map(id => id.toString()));
    }
    // Only log real errors (not empty objects that occur during initialization)
    if (tokenIdsError && Object.keys(tokenIdsError).length > 0) {
      console.error('Error fetching token IDs:', tokenIdsError);
    }
  }

  // Get DDC data for each token
  const { data: ddcData, isLoading: isLoadingDDC } = useReadContract({
    contract,
    method: "function getDDCStruct(uint256) returns (uint32, uint16, uint16, uint16, uint16, uint16, uint16)",
    params: tokenIds && tokenIds.length > 0 ? [tokenIds[0]] : [0n], // Default to token ID 0 if no tokens
    queryOptions: {
      enabled: isValidAddress && !!contract && !!tokenIds && tokenIds.length > 0
    }
  });

  // Only show errors if they're not empty objects (which often happen during initial loading)
  const hasRealBalanceError = balanceError && Object.keys(balanceError).length > 0;
  const hasRealTokenIdsError = tokenIdsError && Object.keys(tokenIdsError).length > 0;
  
  if (hasRealBalanceError || hasRealTokenIdsError) {
    // Log detailed error information
    if (typeof window !== 'undefined') {
      console.error('Portfolio error details:', {
        balanceError,
        tokenIdsError,
        address,
        contractAddress: selectedCollection.address,
        chainId: selectedCollection.chain.id
      });
    }
    
    return (
      <Center w="100%">
        <Alert status="error" flexDirection="column" alignItems="start" width="100%" maxWidth="600px" p={4}>
          <Flex w="100%" alignItems="center">
            <AlertIcon />
            <Text fontWeight="bold">Error loading your DDCs</Text>
          </Flex>
          <Text mt={2}>{hasRealBalanceError ? balanceError?.message : hasRealTokenIdsError ? tokenIdsError?.message : 'Failed to fetch'}</Text>
          <Text mt={2} fontSize="sm" color="gray.600">
            Wallet: {address}<br />
            Contract: {selectedCollection.address}<br />
            Chain: {selectedCollection.chain.id}
          </Text>
        </Alert>
      </Center>
    );
  }

  if (!balance || balance === 0n) {
    return (
      <Center w="100%">
        <Alert status="info">
          <AlertIcon />
          No DDCs found in account {address}
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
          DDCs in Account: {balance?.toString()}
        </Text>
        <Center>
          <Wrap spacing="30px" justify="center">
            {tokenIds && tokenIds.map((tokenId) => (
              <WrapItem key={tokenId.toString()}>
                <DDCCard 
                  tokenId={tokenId.toString()}
                  collection={selectedCollection} 
                />
              </WrapItem>
            ))}
          </Wrap>
        </Center>
      </Flex>
    </Box>
  );
}