"use client";

import { useParams } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { WalletClient, createWalletClient, custom, http } from "viem";
import { goerli } from "viem/chains";
import ABI from "@/ABIS/ABI.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WindowProvider, useContractRead } from "wagmi";
import { getAccount } from "wagmi/actions";
import Image from "next/image";
declare let window: any;

let contractAddess = "0x4bB0a205fceD93c8834b379c461B07BBe6aAE622";
interface Nft {
  name: string;
  image: string;
}
function Page() {
  const params = useParams();
  const { address } = getAccount();
  const [client, setClient] = useState<WalletClient | undefined>(undefined);
  const [currentNft, setCurrentNft] = useState<Nft>({ name: "", image: "" });

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

  const { data, isLoading, isError } = useContractRead({
    address: params.address as `0x${string}`,
    args: [params.id],
    functionName: "tokenURI",
    abi: ABI,
  });

  useEffect(() => {
    (async () => {
      try {
        const myNft = await fetch(data as string);
        const res = await myNft.json();
        const totou: Nft = { name: res.name, image: res.image };
        setCurrentNft(totou);
      } catch (err) {
        console.error("Ferch failed:", err);
      }
    })();
  }, [data]);
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
        tokenContract: params.address as `0x${string}`,
        tokenId: `${params.id}`,
      });
      return createdAccount;
    } catch (err) {
      console.error("Account creation failed", err);
    }
  }, [tokenboundClient, params.id, params.address, address]);

  const getTBAccount = useCallback(() => {
    if (!tokenboundClient || !address) return;
    try {
      const TBAccount = tokenboundClient.getAccount({
        tokenContract: params.address as `0x${string}`,
        tokenId: `${params.id}`,
      });
      return TBAccount;
    } catch (err) {
      console.error("Failed to get account", err);
    }
  }, [tokenboundClient, params.id, params.address, address]);

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
          src={currentNft.image}
          width={300}
          height={400}
          className={`w-[350px] h-[400px] rounded-[15px]`}
          alt="NFT"
        />
      </div>
      <div className={`block`}>
        <p className={`text-[22px] font-[600]`}>{currentNft.name}</p>

        <div className={`block space-y-3 items-center mt-[100px]`}>
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
    </div>
  );
}

export default Page;
