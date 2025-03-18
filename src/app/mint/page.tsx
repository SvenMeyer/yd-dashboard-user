'use client'

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

// import { isAddress } from 'ethers/lib/utils';

import { DDC_ABI } from '@/types/DDC_ABI';
import { NFT_CONTRACTS } from '@/consts/nft_contracts';
import { stringToTokenId } from '@/lib/mapping-tokenId-string';
import {
  colorMap,
  clarityMap,
  cutMap,
  fluorescenceMap,
  polishMap,
  symmetryMap,
  mapPropertyToUint8,
} from '@/lib/property-mapping';
import {
  getContract,
  prepareContractCall,
} from "thirdweb";
import {
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { client } from "@/consts/client";
import { estimateGas } from "thirdweb";
import { ClientLayout } from "@/components/shared/ClientLayout";

const colorOptions = Object.keys(colorMap);
const clarityOptions = Object.keys(clarityMap);
const cutOptions = Object.keys(cutMap);
const fluorescenceOptions = Object.keys(fluorescenceMap);
const polishOptions = Object.keys(polishMap);
const symmetryOptions = Object.keys(symmetryMap);

export default function MintPage() {
  const [reportId, setReportId] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [inscription, setInscription] = useState('');
  const [carat, setCarat] = useState('');
  const [color, setColor] = useState(colorOptions[0]);
  const [clarity, setClarity] = useState(clarityOptions[0]);
  const [cut, setCut] = useState(cutOptions[0]);
  const [polish, setPolish] = useState(polishOptions[0]);
  const [symmetry, setSymmetry] = useState(symmetryOptions[0]);
  const [fluorescence, setFluorescence] = useState(fluorescenceOptions[0]);
  const [uri, setUri] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [tokenId_String, setTokenId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const selectedCollection = NFT_CONTRACTS[0];

  const toast = useToast();
  const account = useActiveAccount();
  const { mutate: sendTx, data: transactionResult } = useSendTransaction();
  const router = useRouter();

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    // if (value && !isAddress(value)) {
    //   setAddressError('Invalid Ethereum address');
    // } else {
    //   setAddressError('');
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to mint a DDC.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsProcessing(false);
      return;
    }

    let tokenIdUint256: bigint;
    try {
      tokenIdUint256 = stringToTokenId(inscription);
    } catch (error) {
      toast({
        title: 'Invalid Inscription',
        description: 'The inscription must contain at least one digit.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsProcessing(false);
      return;
    }

    const microCarat = Math.floor(parseFloat(carat) * 1000000);
    const colorValue = mapPropertyToUint8(color, colorMap);
    const clarityValue = mapPropertyToUint8(clarity, clarityMap);
    const cutValue = mapPropertyToUint8(cut, cutMap);
    const fluorescenceValue = mapPropertyToUint8(fluorescence, fluorescenceMap);
    const polishValue = mapPropertyToUint8(polish, polishMap);
    const symmetryValue = mapPropertyToUint8(symmetry, symmetryMap);

    try {
      const contract = getContract({
        address: NFT_CONTRACTS[0].address,
        chain: NFT_CONTRACTS[0].chain,
        client,
      });

      console.log('DDC NFT contract :', NFT_CONTRACTS[0].address);
      console.log({contract});

      console.log('Minting DDC with parameters:', {
        to: address,
        tokenId: tokenIdUint256.toString(),
        microCarat,
        color: colorValue,
        clarity: clarityValue,
        cut: cutValue,
        fluorescence: fluorescenceValue,
        polish: polishValue,
        symmetry: symmetryValue,
        uri
      });

      const transaction = prepareContractCall({
        contract,
        method: "function safeMint(address,uint256,uint32,uint8,uint8,uint8,uint8,uint8,uint8,string)",
        params: [address, tokenIdUint256, microCarat, colorValue, clarityValue, cutValue, fluorescenceValue, polishValue, symmetryValue, uri],
      });

      console.log({transaction});

      const gas = await estimateGas({
        transaction,
        from: account.address,
      });

      console.log({gas});

      sendTx(transaction, {
        onSuccess: () => {
          setIsProcessing(false);
          
          toast({
            title: 'DDC Minted Successfully',
            description: 'Your DDC has been minted successfully.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          router.push(`/search?tokenId=${encodeURIComponent(inscription)}`);
        },
        onError: (error) => {
          console.error('Transaction error:', error);
          setIsProcessing(false);
          
          toast({
            title: 'Minting Failed',
            description: error instanceof Error ? error.message : 'Transaction failed',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      });
      
    } catch (error) {
      console.error('Error minting DDC:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast({
        title: 'Minting Failed',
        description: 'There was an error while minting your DDC. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsProcessing(false);
    }
  };

  const handleSearch = () => {
    if (tokenId_String) {
      setIsSearching(true);
    }
  };

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
      <Box maxWidth="600px" margin="auto" padding={8}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Report ID</FormLabel>
              <Input
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                maxLength={32}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Report Date</FormLabel>
              <Input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Inscription</FormLabel>
              <Input
                value={inscription}
                onChange={(e) => setInscription(e.target.value)}
                maxLength={32}
                placeholder="e.g. IGI-11111111"
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                The inscription will be converted to a token ID. It must contain at least one digit.
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Carat</FormLabel>
              <Input
                type="number"
                step="0.01"
                value={carat}
                onChange={(e) => setCarat(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Color</FormLabel>
              <Select value={color} onChange={(e) => setColor(e.target.value)}>
                {colorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Clarity</FormLabel>
              <RadioGroup value={clarity} onChange={(value) => setClarity(value)}>
                <Stack direction="row" wrap="wrap">
                  {clarityOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Cut</FormLabel>
              <RadioGroup value={cut} onChange={(value) => setCut(value)}>
                <Stack direction="row">
                  {cutOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Polish</FormLabel>
              <RadioGroup value={polish} onChange={(value) => setPolish(value)}>
                <Stack direction="row">
                  {polishOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Symmetry</FormLabel>
              <RadioGroup value={symmetry} onChange={(value) => setSymmetry(value)}>
                <Stack direction="row">
                  {symmetryOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Fluorescence</FormLabel>
              <RadioGroup value={fluorescence} onChange={(value) => setFluorescence(value)}>
                <Stack direction="row">
                  {fluorescenceOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>URI</FormLabel>
              <Input
                value={uri}
                onChange={(e) => setUri(e.target.value)}
              />
            </FormControl>

            <FormControl isInvalid={!!addressError}>
              <FormLabel>Ethereum Address</FormLabel>
              <Input
                value={address}
                onChange={handleAddressChange}
                placeholder="0x..."
              />
              {addressError && <Text color="red.500">{addressError}</Text>}
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="blue"
              isLoading={isProcessing}
              loadingText="Processing"
            >
              Create DDC
            </Button>
          </VStack>
        </form>
      </Box>
    </ClientLayout>
  );
}