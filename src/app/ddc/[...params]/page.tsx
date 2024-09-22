"use client";

import { useParams } from 'next/navigation';
import { useReadContract } from 'thirdweb/react';
import DiamondPropertiesComponent from './DDC';
import { Navbar } from '@/components/shared/Navbar';
import { DDC_ABI } from '@/abis/DDC';
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/consts/client";

export default function DDCPage() {
  // Destructure the parameters
  const params = useParams() as { params: string[] };
  const [chainId, contractAddress, tokenId] = params.params || [];

  const contract = getContract({
    client,
    chain: sepolia, // TODO: use chainId
    address: contractAddress as string,
  });

  const { data: ddcData, isLoading, error } = useReadContract({
    contract,
    method: "function getDDCStruct(bytes32 _tokenId) returns (uint32, uint16, uint16, uint16, uint16, uint16, uint16)",
    params: [tokenId as `0x${string}`],
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const properties = ddcData ? {
    microCarat: Number(ddcData[0]),
    colorGrade: Number(ddcData[1]),
    clarityGrade: Number(ddcData[2]),
    cutGrade: Number(ddcData[3]),
    fluorescence: Number(ddcData[4]),
    polishGrade: Number(ddcData[5]),
    symmetryGrade: Number(ddcData[6]),
  } : {};

  const nftProperties = {
    id: tokenId,
    creationDateTime: Math.floor(new Date('1 Jan 2024 00:00:00 UTC').getTime() / 1000),
    blockchain: chainId === '11155111' ? 'Sepolia' : 'Unknown',
    mintTransactionId: '0x'+('0').repeat(64),
  };

  return (
    <div>
      <Navbar />
      <DiamondPropertiesComponent properties={properties} nftProperties={nftProperties} />
    </div>
  );
}