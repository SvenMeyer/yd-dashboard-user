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
    abi: DDC_ABI,
  });

  const { data: ddcData, isLoading, error } = useReadContract({
    contract,
    method: "function getDDCStruct(bytes32 _tokenId) returns (uint32, uint16, uint16, uint16, uint16, uint16, uint16)",
    params: [tokenIdBytes32 as `0x${string}`],
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const properties = ddcData ? {
    microCarat: ddcData[0].toString(),
    colorGrade: ddcData[1].toString(),
    clarityGrade: ddcData[2].toString(),
    cutGrade: ddcData[3].toString(),
    fluorescence: ddcData[4].toString(),
    polishGrade: ddcData[5].toString(),
    symmetryGrade: ddcData[6].toString(),
  } : {};

  const nftProperties = {
    id: tokenIdBytes32,
    creationDateTime: 'N/A',
    blockchain: chainId === '11155111' ? 'Sepolia' : 'Unknown',
    mintTransactionId: 'N/A',
  };

  return (
    <div>
      <Navbar />
      <DiamondPropertiesComponent properties={properties} nftProperties={nftProperties} />
    </div>
  );
}