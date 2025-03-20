"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { SearchResult } from "@/components/search/SearchResult";
import { Alert, AlertIcon, Box, Flex, Input, Button, Text } from "@chakra-ui/react";
import { ClientLayout } from "@/components/shared/ClientLayout";
import { useSearchParams, useRouter } from 'next/navigation';
import { stringToTokenId } from '@/lib/mapping-tokenId-string';
import { useContract } from "@/contexts/ContractContext";

export default function SearchPage() {
  const [tokenId_String, setTokenId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedContract } = useContract();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Handle URL parameters on page load
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setTokenId(idParam);
      // Don't search immediately to avoid showing incorrect results
      // while the page is still loading
      setTimeout(() => {
        setIsSearching(true);
      }, 100);
    }
  }, [searchParams]);

  const handleSearch = () => {
    // Trim whitespace from the token ID input
    const trimmedTokenId = tokenId_String.trim();
    if (!trimmedTokenId) {
      return;
    }
    
    // Validate that the token ID can be converted to a uint256
    try {
      const tokenIdUint256 = stringToTokenId(trimmedTokenId);
      console.log('Searching for token ID:', {
        original: trimmedTokenId,
        uint256: tokenIdUint256.toString()
      });
      
      // Update URL with the search parameter
      router.push(`/search?id=${trimmedTokenId}`);
      
      setTokenId(trimmedTokenId); // Update the state with trimmed value
      setError(null);
      setIsSearching(true);
    } catch (err) {
      console.error('Error converting token ID:', err);
      setError('Invalid token ID format. Must contain at least one digit.');
      setIsSearching(false);
    }
  };
  
  // Handle Enter key press in the input field
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <ClientLayout>
      <Flex height="100vh" flexDirection="column" alignItems="center" pt="10vh">
        <Box width="120%" maxWidth="700px" mb={8}>
          <Flex direction="column">
            <Flex>
              <Input 
                placeholder="Enter Token ID (e.g. IGI-11111111)" 
                value={tokenId_String} 
                onChange={(e) => {
                  setTokenId(e.target.value);
                  // Reset the search when input changes
                  if (isSearching) {
                    setIsSearching(false);
                  }
                  // Clear any errors
                  if (error) {
                    setError(null);
                  }
                }}
                onKeyPress={handleKeyPress}
                mr={2}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Flex>
            {error && (
              <Text color="red.500" fontSize="sm" mt={2}>
                {error}
              </Text>
            )}
          </Flex>
        </Box>

        {!isSearching && !error && (
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

        {isSearching && tokenId_String && (
          <SearchResult tokenId={tokenId_String} selectedCollection={selectedContract} />
        )}
      </Flex>
    </ClientLayout>
  );
}