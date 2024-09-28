import { useState, useEffect } from "react";
import { Box, Wrap, WrapItem, Text, Flex, Alert, AlertIcon } from "@chakra-ui/react";
import { client } from "@/consts/client";
import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { DDCCard } from "@/components/ddc/DDCCard";
import { Uint256ToString } from "@/lib/utils";

import type { NftContract } from "@/consts/nft_contracts";

type Props = {
  tokenId: bigint;
  selectedCollection: NftContract;
};

export function SearchResult({ tokenId, selectedCollection }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contract = getContract({
    client,
    address: selectedCollection.address,
    chain: selectedCollection.chain
  });

  const { data: tokenOwner, isLoading: ownerLoading } = useReadContract({
    contract,
    method: "function ownerOf(uint256 tokenId) returns (address)",
    params: [tokenId],
  });

  useEffect(() => {
    if (!ownerLoading) {
      setIsLoading(false);
    }
  }, [ownerLoading]);

  if (isLoading) {
    return <Text fontSize="default" fontWeight="default" color="default">Searching for DDC ...</Text>;
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
              ? `DDC with Token ID ${Uint256ToString(tokenId)} found` 
              : `DDC with Token ID ${Uint256ToString(tokenId)} not found`}
          </Text>
        </Flex>
      </Alert>
      
      {isFound && (
        <Wrap spacing={6} justify="center" align="center">
          <WrapItem>
            <DDCCard tokenId={tokenId} contract={contract} />
          </WrapItem>
        </Wrap>
      )}
    </Box>
  );
}