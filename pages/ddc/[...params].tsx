import { useRouter } from 'next/router';
import { useReadContract } from 'thirdweb/react';
import DiamondPropertiesComponent from '@/components/ddc-page/DDC';
import { Navbar } from '@/components/shared/Navbar';
import { DDC_ABI } from '@/abis/DDC';
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/consts/client";

export default function DDCPage() {
  const router = useRouter();
  const { params } = router.query;

  // Extract chainId, contractAddress, and tokenId from the URL
  const [chainId, contractAddress, _, tokenIdBytes32] = params || [];

  const contract = getContract({
    client,
    chain: sepolia,
    address: contractAddress as string,
  });

  const { data: ddcData, isLoading, error } = useReadContract({
    contract,
    method: "function getDDCStruct(bytes32 _tokenId) returns (uint32, uint16, uint16, uint16, uint16, uint16, uint16)",
    params: [tokenIdBytes32 as `0x${string}`],
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
    id: tokenIdBytes32,
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