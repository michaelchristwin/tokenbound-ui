"use client";

import { useParams } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { WalletClient, createWalletClient, custom, http } from "viem";
import { goerli } from "viem/chains";
import ABI from "@/ABIS/ABI.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useContractRead } from "wagmi";
import { ScaleLoader } from "react-spinners";
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
  const [currentNft, setCurrentNft] = useState<Nft | undefined>(undefined);
  const [isDeployeds, setIsDeployed] = useState<boolean | undefined>(undefined);

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

  const tokenAccount = useContractRead({
    address: params.address as `0x${string}`,
    args: [params.id],
    functionName: "tokenAccount",
    abi: ABI,
  });
  const start = String(tokenAccount.data).slice(0, 5);
  const finish = String(tokenAccount.data).slice(-5);
  const copyAdd = () => {
    navigator.clipboard.writeText(tokenAccount.data as string);
  };

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
  return (
    <div
      className={`flex w-full h-[100vh] justify-center space-x-[20px] px-[60px]`}
    >
      {currentNft ? (
        <>
          <div className={`block space-y-3`}>
            <Image
              src={currentNft.image}
              width={550}
              height={550}
              className={`w-[550px] h-[550px] rounded-[15px]`}
              alt="NFT"
            />
            <p className={`text-[25px] font-[600]`}>{currentNft.name}</p>
          </div>
          <div
            className={`block w-[70%] bg-neutral-900 rounded-[8px] p-[40px]`}
          >
            <div>
              <div
                className={`flex text-[#1098fc] bg-[#21384a] rounded-[15px] space-x-1 px-2 w-fit h-[30px] items-center justify-center`}
              >
                <p className={`text-[16px]`}>
                  {start}...{finish}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  className={`w-4 h-4 cursor-pointer`}
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  onClick={copyAdd}
                >
                  <g fill="none">
                    <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"></path>
                    <path
                      fill="currentColor"
                      d="M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h10Zm-4 6H5v12h10V8Zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h2Zm9-11H9v2h6a2 2 0 0 1 2 2v8h2V4Zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11h4Z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div
                className={`grid grid-cols-2 gap-y-8 gap-x-[50px] mt-[70px] w-[350px]`}
              >
                <button
                  className={`px-2 block h-[33px] bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg w-[150px]`}
                  onClick={createAccount}
                >
                  Create Account
                </button>
                <button
                  className={`px-2 h-[33px] block bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg w-[150px]`}
                  onClick={getTBAccount}
                >
                  Get Account
                </button>
                <div className={`block space-y-2 h-fit`}>
                  <button
                    className={`px-2 h-[33px] block bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg w-[150px]`}
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
                  className={`px-2 h-[33px] block bg-white hover:opacity-75 active:opacity-60 mx-auto text-black rounded-lg w-[150px]`}
                  onClick={getNft}
                >
                  Get NFT
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`flex w-full justify-center h-[240px] items-center`}>
          <ScaleLoader color="#ADD8E6" />
        </div>
      )}
    </div>
  );
}

export default Page;
