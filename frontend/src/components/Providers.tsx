'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm8ihdh9201yn452te2rietk3"
      config={{
        loginMethods: ['wallet', 'telegram', 'email', 'google'],
        appearance: {
          theme: 'light',
          accentColor: '#000000',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        defaultChain: sepolia,
      }}
    >
      {children}
    </PrivyProvider>
  );
} 