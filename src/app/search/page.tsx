"use client";

import { useState } from "react";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { SearchResult } from "@/components/search/SearchResult";
import { Alert, AlertIcon, Box, Flex, Input, Button } from "@chakra-ui/react";
import { StringToUint256 } from "@/lib/utils";

export default function SearchPage() {
  const [tokenId_String, setTokenId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const selectedCollection = NFT_CONTRACTS[0];

  const handleSearch = () => {
    if (tokenId_String) {
      setIsSearching(true);
    }
  };

  return (
    <Flex height="100vh" flexDirection="column" alignItems="center" pt="10vh">
      <Box width="120%" maxWidth="700px" mb={8}>
        <Flex>
          <Input 
            placeholder="Enter Token ID" 
            value={tokenId_String} 
            onChange={(e) => setTokenId(e.target.value)}
            mr={2}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Flex>
      </Box>

      {!isSearching && (
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
              Enter a Token ID to search for a DDC NFT.
            </Flex>
          </Alert>
        </Box>
      )}

      {isSearching && (
        <SearchResult tokenId={StringToUint256(tokenId_String)} selectedCollection={selectedCollection} />
      )}
    </Flex>
  );
}