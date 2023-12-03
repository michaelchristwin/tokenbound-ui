"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DM_Sans } from "next/font/google";
import Image from "next/image";

function Page() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
  };
  const handleFindClick = () => {
    if (address) {
      router.push(`/${address}`);
    }
  };
  return (
    <div className={`w-full h-[100vh]`}>
      <div
        className={`flex space-x-2 h-full w-full justify-center items-center`}
      >
        <input
          type="text"
          onChange={handleChange}
          value={address}
          className={`h-[35px] rounded-[13px] ps-3 w-[380px] bg-[#2f2f2f] border-[#6c6c6c] focus:outline-none placeholder:text-[#6c6c6c] border-[0.2px]`}
          placeholder="Enter token Account"
        />
        <button
          type="button"
          onClick={handleFindClick}
          className={`px-[5px] w-[70px] h-[30px] rounded-[13px] hover:opacity-75 active:opacity-60 bg-white text-black`}
        >
          Find
        </button>
      </div>
    </div>
  );
}

export default Page;
