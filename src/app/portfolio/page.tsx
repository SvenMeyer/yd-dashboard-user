"use client";

import { useActiveAccount } from "thirdweb/react";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { Alert, AlertIcon, Box, Flex } from "@chakra-ui/react";
import { ClientLayout } from "@/components/shared/ClientLayout";

export default function PortfolioPage() {
  const account = useActiveAccount();
  const selectedCollection = NFT_CONTRACTS[0];

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Portfolio page rendering with account:', account ? account.address : 'not connected');
    console.log('Selected collection address:', selectedCollection.address);
    console.log('Selected collection chain:', selectedCollection.chain.id);
  }

  if (!account) {
    return (
      <ClientLayout>
        <Flex height="100vh" flexDirection="column" alignItems="center" pt="20vh">
          <Box width="120%" maxWidth="700px" mb={16}>
            <Alert 
              status="info" 
              borderRadius="lg" 
              height="auto" 
              py={4}
              fontSize="lg"
              display="flex"
              justifyContent="center"
            >
              <Flex alignItems="center">
                <AlertIcon boxSize={6} mr={3} />
                Please connect your wallet with the [connect] button in the top right.
              </Flex>
            </Alert>
          </Box>
        </Flex>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <PortfolioSection address={account.address} selectedCollection={selectedCollection} />
    </ClientLayout>
  );
}