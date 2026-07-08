import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { baseSepolia } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "00000000000000000000000000000001";

export const wagmiConfig = getDefaultConfig({
  appName: "THE67",
  appDescription:
    "An interactive philosophical experience about how meaning emerges from collective belief.",
  projectId,
  chains: [baseSepolia],
  ssr: true,
  wallets: [
    {
      groupName: "Connect",
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        walletConnectWallet,
        coinbaseWallet,
      ],
    },
  ],
});
