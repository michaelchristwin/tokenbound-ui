"use client";
import { useParams } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { createWalletClient, custom, http } from "viem";
import { goerli } from "viem/chains";
import { useCallback, useMemo } from "react";
import { WindowProvider, useContractRead } from "wagmi";
import { getAccount } from "wagmi/actions";
declare global {
  interface Window {
    ethereum?: WindowProvider;
  }
}
let contractAddress = "0x4bB0a205fceD93c8834b379c461B07BBe6aAE622";
function Page() {
  const params = useParams();

  const { address } = getAccount();
  console.log(address);
  const walletClient = createWalletClient({
    account: address as `0x${string}`,
    chain: goerli,
    transport: window.ethereum ? custom(window.ethereum) : http(),
  });
  const tokenboundClient = useMemo(() => {
    return new TokenboundClient({
      walletClient,
      chainId: 5,
    });
  }, [walletClient]);

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    try {
      const createdAccount = await tokenboundClient.createAccount({
        tokenContract: contractAddress as `0x${string}`,
        tokenId: `${params.id}`,
      });
      return createdAccount;
    } catch (err) {
      console.error("Account creation failed", err);
    }
  }, [tokenboundClient, params.id, address]);

  const getTBAccount = useCallback(() => {
    if (!tokenboundClient || !address) return;
    try {
      const TBAccount = tokenboundClient.getAccount({
        tokenContract: contractAddress as `0x${string}`,
        tokenId: `${params.id}`,
      });
      return TBAccount;
    } catch (err) {
      console.error("Failed to get account", err);
    }
  }, [tokenboundClient, params.id, address]);

  const isAccountDeployed = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    try {
      const isDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: getTBAccount() as `0x${string}`,
      });
      return isDeployed;
    } catch (err) {
      console.error("Account creation failed", err);
    }
  }, [tokenboundClient, getTBAccount, address]);

  const getNft = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    try {
      const nft = await tokenboundClient.getNFT({
        accountAddress: getTBAccount() as `0x${string}`,
      });
      return nft;
    } catch (err) {
      console.error("Account creation failed", err);
    }
  }, [tokenboundClient, getTBAccount, address]);

  return (
    <div className={`block space-y-3`}>
      <h1>999 {params.address}</h1>
      <h1>{params.id}</h1>
      <button
        className={`px-2 block h-[33px] bg-white text-black rounded-[13px]`}
        onClick={createAccount}
      >
        Create Account
      </button>
      <button
        className={`px-2 h-[33px] block bg-white text-black rounded-[13px]`}
        onClick={getTBAccount}
      >
        Get Account
      </button>
      <button
        className={`px-2 h-[33px] block bg-white text-black rounded-[13px]`}
        onClick={isAccountDeployed}
      >
        Is Deployed
      </button>
      <button
        className={`px-2 h-[33px] block bg-white text-black rounded-[13px]`}
        onClick={getNft}
      >
        Get NFT
      </button>
    </div>
  );
}

export default Page;
