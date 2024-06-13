"use client";
import {
  createMintToInstruction,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useRef } from "react";
import { toast } from "sonner";

function MintToken({ ataAddress, tokenMintAdress, setLoad }: any) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  //   const ATA_Address = new PublicKey(ataAddress);
  const tokenRef = useRef<String | null>(null);

  const mintToken = async () => {
    if (
      !publicKey ||
      !connection ||
      !ataAddress ||
      !tokenMintAdress ||
      !tokenRef.current
    ) {
      console.log(
        "error while token mint something not came inside the mintFunction"
      );
      toast.info("Provide correct details or connect wallet");
      return;
    }

    const amount = Number(tokenRef.current);
    if (isNaN(amount) || amount <= 0) {
      toast.info("Please enter a valid number greater than 0");
      return;
    }

    const tokenMintAddressKey = new PublicKey(tokenMintAdress);
    const ataAddressKey = new PublicKey(ataAddress);

    const latestBlockHash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      feePayer: publicKey,
    });

    const instruction = createMintToInstruction(
      tokenMintAddressKey,
      ataAddressKey,
      publicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID
    );

    transaction.add(instruction);

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(
      {
        signature,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      },
      "confirmed"
    );

    toast.success(
      `tokens minted successfully go and check in solana explorer ,token mint  supply will be changed to ${amount}`
    );
    setLoad(true);
  };
  return (
    <div className=" p-2 flex items-center justify-around">
      <button onClick={mintToken} className="rounded-sm bg-slate-300 p-2 w-64">
        Mint Token 🥳
      </button>
      <input
        className="p-2 bg-slate-200 rounded-lg text-center"
        type="text"
        placeholder="Number of Tokens to Mint"
        onChange={(e: any) => (tokenRef.current = e.target.value)}
      />
    </div>
  );
}

export default MintToken;
