"use client";

import { Token } from "@/components/token-page/TokenPage";
import { ClientLayout } from "@/components/shared/ClientLayout";

export default function ListingPage({
  params,
}: {
  params: { tokenId: string };
}) {
  const { tokenId } = params;
  if (!tokenId) {
    throw new Error("Missing listingId");
  }
  return (
    <ClientLayout>
      <Token tokenId={BigInt(tokenId)} />
    </ClientLayout>
  );
}
