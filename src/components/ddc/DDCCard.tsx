import { useReadContract } from "thirdweb/react";
import { Box, Image, Text, VStack, HStack } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { reverseMappingDiamondProperties } from "@/lib/property-mapping";
import { uint256ToBytes32, bytes32ToString, Uint256ToString } from "@/lib/utils";
import { tokenIdToString } from "@/lib/mapping-tokenId-string";

type Props = {
  tokenId: bigint;
  contract: ThirdwebContract;
};

export function DDCCard({ tokenId, contract }: Props) {
  const { data: ddcData, isLoading, error } = useReadContract({
    contract,
    method: "function getDDCStruct(uint256 _tokenId) returns (uint32, uint16, uint16, uint16, uint16, uint16, uint16)",
    params: [tokenId],
  });

  if (isLoading) return <Text>Loading Token ID: {tokenIdToString(tokenId)}</Text>;

  if (error) {
    return (
      <Box borderWidth={1} borderRadius="lg" overflow="hidden" p={4}>
        <Text>Invalid DDC ID: {tokenIdToString(tokenId)}</Text>
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
    <Box borderWidth={1} borderRadius="lg" overflow="hidden" width="300px">
      <VStack spacing={4} align="center" p={4}>
        <Image src="/icons/diamond-icon-256x256-white-bg.png" alt="Diamond icon" width={256} height={256} />
        <Box width="256px" px={4}>
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="bold" textAlign="center">Token ID: {tokenIdToString(tokenId)}</Text>
            <HStack justify="space-between" spacing={4}>
              <Text>Carat:</Text>
              <Text>{Number(microCarat)/1000000}</Text>
            </HStack>
            <HStack justify="space-between" spacing={4}>
              <Text>Color:</Text>
              <Text>{color}</Text>
            </HStack>
            <HStack justify="space-between" spacing={4}>
              <Text>Clarity:</Text>
              <Text>{clarity}</Text>
            </HStack>
            <HStack justify="space-between" spacing={4}>
              <Text>Cut:</Text>
              <Text>{cut}</Text>
            </HStack>
            <HStack justify="space-between" spacing={4}>
              <Text>Fluorescence:</Text>
              <Text>{fluorescenceGrade}</Text>
            </HStack>
            <HStack justify="space-between" spacing={4}>
              <Text>Polish:</Text>
              <Text>{polish}</Text>
            </HStack>
            <HStack justify="space-between" spacing={4}>
              <Text>Symmetry:</Text>
              <Text>{symmetry}</Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}