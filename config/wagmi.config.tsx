"use client";
import { WagmiConfig, createConfig, configureChains, useAccount } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { iotex, mainnet, goerli, optimism } from "viem/chains";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const { publicClient, chains } = configureChains(
  [iotex, mainnet, goerli, optimism],
  [publicProvider()]
);
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: [
    new WalletConnectConnector({
      chains: chains,
      options: { projectId, showQrModal: false },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: "lll" },
    }),
  ],
  publicClient,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#3D00B7",
    "--w3m-font-size-master": "18",
  },
});

function Config({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
export default Config;
