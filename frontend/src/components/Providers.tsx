'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";
import { base, baseSepolia, sepolia } from 'viem/chains';
import ReactQueryProvider from "./ReactQueryProvider";
import { sep } from "path";

export default function Providers({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
  return (
    <ReactQueryProvider>
        <PrivyProvider
          appId={privyAppId}
          config={{
            loginMethods: ['wallet','telegram','email'],
            appearance: {
              theme: 'light',
              accentColor: '#676FFF',
            },
            defaultChain: sepolia,
            supportedChains: [base, baseSepolia, sepolia],
            embeddedWallets: {
              createOnLogin: 'all-users'
            }
          }}
          >
          {children}
        </PrivyProvider>
        </ReactQueryProvider>
  );
}
