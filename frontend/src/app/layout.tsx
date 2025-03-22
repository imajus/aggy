import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { LoginWalletButton } from "@/components/LoginWalletButton";
import Providers from "@/components/Providers";
import { Button } from "@/components/Button";

// (Optional) Site-wide metadata
export const metadata: Metadata = {
  title: "Aggy Dapp",
  description: "A freelance service dApp on Ethereum using USDC.",
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <Providers>
      <body className="bg-[#F7FAFC] text-[#2D3748]">
        <div className="flex h-screen">
          {/* Left Pane / Sidebar */}
          <aside className="w-64 bg-[#EDF2F7] p-4">
            <div className="mb-8">
              <p className="text-xl font-bold text-[#2B6CB0]">Aggy Dapp</p>
            </div>
            <nav className="space-y-2">
              <Link href="/submit" className="block p-2 text-[#4A5568] hover:bg-[#E2E8F0] rounded-md">
                Submit Job
              </Link>
              <Link href="/chat" className="block p-2 text-[#4A5568] hover:bg-[#E2E8F0] rounded-md">
                Chat
              </Link>
              <Link href="/tasks" className="block p-2 text-[#4A5568] hover:bg-[#E2E8F0] rounded-md">
                Task Board
              </Link>
              <Link
                href="/pending-reviews"
                className="block p-2 text-[#4A5568] hover:bg-[#E2E8F0] rounded-md"
              >
                Pending Reviews
              </Link>
              <Link
                href="/completed-tasks"
                className="block p-2 text-[#4A5568] hover:bg-[#E2E8F0] rounded-md"
              >
                Completed Tasks
              </Link>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between bg-white p-4 shadow-sm">
              <div className="font-bold text-lg text-[#2B6CB0]">Aggy Logo</div>
              <div className="flex items-center space-x-4">
                <Link href="/wallet-manager">
                  <Button className="bg-gray-100 hover:bg-gray-200 text-black">
                    Wallet Manager
                  </Button>
                </Link>
                <LoginWalletButton/>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-4 bg-[#F7FAFC]">
              {children}
            </main>
          </div>
        </div>
      </body>
      </Providers>
    </html>
  );
}
