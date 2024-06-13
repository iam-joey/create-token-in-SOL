"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashBoard({
  tokenMintAdress,
  setTokenMintAdress,
}: any) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const getInfo = async () => {
    try {
      if (connection && publicKey) {
        setAddress(publicKey.toBase58());
        const info = await connection.getAccountInfo(publicKey);
        if (!info) {
          toast.info("Get some tokens from the devnet faucet");
          setBalance(null);
          return;
        }
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    } catch (error) {
      console.error("Error while fetching account info:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getInfo();

    return () => {
      setTokenMintAdress(null);
    };
  }, [connection, publicKey]);

  return (
    <div className="">
      {connection && publicKey && (
        <div className=" ">
          <h1 className="text-center p-2 text-2xl font-mono">
            You have SOL: {balance !== null ? balance.toFixed(2) : "0"} in your
            wallet
          </h1>
        </div>
      )}
    </div>
  );
}
