'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";
import { base, baseSepolia } from 'viem/chains';
import ReactQueryProvider from "./ReactQueryProvider";

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
            defaultChain: baseSepolia,
            supportedChains: [base, baseSepolia],
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
