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
          <div className="h-screen bg-red-100">
            <Header /> {children}
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
