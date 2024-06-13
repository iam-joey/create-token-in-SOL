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
    <div className="flex justify-between p-5 items-center ">
      <div className="">
        <span className="font-bold">Create Tokens</span>
      </div>
      <div>
        <WalletMultiButtonFix />
      </div>
    </div>
  );
}

export default Header;
