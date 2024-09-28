"use client";

import { client } from "@/consts/client";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { blo } from "blo";
import { FaRegMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";
import { SideMenu } from "./SideMenu";
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Profile", href: "/profile" },
  { label: "Search", href: "/search" },
  { label: "Mint", href: "/mint" }
];

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { colorMode } = useColorMode();
  const pathname = usePathname();

  return (
    <Box py="30px" px={{ base: "20px", lg: "50px" }} width="100%">
      <Flex direction="row" alignItems="center" justifyContent="space-between" maxWidth="1200px" margin="0 auto">
        <Flex alignItems="center" gap={4}>
          <Heading
            as={Link}
            href="/"
            _hover={{ textDecoration: "none" }}
            color="inherit"
            fontWeight="extrabold"
          >
            YourDiamonds DDC
          </Heading>
          <Flex display={{ lg: "flex", base: "none" }} alignItems="center" gap={4}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                as={Link}
                href={item.href}
                variant="outline"
                height="56px"
                px={4}
                bg={pathname === item.href ? "gray.100" : "transparent"}
                _hover={{
                  bg: pathname === item.href ? "gray.200" : "gray.100"
                }}
              >
                {item.label}
              </Button>
            ))}
          </Flex>
        </Flex>
        <Flex alignItems="center" gap={4} ml="auto">
          <ConnectButton
            client={client}
            connectModal={{
              size: "wide"
            }}
            theme={colorMode}
            connectButton={{ style: { height: "56px" } }}
          />
        </Flex>
        <Box display={{ lg: "none", base: "block" }}>
          <SideMenu />
        </Box>
      </Flex>
    </Box>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  const { disconnect } = useDisconnect();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const { colorMode } = useColorMode();
  return (
    <Menu>
      <MenuButton as={Button} height="56px">
        <Flex direction="row" gap="5">
          <Box my="auto">
            <FiUser size={30} />
          </Box>
          <Image
            src={ensAvatar ?? blo(address as `0x${string}`)}
            height="40px"
            rounded="8px"
          />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem display="flex">
          <Box mx="auto">
            <ConnectButton client={client} theme={colorMode} />
          </Box>
        </MenuItem>
        <MenuItem as={Link} href="/profile" _hover={{ textDecoration: "none" }}>
          Profile {ensName ? `(${ensName})` : ""}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (wallet) disconnect(wallet);
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button height="56px" w="56px" onClick={toggleColorMode} mr="10px">
      {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
    </Button>
  );
}
