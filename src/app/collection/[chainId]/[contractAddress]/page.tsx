"use client";

import { MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFT as getNFT721 } from "thirdweb/extensions/erc721";
import { getNFT as getNFT1155 } from "thirdweb/extensions/erc1155";
import { client } from "@/consts/client";
import { Box, Flex, Heading, Text, Spinner, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { ListingGrid } from "./ListingGrid";
import { AllNftsGrid } from "./AllNftsGrid";
import { ClientLayout } from "@/components/shared/ClientLayout";

export default function CollectionPage() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const {
    type,
    nftContract,
    isLoading,
    contractMetadata,
    listingsInSelectedCollection,
    supplyInfo,
  } = useMarketplaceContext();

  useEffect(() => {
    console.log('Collection page debug:', {
      isLoading,
      nftContract,
      contractMetadata,
      type,
      listingsInSelectedCollection,
      supplyInfo
    });
    
    if (!isLoading && (!nftContract || !contractMetadata)) {
      const errorMsg = "Unable to fetch collection data. Please try again later.";
      console.error('Collection error:', errorMsg, { nftContract, contractMetadata });
      setError(errorMsg);
    }
  }, [isLoading, nftContract, contractMetadata, type, listingsInSelectedCollection, supplyInfo]);

  const { data: firstNFT, isLoading: isLoadingFirstNFT, error: firstNFTError } = useReadContract(
    type === "ERC1155" ? getNFT1155 : getNFT721,
    {
      contract: nftContract,
      tokenId: 0n,
      queryOptions: {
        enabled: !isLoading && !!nftContract && !contractMetadata?.image,
      },
    }
  );
  
  useEffect(() => {
    if (firstNFTError) {
      console.error('Error fetching first NFT:', firstNFTError);
    }
  }, [firstNFTError]);

  console.log({firstNFT});

  if (isLoading || isLoadingFirstNFT) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt="24px">
        <Heading>Error loading collection</Heading>
        <Text>{error}</Text>
      </Box>
    );
  }

  const thumbnailImage = contractMetadata?.image || firstNFT?.metadata.image || "";

  return (
    <ClientLayout>
      <Box mt="24px">
        <Flex direction="column" gap="4">
          <MediaRenderer
            client={client}
            src={thumbnailImage}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: "20px",
              width: "200px",
              height: "200px",
            }}
          />
          <Heading mx="auto">
            {contractMetadata?.name || "Unknown collection"}
          </Heading>
          {contractMetadata?.description && (
            <Text
              maxW={{ lg: "500px", base: "300px" }}
              mx="auto"
              textAlign="center"
            >
              {contractMetadata.description}
            </Text>
          )}

          <Flex mx="auto" mt="20px" gap="2">
            <Button
              variant={tabIndex === 0 ? "solid" : "outline"}
              onClick={() => setTabIndex(0)}
              borderRadius="full"
            >
              Listings ({listingsInSelectedCollection.length || 0})
            </Button>
            <Button
              variant={tabIndex === 1 ? "solid" : "outline"}
              onClick={() => setTabIndex(1)}
              borderRadius="full"
            >
              All items{" "}
              {supplyInfo
                ? `(${(
                    supplyInfo.endTokenId -
                    supplyInfo.startTokenId +
                    1n
                  ).toString()})`
                : ""}
            </Button>
            {/* Support for English Auctions coming soon */}
            {/* <Button variant="outline">Auctions ({allAuctions?.length || 0})</Button> */}
          </Flex>
        </Flex>
      </Box>
      <Flex direction="column">
        {tabIndex === 0 && <ListingGrid />}
        {tabIndex === 1 && <AllNftsGrid />}
      </Flex>
    </ClientLayout>
  );
}
