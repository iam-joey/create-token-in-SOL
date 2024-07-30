"use client";
import {
  createInitializeMintInstruction,
  createMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function TokenCreation({
  tokenMintAdress,
  setTokenMintAdress,
}: any) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const nameRef = useRef<String>("");
  const createMintAddress = async (e: any) => {
    e.preventDefault();

    try {
      if (!publicKey) {
        console.log("Connect your wallet");
        toast.info("Connect your wallet");
        return;
      }

      if (nameRef.current == "") {
        console.log("Give any name");
        toast.info("Give token Name");
        return;
      }
      const mintAccount = Keypair.generate();
      const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );

      const lamports = await connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );

      const instruction1 = SystemProgram.createAccount({
        fromPubkey: publicKey,
        lamports,
        newAccountPubkey: mintAccount.publicKey,
        programId: TOKEN_PROGRAM_ID,
        space: MINT_SIZE,
      });

      const instruction2 = createInitializeMintInstruction(
        mintAccount.publicKey,
        1,
        publicKey,
        publicKey,
        TOKEN_PROGRAM_ID
      );
      const latestBlockhash = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        feePayer: publicKey,
      });

      transaction.add(instruction1, instruction2);

      const metadataData = {
        name: nameRef.current as string,
        symbol: "🦁",
        description: "Let's make your coin 100x",
        uri: "https://github.com/iam-joey/Estate/blob/master/metadata.json",
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      };

      const [metaDataPda, seedBump] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintAccount.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

      const instruction = createCreateMetadataAccountV3Instruction(
        {
          metadata: metaDataPda,
          mint: mintAccount.publicKey,
          mintAuthority: publicKey,
          updateAuthority: publicKey,
          payer: publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: metadataData,
            isMutable: true,
            collectionDetails: null,
          },
        }
      );

      transaction.add(instruction);
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintAccount],
      });

      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );

      setTokenMintAdress(mintAccount.publicKey.toBase58().toString());
    } catch (error) {
      console.log("not able to create a token mint");
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!publicKey || !connection) {
      //@ts-ignore
      setTokenMintAdress(null);
      nameRef.current = "";
    }
  }, [connection, publicKey]);

  return (
    <div className=" p-2 flex flex-wrap gap-4 items-center justify-around">
      <button
        onClick={createMintAddress}
        className="rounded-md bg-slate-300 p-2 w-64"
      >
        Create Token Mint Address
      </button>
      <input
        className="p-2 bg-slate-200 rounded-lg text-center"
        type="text"
        placeholder="Enter Token Name"
        onChange={(e) => (nameRef.current = e.target.value)}
      />
      {tokenMintAdress && <p> Token Mint Address is : {tokenMintAdress}</p>}
    </div>
  );
}
