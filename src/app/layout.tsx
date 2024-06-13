import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "./components/WalletContextProvider";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Your Own Tokens On Devnte",
  description:
    "A simple way which abstracts all the complexity while creating a token",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          <div className="h-screen bg-red-100 p-4">
            <Header />
            <div className="flex justify-between m-2">
              <h1 className="text-2xl font-mono text-red-700 text-center p-3">
                Create a new account and get some devnet tokens and then play
                around
              </h1>
              <a
                className="items-center text-green-600 text-2xl"
                href="https://solfaucet.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SOL FAUCET
              </a>
            </div>
            <p className="text-2xl font-bold text-center  p-4 text-green-900">
              connect with devnet only
            </p>
            {children}
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
