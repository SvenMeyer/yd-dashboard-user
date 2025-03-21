import type { Chain } from "thirdweb";
import { polygonAmoy, sepolia } from "./chains";
import { baseSepolia } from "thirdweb/chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";

  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

/**
 * Below is a list of all NFT contracts supported by your marketplace(s)
 * This list could also be dynamically fetched from a data source
 */
export const NFT_CONTRACTS: NftContract[] = [

  {
    address: "0x0b46CEC2fa88c565053150904dbB7a634069A2E1",
    chain: baseSepolia,
    title: "0xb46 - Base Sepolia - Mar-18-2025",
    thumbnailUrl:
      "https://yourdiamonds.com/wp-content/uploads/2022/05/42-1920.jpg",
    type: "ERC721",
  },
  {
    address: "0xb4D87b26750a4ed23fBa9239F7C69F9a810a5DF8",
    chain: sepolia,
    title: "0xb4D8 - Sepolia - Mar-08-2025",
    thumbnailUrl:
      "https://yourdiamonds.com/wp-content/uploads/2022/05/42-1920.jpg",
    type: "ERC721",
  },

  {
    address: "0x4b6CDEFF5885A57678261bb95250aC43aD490752",
    chain: polygonAmoy,
    title: "Mata NFT",
    thumbnailUrl:
      "https://258c828e8cc853bf5e0efd001055fb39.ipfscdn.io/ipfs/bafybeidec7x6bptqmrxgptaedd7wfwxbsccqfogzwfsd4a7duxn4sdmnxy/0.png",
    type: "ERC721",
  },

];
