import Providers from "@/components/Providers";
import DelegateGaurd from "@/gaurd/DelegateGaurd";
import type { Metadata } from "next";
import { ReactNode } from "react";
import AuthGuard from "../src/gaurd/AuthGaurd";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aggy Dapp",
  description: "A freelance service dApp on Ethereum using USDC.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F7FAFC] text-[#3173E2]">
        <Providers>
          {/* The AuthGuard decides whether to show the LandingPage or the main UI */}
          <AuthGuard>
            <DelegateGaurd>
            {children}
            </DelegateGaurd>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
