import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import '@/styles/globals.css';

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}