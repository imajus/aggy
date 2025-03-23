import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "@/components/Providers";
import AuthGuard from "./AuthGaurd";
import WalletDisplay from '@/components/WalletDisplay';

export const metadata: Metadata = {
  title: "Aggy Dapp",
  description: "A freelance service dApp on Ethereum using USDC.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F7FAFC] text-[#2D3748]">
        <Providers>
          {/* The AuthGuard decides whether to show the LandingPage or the main UI */}
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
