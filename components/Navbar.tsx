"use client";

import { DM_Sans } from "next/font/google";
import Image from "next/image";

const dmsans = DM_Sans({
  weight: "600",
  subsets: ["latin"],
});

function Navbar() {
  return (
    <nav
      className={`w-full mx-auto bg-neutral-900 h-[70px] flex justify-between px-[30px]  rounded-b-[10px] items-center`}
    >
      <div className={`flex px-3  items-center`}>
        <h1 className={`text-[25px] ${dmsans.className}`}>Tokenbound UI</h1>
        <Image
          src={`/tokenbound.png`}
          alt="tokenbound"
          width={40}
          height={40}
          className={`w-[40px] h-[40px]`}
        />
      </div>
      <w3m-button />
    </nav>
  );
}

export default Navbar;
