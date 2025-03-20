'use client';

import MarketplaceProvider from "@/hooks/useMarketplaceContext";

type Props = {
  children: React.ReactNode;
  params: {
    chainId: string;
    contractAddress: string;
  };
};

export default function MarketplaceLayout({ children, params }: Props) {
  // Log chain and contract info to console
  console.log('Using chain:', params.chainId, 'with contract:', params.contractAddress);

  return (
    <MarketplaceProvider
      chainId={params.chainId}
      contractAddress={params.contractAddress}
    >
      {children}
    </MarketplaceProvider>
  );
}
