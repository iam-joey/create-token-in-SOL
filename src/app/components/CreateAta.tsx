"use client";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function CreateAta({ tokenMintAdress, ataAddress, setAtaAddress }: any) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    if (!publicKey || !connection) {
      //@ts-ignore
      setAtaAddress("");
    }
  }, [connection, publicKey]);
  const generateAtaAccount = async () => {
    if (!publicKey || !connection || !tokenMintAdress) {
      console.log("create ata connection or token mint address not generated");
      toast.info("Connect your wallet");
      return;
    }

    try {
      const ata = getAssociatedTokenAddressSync(
        new PublicKey(tokenMintAdress),
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const instruction = createAssociatedTokenAccountInstruction(
        publicKey,
        ata,
        publicKey,
        new PublicKey(tokenMintAdress),
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const latestBlockhash = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        feePayer: publicKey,
      });

      transaction.add(instruction);

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );
      setAtaAddress(ata.toBase58().toString());
    } catch (error) {
      console.log("error while creating ATA");
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="p-2 flex items-center justify-around">
      <button
        onClick={generateAtaAccount}
        className="rounded-sm bg-slate-300 p-2 w-64"
      >
        Create ATA ADDRESS
      </button>
      {ataAddress && <p>ATA account created : {ataAddress}</p>}
    </div>
  );
}

export default CreateAta;
