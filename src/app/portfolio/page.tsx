"use client";

import { useActiveAccount } from "thirdweb/react";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { Box, Text, Flex } from "@chakra-ui/react";

export default function PortfolioPage() {
  const account = useActiveAccount();
  const selectedCollection = NFT_CONTRACTS[0];

  if (!account) {
    return (
      <Flex height="100vh" flexDirection="column" alignItems="center" pt="20vh">
        <Box 
          p={8} 
          borderWidth={1} 
          borderRadius="lg" 
          textAlign="center" 
          mb={16}
          bg="#404040"
          color="white"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Please connect your wallet with the [connect] button in the top right.
          </Text>
        </Box>
      </Flex>
    );
  }

  return <PortfolioSection address={account.address} selectedCollection={selectedCollection} />;
}