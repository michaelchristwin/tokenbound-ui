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
      className={`w-full mx-auto bg-neutral-900 h-[70px] flex justify-between lg:px-[30px] px-[10px] rounded-b-[10px] items-center`}
    >
      <div className={`flex px-3 items-center`}>
        <Image
          src={`/tokenbound.png`}
          alt="tokenbound"
          width={40}
          height={40}
          className={`w-[40px] rounded-full h-[40px]`}
        />
      </div>
      <div className={`lg:block hidden`}>
        <w3m-button size="md" />
      </div>
      <div className={`lg:hidden md:hidden xl:hidden block`}>
        <w3m-button size="sm" />
      </div>
    </nav>
  );
}

export default Navbar;
