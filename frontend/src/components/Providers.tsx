'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import {base, baseSepolia} from 'viem/chains';
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

  return (
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethods: ['wallet','telegram','email'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: '',
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
  );
}
