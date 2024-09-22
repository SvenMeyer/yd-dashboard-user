"use client";

import React, { useState, useEffect } from 'react';
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { NftContract } from '@/consts/nft_contracts';

export default function Home() {
  const [NFT_CONTRACTS, setNFT_CONTRACTS] = useState<NftContract[]>([]);

  useEffect(() => {
    const loadContracts = async () => {
      const { NFT_CONTRACTS } = await import("@/consts/nft_contracts");
      setNFT_CONTRACTS(NFT_CONTRACTS);
    };
    loadContracts();
  }, []);

  return (
    <Flex>
      <Box mt="24px" m="auto">
        <Flex direction="column" gap="4">
          <Heading ml="20px" mt="40px">
            Available NFT Contracts
          </Heading>
          <Flex
            direction="row"
            wrap="wrap"
            mt="20px"
            gap="5"
            justifyContent="space-evenly"
          >
            {NFT_CONTRACTS.map((item) => (
              <Link
                _hover={{ textDecoration: "none" }}
                w={300}
                h={400}
                key={item.address}
                href={`/collection/${item.chain.id}/${item.address}`}
              >
                <Image src={item.thumbnailUrl} alt={item.title || "NFT Image"} />
                <Text fontSize="large" mt="10px">
                  {item.title}
                </Text>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}