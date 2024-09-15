import type { Chain } from "thirdweb";
import { polygonAmoy, sepolia } from "./chains";

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
    address: "0x8c11e104DAf21d4A6faEFfec36BCa3310ACC9D6F",
    chain: sepolia,
    title: "YourDiamonds DDC (sepolia-8c11)",
    thumbnailUrl:
      "https://yourdiamonds.com/wp-content/uploads/2022/05/42-1920.jpg",
    type: "ERC721",
  },

  {
    address: "0x19f46d5d67183b8496161af451f00e0f2d4bc161",
    chain: sepolia,
    title: "YourDiamonds DDC (sepolia-19f4)",
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
