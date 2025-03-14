"use client";

import { client } from "@/consts/client";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { SUPPORTED_TOKENS, Token } from "@/consts/supported_tokens";
import {
  getSupplyInfo,
  SupplyInfo,
} from "@/extensions/getLargestCirculatingTokenId";
import { Box, Spinner } from "@chakra-ui/react";
import { createContext, type ReactNode, useContext, useEffect } from "react";
import { getContract, type ThirdwebContract } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import { isERC721 } from "thirdweb/extensions/erc721";
import {
  type DirectListing,
  type EnglishAuction,
  getAllAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

export type NftType = "ERC1155" | "ERC721";

/**
 * Support for English auction coming soon.
 */
const SUPPORT_AUCTION = false;

type TMarketplaceContext = {
  marketplaceContract: ThirdwebContract;
  nftContract: ThirdwebContract;
  type: NftType;
  isLoading: boolean;
  allValidListings: DirectListing[] | undefined;
  allAuctions: EnglishAuction[] | undefined;
  contractMetadata:
    | {
        [key: string]: any;
        name: string;
        symbol: string;
      }
    | undefined;
  refetchAllListings: Function;
  isRefetchingAllListings: boolean;
  listingsInSelectedCollection: DirectListing[];
  supplyInfo: SupplyInfo | undefined;
  supportedTokens: Token[];
};

const MarketplaceContext = createContext<TMarketplaceContext | undefined>(
  undefined
);

export default function MarketplaceProvider({
  chainId,
  contractAddress,
  children,
}: {
  chainId: string;
  contractAddress: string;
  children: ReactNode;
}) {
  let _chainId: number;
  try {
    _chainId = Number.parseInt(chainId);
  } catch (err) {
    throw new Error("Invalid chain ID");
  }
  console.log('MarketplaceProvider debug - chainId:', _chainId);
  const marketplaceContract = MARKETPLACE_CONTRACTS.find(
    (item) => item.chain.id === _chainId
  );
  console.log('MarketplaceProvider debug - marketplaceContract:', marketplaceContract);
  if (!marketplaceContract) {
    const errorMsg = "Marketplace not supported on this chain";
    console.error('MarketplaceProvider error:', errorMsg, { chainId, _chainId });
    throw new Error(errorMsg);
  }

  console.log('Checking if collection is supported:', { contractAddress, _chainId });
  const collectionSupported = NFT_CONTRACTS.find(
    (item) =>
      item.address.toLowerCase() === contractAddress.toLowerCase() &&
      item.chain.id === _chainId
  );
  console.log('Collection supported check result:', collectionSupported);
  // You can remove this condition if you want to supported _any_ nft collection
  // or you can update the entries in `NFT_CONTRACTS`
  // if (!collectionSupported) {
  //   throw new Error("Contract not supported on this marketplace");
  // }

  console.log('Initializing NFT contract with:', {
    chain: marketplaceContract.chain,
    clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID ? 'exists' : 'missing',
    contractAddress
  });
  
  let contract;
  try {
    console.log('Attempting to initialize NFT contract with:', {
      chain: marketplaceContract.chain.id,
      chainName: marketplaceContract.chain.name,
      contractAddress,
      clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID?.substring(0, 5) + '...' || 'missing'
    });
    
    contract = getContract({
      chain: marketplaceContract.chain,
      client,
      address: contractAddress,
    });
    
    console.log('NFT contract initialized:', {
      success: !!contract,
      contractAddress,
      chainId: marketplaceContract.chain.id
    });
  } catch (error) {
    console.error('Error initializing NFT contract:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      contractAddress,
      chainId: marketplaceContract.chain.id
    });
    throw new Error(`Failed to initialize NFT contract: ${error instanceof Error ? error.message : String(error)}`);
  }

  console.log('Initializing marketplace contract with:', {
    address: marketplaceContract.address,
    chain: marketplaceContract.chain.id
  });
  
  let marketplace;
  try {
    marketplace = getContract({
      address: marketplaceContract.address,
      chain: marketplaceContract.chain,
      client,
    });
    console.log('Marketplace contract initialized:', marketplace ? 'success' : 'failed');
  } catch (error) {
    console.error('Error initializing marketplace contract:', error);
    throw new Error(`Failed to initialize marketplace contract: ${error instanceof Error ? error.message : String(error)}`);
  }

  const { data: is721, isLoading: isChecking721, error: error721 } = useReadContract(isERC721, {
    contract,
    queryOptions: {
      enabled: !!marketplaceContract && !!contract,
      retry: 3,
    },
  });
  
  useEffect(() => {
    if (error721) {
      console.error('Error checking if contract is ERC721:', {
        error: error721,
        message: error721 instanceof Error ? error721.message : String(error721),
        contractAddress,
        chainId: _chainId
      });
    }
  }, [error721, contractAddress, _chainId]);
  
  const { data: is1155, isLoading: isChecking1155, error: error1155 } = useReadContract(
    isERC1155,
    { 
      contract, 
      queryOptions: { 
        enabled: !!marketplaceContract && !!contract,
        retry: 3,
      } 
    }
  );
  
  useEffect(() => {
    if (error1155) {
      console.error('Error checking if contract is ERC1155:', {
        error: error1155,
        message: error1155 instanceof Error ? error1155.message : String(error1155),
        contractAddress,
        chainId: _chainId
      });
    }
  }, [error1155, contractAddress, _chainId]);

  const isNftCollection = is1155 || is721;

  // Log the validation status
  useEffect(() => {
    console.log('NFT collection validation status:', {
      is721,
      is1155,
      isChecking721,
      isChecking1155,
      isNftCollection,
      contractAddress,
      chainId: _chainId,
      contractInitialized: !!contract
    });
    
    // If we're not checking anymore and we don't have a valid collection, log a warning
    if (!isChecking721 && !isChecking1155 && !is721 && !is1155) {
      console.warn('Contract validation completed but no valid NFT standard detected:', {
        contractAddress,
        chainId: _chainId,
        is721,
        is1155
      });
    }
  }, [is721, is1155, isChecking721, isChecking1155, isNftCollection, contractAddress, _chainId, contract]);

  // Check if the contract is in our predefined list of NFT contracts
  const predefinedContract = NFT_CONTRACTS.find(
    (item) =>
      item.address.toLowerCase() === contractAddress.toLowerCase() &&
      item.chain.id === _chainId
  );

  // Use the predefined contract type as a fallback if the contract validation fails
  const fallbackType = predefinedContract?.type;
  
  // Enable fallback in these cases:
  // 1. If validation completed but no valid type was detected
  // 2. If both validation calls resulted in errors
  // 3. If RPC errors occurred (typically 401 unauthorized)
  const hasRpcErrors = error721?.toString().includes('401') || error1155?.toString().includes('401');
  const useFallback = (!isNftCollection && !isChecking1155 && !isChecking721 && fallbackType) || 
                     (error721 && error1155 && fallbackType) || 
                     (hasRpcErrors && fallbackType);

  if (!isNftCollection && !isChecking1155 && !isChecking721) {
    if (fallbackType) {
      console.warn('Using fallback NFT type from predefined contracts:', {
        contractAddress,
        chainId: _chainId,
        fallbackType
      });
    } else {
      console.error('Not a valid NFT collection:', {
        contractAddress,
        chainId: _chainId,
        is721,
        is1155,
        isChecking721,
        isChecking1155
      });
      // Instead of throwing immediately, we'll show a more graceful error
      // throw new Error("Not a valid NFT collection");
    }
  }

  const { data: contractMetadata, isLoading: isLoadingContractMetadata, error: contractMetadataError } =
    useReadContract(getContractMetadata, {
      contract,
      queryOptions: {
        enabled: isNftCollection,
      },
    });
    
  useEffect(() => {
    if (contractMetadataError) {
      console.error('Error fetching contract metadata:', contractMetadataError);
    }
    if (contractMetadata) {
      console.log('Contract metadata fetched successfully:', contractMetadata);
    }
  }, [contractMetadataError, contractMetadata]);

  const {
    data: allValidListings,
    isLoading: isLoadingValidListings,
    refetch: refetchAllListings,
    isRefetching: isRefetchingAllListings,
  } = useReadContract(getAllValidListings, {
    contract: marketplace,
    queryOptions: {
      enabled: isNftCollection,
    },
  });

  const listingsInSelectedCollection = allValidListings?.length
    ? allValidListings.filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
          contract.address.toLowerCase()
      )
    : [];

  const { data: allAuctions, isLoading: isLoadingAuctions } = useReadContract(
    getAllAuctions,
    {
      contract: marketplace,
      queryOptions: { enabled: isNftCollection && SUPPORT_AUCTION },
    }
  );

  const { data: supplyInfo, isLoading: isLoadingSupplyInfo } = useReadContract(
    getSupplyInfo,
    {
      contract,
    }
  );

  const isLoading =
    isChecking1155 ||
    isChecking721 ||
    isLoadingAuctions ||
    isLoadingContractMetadata ||
    isLoadingValidListings ||
    isLoadingSupplyInfo;

  const supportedTokens: Token[] =
    SUPPORTED_TOKENS.find(
      (item) => item.chain.id === marketplaceContract.chain.id
    )?.tokens || [];

  // Determine the final NFT type, using the fallback if necessary
  const finalNftType: NftType = useFallback ? (fallbackType as NftType) : (is1155 ? "ERC1155" : "ERC721");
  
  // Log the final NFT type determination
  console.log('Final NFT type determination:', {
    type: finalNftType,
    usedFallback: useFallback,
    contractAddress,
    chainId: _chainId,
    fallbackType,
    is721,
    is1155,
    error721: !!error721,
    error1155: !!error1155
  });

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceContract: marketplace,
        nftContract: contract,
        isLoading,
        type: finalNftType,
        allValidListings,
        allAuctions,
        contractMetadata,
        refetchAllListings,
        isRefetchingAllListings,
        listingsInSelectedCollection,
        supplyInfo,
        supportedTokens,
      }}
    >
      {children}
      {isLoading && (
        <Box
          position="fixed"
          bottom="10px"
          right="10px"
          backgroundColor="rgba(0, 0, 0, 0.7)"
          padding="10px"
          borderRadius="md"
          zIndex={1000}
        >
          <Spinner size="lg" color="purple" />
        </Box>
      )}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error(
      "useMarketplaceContext must be used inside MarketplaceProvider"
    );
  }
  return context;
}
