import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Aggy Dapp",
  description: "A freelance service dApp on Ethereum using USDC.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* 
        Use a dark default text color and a light background from your theme.
        'text-text-primary' => #2D3748
        'bg-background-main' => #F7FAFC
      */}
      <body className="bg-[#F7FAFC] text-[#2D3748]">
        <AuthProvider>
          <Providers>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 bg-background-main">
                  {children}
                </main>
              </div>
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
