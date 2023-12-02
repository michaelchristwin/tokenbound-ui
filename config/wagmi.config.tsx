"use client";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { goerli } from "viem/chains";

const { publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [publicProvider()]
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

function Config({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
export default Config;
