"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FD {
  address: string;
  id: string;
}

function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<FD>({ address: "", id: "" });
  const { address, id } = formData;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFindClick = () => {
    if (address) {
      router.push(`/${address}/${id}`);
    }
  };
  return (
    <div className={`w-full h-[100vh] `}>
      <div
        className={`flex space-x-2 h-full bg-neutral-900 w-[98%] rounded-[12px] mx-auto justify-center items-center`}
      >
        <input
          type="text"
          name="address"
          onChange={handleChange}
          value={address}
          className={`h-[40px] rounded-lg ps-3 w-[380px] bg-[#2f2f2f] border-[#6c6c6c] focus:outline-none placeholder:text-[#6c6c6c] border-[0.2px]`}
          placeholder="Enter Contract address"
        />
        <input
          type="text"
          name="id"
          onChange={handleChange}
          value={id}
          className={`h-[40px] rounded-lg ps-3 w-[200px] bg-[#2f2f2f] border-[#6c6c6c] focus:outline-none placeholder:text-[#6c6c6c] border-[0.2px]`}
          placeholder="Enter tokenid"
        />
        <button
          type="button"
          disabled={!(address && id)}
          onClick={handleFindClick}
          className={`px-[5px] w-[70px] disabled:bg-slate-600 disabled:text-white h-[30px] rounded-lg disabled:hover:opacity-100 disabled:active:opacity-100 hover:opacity-75 active:opacity-60 bg-white text-black`}
        >
          Find
        </button>
      </div>
    </div>
  );
}

export default Page;
