"use client";

import { useParams } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { WalletClient, createWalletClient, custom, http } from "viem";
import { goerli } from "viem/chains";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WindowProvider } from "wagmi";
import { getAccount } from "wagmi/actions";
import Image from "next/image";
declare let window: any;

let contractAddress = "0x4bB0a205fceD93c8834b379c461B07BBe6aAE622";
function Page() {
  const params = useParams();
  const { address } = getAccount();
  const [client, setClient] = useState<WalletClient | undefined>(undefined);
  console.log(address);

  useEffect(() => {
    if (address && window.ethereum) {
      const walletClient = createWalletClient({
        account: address as `0x${string}`,
        chain: goerli,
        transport: window.ethereum ? custom(window.ethereum) : http(),
      });
      setClient(walletClient);
    }
  }, [address]);

  const tokenboundClient = useMemo(() => {
    return new TokenboundClient({
      walletClient: client,
      chainId: 5,
    });
  }, [client]);

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
    <div
      className={`flex w-full h-[100vh] space-x-[30px] bg-neutral-900 rounded-[8px] p-[60px]`}
    >
      <div className={`block space-y-3`}>
        <Image
          src={`/F1daXLaaIAANzSM.jpg`}
          width={300}
          height={400}
          className={`w-[350px] h-[400px] rounded-[15px]`}
          alt="NFT"
        />
        <p className={`text-[22px] font-[600]`}>Chronicles of Narnia</p>
      </div>
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
    </div>
  );
}

export default Page;
