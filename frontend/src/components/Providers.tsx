import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
  const privyClientId = process.env.NEXT_PUBLIC_CLIENT_ID || '';

  return (
      <PrivyProvider
        appId={privyAppId}
        clientId={privyClientId}
        config={{
          loginMethods: ['wallet','telegram','email'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: '',
          },
          embeddedWallets: {
            createOnLogin: 'all-users'
          }
        }}
      >
        {children}
      </PrivyProvider>
  );
}
