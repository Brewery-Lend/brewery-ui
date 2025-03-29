import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "../providers/WalletProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Brewery Lend - NFT Lending",
  description: "Borrow and lend with NFT collateral on Brewery Lend - Cross-chain composability.",
  icons: {
    icon: '/espresso-logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-[#121212] min-h-screen text-white`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
