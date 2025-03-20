'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  useToast,
} from '@chakra-ui/react';
import { NFT_CONTRACTS } from '@/consts/nft_contracts';
import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { client } from '@/consts/client';
import { useContract } from "@/contexts/ContractContext";

export function ChainSelector() {
  const { selectedContract, setSelectedContract } = useContract();
  const isDevelopment = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const toast = useToast();

  const contract = getContract({
    client,
    address: selectedContract.address,
    chain: selectedContract.chain,
  });

  const { data: symbol, error } = useReadContract({
    contract,
    method: "function symbol() view returns (string)",
    params: [],
  });

  useEffect(() => {
    if (error) {
      console.error('Contract validation failed:', error);
      console.log('Chain:', selectedContract.chain.name);
      console.log('Address:', selectedContract.address);
      toast({
        title: "Contract Error",
        description: `Failed to validate contract on ${selectedContract.chain.name}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (symbol) {
      console.log('Contract validated successfully');
      console.log('Chain:', selectedContract.chain.name);
      console.log('Address:', selectedContract.address);
      console.log('Symbol:', symbol);
    }
  }, [symbol, error, selectedContract, toast]);

  if (!isDevelopment) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="outline"
        height="56px"
        minW="200px"
      >
        <VStack spacing={0} align="start">
          <Text fontSize="xs" color="gray.500">Chain: {selectedContract.chain.name}</Text>
          <Text fontSize="xs" color="gray.500" isTruncated maxW="180px">
            Contract: {selectedContract.address}
          </Text>
        </VStack>
      </MenuButton>
      <MenuList>
        {NFT_CONTRACTS.map((contract) => (
          <MenuItem
            key={contract.address}
            onClick={() => setSelectedContract(contract)}
          >
            <VStack spacing={0} align="start">
              <Text>{contract.chain.name}</Text>
              <Text fontSize="xs" color="gray.500">{contract.address}</Text>
            </VStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
} 