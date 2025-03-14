"use client";

import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, SimpleGrid, Image } from "@chakra-ui/react";
import { NftContract } from '@/consts/nft_contracts';
import { ClientLayout } from "@/components/shared/ClientLayout";
import { Link } from "@chakra-ui/next-js";
import { FaShieldHalved, FaMagnifyingGlass, FaArrowsRotate } from "react-icons/fa6";

export default function Home() {
  const [NFT_CONTRACTS, setNFT_CONTRACTS] = useState<NftContract[]>([]);

  useEffect(() => {
    const loadContracts = async () => {
      const { NFT_CONTRACTS } = await import("@/consts/nft_contracts");
      // Filter out the Mata NFT contract
      const filteredContracts = NFT_CONTRACTS.filter(contract => contract.title && !contract.title.includes('Mata'));
      setNFT_CONTRACTS(filteredContracts);
    };
    loadContracts();
  }, []);

  return (
    <ClientLayout>
      {/* Hero Section */}
      <Box className="bg-gray-50 py-20">
        <Flex 
          className="container mx-auto px-4"
          direction={{ base: 'column', md: 'row' }}
          gap={12}
          align="center"
        >
          <Box flex="1" className="space-y-6">
            <Heading as="h2" size="2xl" mb={6}>
              Digital Diamond Certificates on the Blockchain
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={8}>
              Revolutionizing diamond certification through NFT technology. Each DDC represents a real-world diamond with verified authenticity and transparent ownership history.
            </Text>
            <Flex gap={4} flexWrap="wrap">
              {NFT_CONTRACTS.map((contract) => (
                <Button
                  key={contract.address}
                  as={Link}
                  href={`/collection/${contract.chain.id}/${contract.address}`}
                  variant="outline"
                  size="lg"
                  borderWidth={2}
                  _hover={{ bg: 'gray.50' }}
                  fontWeight="normal"
                >
                  {contract.title}
                </Button>
              ))}
            </Flex>
          </Box>
          <Box flex="1">
            <Image
              src="/images/homepage-hero-diamond.png"
              alt="3D rendered diamond certificate with blockchain elements"
              className="rounded-lg shadow-xl"
            />
          </Box>
        </Flex>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} px={4} maxW="container.xl" mx="auto">
          <Box bg="gray.50" p={8} rounded="lg">
            <Box fontSize="3xl" mb={4}>
              <FaShieldHalved />
            </Box>
            <Heading as="h3" size="md" mb={3}>
              Secure Certification
            </Heading>
            <Text color="gray.600">
              Immutable blockchain records ensuring the authenticity and ownership of your diamond certificates.
            </Text>
          </Box>
          <Box bg="gray.50" p={8} rounded="lg">
            <Box fontSize="3xl" mb={4}>
              <FaMagnifyingGlass />
            </Box>
            <Heading as="h3" size="md" mb={3}>
              Easy Verification
            </Heading>
            <Text color="gray.600">
              Quick and simple verification process with comprehensive diamond properties and documentation.
            </Text>
          </Box>
          <Box bg="gray.50" p={8} rounded="lg">
            <Box fontSize="3xl" mb={4}>
              <FaArrowsRotate />
            </Box>
            <Heading as="h3" size="md" mb={3}>
              Transferable Assets
            </Heading>
            <Text color="gray.600">
              Seamlessly transfer ownership while maintaining the complete history and authenticity of the certificate.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </ClientLayout>
  );
}