"use client";

import { useParams } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { Chain, WalletClient, createWalletClient, custom, http } from "viem";
import { goerli, iotex } from "viem/chains";
import ABI from "@/ABIS/ABI.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useContractRead } from "wagmi";
import { ScaleLoader } from "react-spinners";
import { getAccount, getNetwork } from "wagmi/actions";
import Image from "next/image";
declare let window: any;

interface Nft {
  name: string;
  image: string;
}
function Page() {
  const params = useParams();
  const { address } = getAccount();
  const { chain } = getNetwork();
  const [client, setClient] = useState<WalletClient | undefined>(undefined);
  const [currentNft, setCurrentNft] = useState<Nft | undefined>(undefined);
  const [isDeployeds, setIsDeployed] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (address && window.ethereum) {
      const walletClient = createWalletClient({
        account: address as `0x${string}`,
        chain: chain,
        transport: window.ethereum ? custom(window.ethereum) : http(),
      });
      setClient(walletClient);
    }
  }, [address]);

  // useEffect(() => {
  //   if (client && client.chain?.id !== 4689) {
  //     client.addChain({
  //       chain: chain as Chain,
  //     });
  //   }
  // }, [client, chain]);

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
      chain: chain,
      chainId: chain?.id,
    });
  }, [client, chain]);

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
    let TBAccount;
    try {
      TBAccount = tokenboundClient.getAccount({
        tokenContract: params.address as `0x${string}`,
        tokenId: `${params.id}`,
      });
    } catch (err) {
      console.error("Failed to get account", err);
    }
    return TBAccount;
  }, [tokenboundClient, params.id, params.address, address]);

  const isAccountDeployed = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    let isDeployed;
    try {
      isDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: getTBAccount() as `0x${string}`,
      });
    } catch (err) {
      console.error("Account creation failed", err);
    }
    return isDeployed;
  }, [tokenboundClient, getTBAccount, address]);

  const getNft = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    let nft;
    try {
      nft = await tokenboundClient.getNFT({
        accountAddress: getTBAccount() as `0x${string}`,
      });
    } catch (err) {
      console.error("Account creation failed", err);
    }
    return nft;
  }, [tokenboundClient, getTBAccount, address]);

  const isDeployedClick = async () => {
    const res = await isAccountDeployed();
    console.log(res);
    if (res !== undefined) {
      setIsDeployed(res);

      setTimeout(() => {
        setIsDeployed(undefined);
      }, 9000);
    }
  };

  const DynamicL = () => {
    if (currentNft) {
      return (
        <>
          <div className={`block space-y-3`}>
            <Image
              src={currentNft.image}
              width={550}
              height={550}
              className={`lg:w-[550px] lg:h-[550px] md:w-[550px] md:h-[550px] w-[97%] block mx-auto h-[300px] rounded-[15px]`}
              alt="NFT"
            />
            <p
              className={`lg:text-[30px] md:text-[30px] text-[20px] lg:text-start md:text-start text-center font-[700]`}
            >
              {currentNft.name}
            </p>
          </div>
          <div
            className={`block lg:w-[70vw] lg:mt-0 md:mt-0 xl:mt-0 mt-8 md:w-[70vw] w-full bg-neutral-900 rounded-[8px] lg:p-[40px] md:p-[30px] p-[5px]`}
          >
            <div>
              <div
                className={`grid grid-cols-2 gap-y-8 lg:gap-x-[50px] md:gap-x-[50px] gap-x-[10px] lg:mt-[70px] mt-[70px] lg:w-[350px] md:w-[350px] w-[300px]`}
              >
                <button
                  className={`px-2 block h-[33px] bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg md:w-[150px] w-[140px] lg:w-[150px]`}
                  onClick={createAccount}
                >
                  Create Account
                </button>
                <button
                  className={`px-2 h-[33px] block bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg md:w-[150px] w-[140px] lg:w-[150px]`}
                  onClick={getTBAccount}
                >
                  Get Account
                </button>
                <div className={`block space-y-2 h-fit`}>
                  <button
                    className={`px-2 h-[33px] block bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg md:w-[150px] w-[140px] lg:w-[150px]`}
                    onClick={() => isDeployedClick()}
                  >
                    Is Deployed
                  </button>
                  <p
                    className={`${
                      isDeployeds === true ? "text-green-600" : "text-red-600"
                    }  block tex-[15px] text-center
                } ${isDeployeds === undefined && "hidden"}`}
                  >
                    {String(isDeployeds)}
                  </p>
                </div>
                <button
                  className={`px-2 h-[33px] block bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg md:w-[150px] w-[120px] lg:w-[150px]`}
                  onClick={getNft}
                >
                  Get NFT
                </button>
              </div>
            </div>
          </div>
        </>
      );
    } else if (isLoading) {
      return (
        <div className={`flex w-full justify-center h-[240px] items-center`}>
          <ScaleLoader color="#ADD8E6" />
        </div>
      );
    } else if (isError) {
      return (
        <div className={`flex w-full justify-center h-[240px] items-center`}>
          <p className={`text-[18px] text-white font-[600] text-center`}>
            404: Nothing to see here..........
          </p>
        </div>
      );
    }
  };
  return (
    <div
      className={`lg:flex md:flex block w-full lg:h-[100vh] h-full justify-center lg:space-x-[20px] space-x-0 px-[2%]`}
    >
      <DynamicL />
    </div>
  );
}

export default Page;
