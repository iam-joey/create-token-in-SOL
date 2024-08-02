"use client";

import dynamic from "next/dynamic";
import React from "react";
const WalletMultiButtonFix = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function Header() {
  return (
    <div className="flex flex-wrap gap-8 justify-center items-center ">
      <div className="">
        <span className="font-bold text-xl">Create Tokens</span>
      </div>
      <div>
        <WalletMultiButtonFix />
      </div>
    </div>
  );
}

export default Header;
