"use client";

import { Token } from "@/components/token-page/TokenPage";
import { ClientLayout } from "@/components/shared/ClientLayout";
import { useParams } from "next/navigation";

export default function ListingPage() {
  const params = useParams();
  const tokenId = params?.tokenId as string;
  
  if (!tokenId) {
    throw new Error("Missing tokenId");
  }

  return (
    <ClientLayout>
      <Token tokenId={BigInt(tokenId)} />
    </ClientLayout>
  );
}
