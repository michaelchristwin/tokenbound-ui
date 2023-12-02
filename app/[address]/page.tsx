"use client";
import { useParams } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { WalletClient } from "wagmi";
import { createWalletClient, http } from "viem";
import { goerli } from "viem/chains";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

function Page() {
  const params = useParams();
  const [contractAddres, setContractAddres] = useState<`0x${string}`>(
    `0x${""}`
  );

  useEffect(() => {
    const tokenboundClient = new TokenboundClient({
      chain: goerli,
    });
    (async () => {
      const nft = await tokenboundClient.getNFT({
        accountAddress: params.address as any,
      });
      const { tokenContract, tokenId, chainId } = nft;
      setContractAddres(tokenContract);
      console.log("Add:", tokenContract);
      console.log("chainid:", chainId);
    })();
  }, [params]);

  return (
    <div>
      <h1>999 {params.address}</h1>
    </div>
  );
}

export default Page;
