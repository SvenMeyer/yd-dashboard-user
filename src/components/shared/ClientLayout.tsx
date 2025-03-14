"use client";

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Navbar } from "./Navbar";

type ClientLayoutProps = {
  children: ReactNode;
};

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Box padding="20px 60px 30px 60px">
      <Navbar />
      {children}
    </Box>
  );
}
