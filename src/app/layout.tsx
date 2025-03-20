import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import '@/styles/globals.css';
import { ContractProvider } from "@/contexts/ContractContext";

export const metadata: Metadata = {
  title: "YourDiamonds DDC",
  description: "Digital Diamond Certificates powered by blockchain technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ContractProvider>
          <Providers>
            {children}
          </Providers>
        </ContractProvider>
      </body>
    </html>
  );
}