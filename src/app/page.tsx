"use client";
import { useEffect, useState } from "react";
import DashBoard from "./components/DashBoard";
import TokenCreation from "./components/TokenCreation";
import CreateAta from "./components/CreateAta";
import MintToken from "./components/MintToken";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [tokenMintAdress, setTokenMintAdress] = useState<String | null>(null);
  const [ataAddress, setAtaAddress] = useState<string>("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    toast.info("Make sure you've devnet tokens");
  }, []);

  return (
    <div className="mb-8 space-y-5 text-center ">
      <Toaster position="top-center" closeButton />
      <h1 className="text-2xl font-bold">Step 1 create token Mint address</h1>
      <DashBoard
        tokenMintAdress={tokenMintAdress}
        setTokenMintAdress={setTokenMintAdress}
      />
      <TokenCreation
        tokenMintAdress={tokenMintAdress}
        setTokenMintAdress={setTokenMintAdress}
      />
      <h1 className="text-2xl font-bold">Step 2 Create token Account</h1>
      <CreateAta
        tokenMintAdress={tokenMintAdress}
        ataAddress={ataAddress}
        setAtaAddress={setAtaAddress}
      />
      <h1 className="text-2xl font-bold">Step 3 Now lets mint Token</h1>
      <MintToken
        ataAddress={ataAddress}
        tokenMintAdress={tokenMintAdress}
        setLoad={setLoad}
      />
      {load && (
        <h1 className=" text-2xl font-mono">
          {" "}
          Now go and check your wallet your tokens will be visible
        </h1>
      )}
    </div>
  );
}
