import { Button } from "@/components/Button";
import { LoginWalletButton } from "@/components/LoginWalletButton";
import Providers from "@/components/Providers";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aggy Dapp",
  description: "A freelance service dApp on Ethereum using USDC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 
        Use a dark default text color and a light background from your theme.
        'text-text-primary' => #2D3748
        'bg-background-main' => #F7FAFC
      */}
      <body className="bg-background-main text-text-primary">
        <Providers>
          <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-background-sidebar p-4">
              <div className="mb-8">
                {/* Brand name in primary color (#2B6CB0) */}
                <p className="text-xl font-bold text-primary-main">Aggy Dapp</p>
              </div>
              <nav className="space-y-2">
                {/* Links use text-text-secondary (#4A5568) for a slightly lighter, but still readable shade */}
                <Link
                  href="/chat"
                  className="block p-2 text-text-secondary hover:bg-border rounded-md"
                >
                  Chat
                </Link>
                <Link
                  href="/tasks"
                  className="block p-2 text-text-secondary hover:bg-border rounded-md"
                >
                  Task Board
                </Link>
                <Link
                  href="/pending-reviews"
                  className="block p-2 text-text-secondary hover:bg-border rounded-md"
                >
                  Pending Reviews
                </Link>
                <Link
                  href="/completed-tasks"
                  className="block p-2 text-text-secondary hover:bg-border rounded-md"
                >
                  Completed Tasks
                </Link>
              </nav>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="flex items-center justify-between bg-background-paper p-4 shadow-sm">
                {/* Logo or brand in primary color */}
                <div className="font-bold text-lg text-primary-main">Aggy Logo</div>
                <div className="flex items-center space-x-4">
                  <LoginWalletButton />
                </div>
              </header>

              {/* Page Content */}
              {/* If you want a slightly off-white background, use 'bg-background-main'. */}
              <main className="flex-1 overflow-y-auto p-4 bg-background-main">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
