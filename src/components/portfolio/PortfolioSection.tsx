import { client } from "@/consts/client";
import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react"
import { balanceOf, getOwnedTokenIds, tokenOfOwnerByIndex } from "thirdweb/extensions/erc721";

import { useState, useEffect } from "react";
import { Box, Wrap, WrapItem, Text , Flex} from "@chakra-ui/react";
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

import type { NftContract } from "@/consts/nft_contracts";
import { DDCCard } from "@/components/ddc/DDCCard";

const PAGE_SIZE = 10;

type Props = {
  address: string;
  selectedCollection: NftContract;
};

function padToHex64(num: number): string {
  return num.toString(16).padStart(64, '0');
}

export function PortfolioSection({ address, selectedCollection }: Props) {
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [displayedNFTs, setDisplayedNFTs] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const contract = getContract({
    client,
    address: selectedCollection.address,
    chain: selectedCollection.chain
  });

  // Get the balance (total number of NFTs)
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    contract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [address],
  });

  // Get the owned token IDs
  const { data: ownedTokenIds, isLoading: tokenIdsLoading } = useReadContract(getOwnedTokenIds, {
    contract,
    owner: address,
  });

  useEffect(() => {
    if (!balanceLoading && balance !== undefined) {
      console.log("Balance updated:", Number(balance));
      setTotalNFTs(Number(balance));
    }
  }, [balance, balanceLoading]);

  useEffect(() => {
    if (!tokenIdsLoading && ownedTokenIds) {
      setIsLoading(false);
      setDisplayedNFTs(ownedTokenIds);
    }
  }, [ownedTokenIds, ownedTokenIds]);

  console.log("Rendering PortfolioSection. totalNFTs:", totalNFTs, "address:", address);

  if (balanceLoading) {
    return <Text fontSize="default" fontWeight="default" color="default">Loading DDC balance ...</Text>;
  }

  const isError = balance === undefined;
  const balanceCount = isError ? "Error" : balance.toString();

  return (
    <Box>
      <Alert
        status={isError ? "error" : "info"}
        variant="subtle"
        borderRadius="md"
        mb={4}
      >
        <Flex align="center" width="100%">
          <AlertIcon />
          <Text fontWeight="bold" mr={2}>
            {isError 
              ? `Error: Unable to retrieve the number of DDCs for account ${address}` 
              : `${balanceCount} DDC${balanceCount === "1" ? "" : "s"} found in account ${address}`}
          </Text>
        </Flex>
      </Alert>
      
      <Wrap spacing={6} justify="center" align="center">
        {displayedNFTs.map((tokenId, index) => (
          <WrapItem key={index}>
            <DDCCard tokenId={tokenId} contract={contract} />
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
}