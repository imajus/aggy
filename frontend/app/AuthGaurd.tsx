"use client";

import { ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import LandingPage from "./page";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { authenticated } = usePrivy();

  // If not connected, show the LandingPage (or any other “Please Connect” UI).
  if (!authenticated) {
    return <LandingPage />;
  }

  // Otherwise, show the app’s main layout.
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-background-main">
          {children}
        </main>
      </div>
    </div>
  );
}
