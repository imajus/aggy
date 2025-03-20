import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

// (Optional) Site-wide metadata
export const metadata: Metadata = {
  title: "Aggy Dapp",
  description: "A freelance service dApp on Ethereum using USDC.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {/* Left Pane / Sidebar */}
          <aside className="w-64 bg-gray-100 p-4">
            <div className="mb-8">
              <p className="text-xl font-bold">Aggy Dapp</p>
            </div>
            <nav className="space-y-2">
              <Link href="/" className="block p-2 hover:bg-gray-200">
                Landing
              </Link>
              <Link href="/submit" className="block p-2 hover:bg-gray-200">
                Submit Job
              </Link>
              <Link href="/chat" className="block p-2 hover:bg-gray-200">
                Chat
              </Link>
              <Link href="/tasks" className="block p-2 hover:bg-gray-200">
                Task Board
              </Link>
              <Link
                href="/pending-reviews"
                className="block p-2 hover:bg-gray-200"
              >
                Pending Reviews
              </Link>
              <Link
                href="/completed-tasks"
                className="block p-2 hover:bg-gray-200"
              >
                Completed Tasks
              </Link>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between bg-white p-4 shadow">
              <div className="font-bold text-lg">Aggy Logo</div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Connect Wallet
              </button>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
