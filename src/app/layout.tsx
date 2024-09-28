import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import '@/styles/globals.css';
import { Box } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Box padding="20px 60px 30px 60px">
            <Navbar />
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}