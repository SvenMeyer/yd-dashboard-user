import { useReadContract } from "thirdweb/react";
import { Box, Image, Text } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { reverseMappingDiamondProperties } from "@/lib/property-mapping";
import { IntToBytes32, bytes32ToString } from "@/lib/utils";

type Props = {
  tokenId: bigint;
  contract: ThirdwebContract;
};

export function DDCCard({ tokenId, contract }: Props) {
  const { data: ddcData, isLoading, error } = useReadContract({
    contract,
    method: "function getDDCStruct(bytes32 _tokenId) returns (uint32, uint16, uint16, uint16, uint16, uint16, uint16)",
    params: [IntToBytes32(tokenId)],
  });

  if (isLoading) return <Text>Loading DDC ID: {tokenId} ...</Text>;

  if (error) {
    return (
      <Box borderWidth={1} borderRadius="lg" overflow="hidden" p={4}>
        <Text>Invalid DDC ID: {tokenId}</Text>
        <Text>Unable to retrieve DDC data</Text>
      </Box>
    );
  }

  const [microCarat, colorGrade, clarityGrade, cutGrade, fluorescence, polishGrade, symmetryGrade] = ddcData || [];

  const {
    color,
    clarity,
    cut,
    fluorescence: fluorescenceGrade,
    polish,
    symmetry
  } = reverseMappingDiamondProperties(
    Number(colorGrade),
    Number(clarityGrade),
    Number(cutGrade),
    Number(fluorescence),
    Number(polishGrade),
    Number(symmetryGrade)
  );

  return (
    <Box borderWidth={1} borderRadius="lg" overflow="hidden" p={4}>
      <Image src="/path/to/diamond/image.jpg" alt="Diamond image" />
      <Text>Token ID: {bytes32ToString(IntToBytes32(tokenId))}</Text>
      <Text>Carat       : {Number(microCarat)/1000000}</Text>
      <Text>Color       : {color}</Text>
      <Text>Clarity     : {clarity}</Text>
      <Text>Cut         : {cut}</Text>
      <Text>Fluorescence: {fluorescenceGrade}</Text>
      <Text>Polish      : {polish}</Text>
      <Text>Symmetry    : {symmetry}</Text>
    </Box>
  );
}