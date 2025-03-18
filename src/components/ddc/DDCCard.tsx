import { useReadContract } from "thirdweb/react";
import { Box, Image, Text, VStack, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";
import { getContract } from "thirdweb";
import { client } from "@/consts/client";
import { reverseMappingDiamondProperties } from "@/lib/property-mapping";
import { stringToTokenId } from "@/lib/mapping-tokenId-string";
import { Link } from "@chakra-ui/react";
import type { NftContract } from "@/consts/nft_contracts";

type DDCCardProps = {
  tokenId: string;
  collection: NftContract;
  ddcData?: any; // Optional, if not provided we'll fetch it
};

export function DDCCard({ tokenId, collection, ddcData: initialDdcData }: DDCCardProps) {
  // Format the token ID for display (maybe show first/last few characters)
  const displayTokenId = tokenId.length > 10 ? 
    `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}` : tokenId;
  
  // Convert string to uint256 using the mapping utility
  let tokenIdUint256: bigint;
  try {
    // Use the stringToTokenId function for conversion
    tokenIdUint256 = stringToTokenId(tokenId);
    
    console.log('Token ID conversion in DDCCard:', {
      original: tokenId,
      uint256: tokenIdUint256.toString()
    });
  } catch (err) {
    console.error('Error converting token ID in DDCCard:', err);
    // Provide a fallback
    tokenIdUint256 = BigInt(0);
  }
  
  // Initialize contract
  const contract = getContract({
    address: collection.address,
    chain: collection.chain,
    client,
  });
  
  // Fetch DDC data if not provided and not a test token
  const { data: fetchedDdcData, isLoading, error: ddcError } = useReadContract({
    contract,
    method: "function getDDCStruct(uint256) returns (uint32, uint16, uint16, uint16, uint16, uint16, uint16)",
    params: [tokenIdUint256],
    queryOptions: {
      enabled: !initialDdcData && tokenIdUint256 !== BigInt(0),
      retry: 2,
    }
  });
  
  // Log any errors for debugging
  if (ddcError) {
    console.error('Error fetching DDC data:', ddcError, 'for token ID:', tokenId, 'as uint256:', tokenIdUint256.toString());
  }
  
  // Use provided data or fetched data - no mock data
  const ddcData = initialDdcData || fetchedDdcData;
  
  // Fetch token URI for image
  const { data: tokenURI, isLoading: isLoadingURI } = useReadContract({
    contract,
    method: "function tokenURI(uint256) returns (string)",
    params: [tokenIdUint256],
    queryOptions: {
      enabled: tokenIdUint256 !== BigInt(0),
    }
  });
  
  return (
    <Box
      as={Link}
      href={`/collection/${collection.chain.id}/${collection.address}/token/${tokenId}`}
      _hover={{ textDecoration: "none" }}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      minW="200px"
      maxW="300px"
      bg="white"
      boxShadow="md"
    >
      <VStack spacing={3} align="start">
        <Text fontWeight="bold" fontSize="lg">DDC #{displayTokenId}</Text>
        
        {isLoading ? (
          <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        ) : ddcData ? (
          <>
            <HStack w="100%" justifyContent="space-between">
              <Text fontWeight="medium">Carat:</Text>
              <Text>{ddcData[0] / 100}</Text>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
              <Text fontWeight="medium">Color:</Text>
              <Text>{ddcData[1]}</Text>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
              <Text fontWeight="medium">Clarity:</Text>
              <Text>{ddcData[2]}</Text>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
              <Text fontWeight="medium">Cut:</Text>
              <Text>{ddcData[3]}</Text>
            </HStack>
          </>
        ) : ddcError ? (
          // Show error message
          <VStack align="start" spacing={2}>
            <Text color="red.500">Error loading DDC data</Text>
            <Text fontSize="xs" color="gray.500">Token ID: {tokenId}</Text>
            <Text fontSize="xs" color="gray.500">Error: {ddcError.message}</Text>
          </VStack>
        ) : (
          <Text color="red.500">Failed to load DDC data</Text>
        )}
      </VStack>
    </Box>
  );
}