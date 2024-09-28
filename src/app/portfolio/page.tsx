"use client";

import { useActiveAccount } from "thirdweb/react";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { Box, Text } from "@chakra-ui/react";

export default function PortfolioPage() {
  const account = useActiveAccount();
  const selectedCollection = NFT_CONTRACTS[0];

  if (!account) {
    return (
      <Box p={4}>
        <Text>Please connect your wallet with the [connect] button in the top right to view your portfolio.</Text>
      </Box>
    );
  }

  return <PortfolioSection address={account.address} selectedCollection={selectedCollection} />;
}