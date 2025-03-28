'use client';

import { useWallets, useLogin, usePrivy, WalletWithMetadata, useHeadlessDelegatedActions } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

export function WalletStatus() {
  const { ready } = useWallets();
  const { login } = useLogin();
  const { ready: privyReady, authenticated, user, logout } = usePrivy();
  const { delegateWallet } = useHeadlessDelegatedActions();

  // Find embedded Privy wallet
  const embeddedWallets = user?.linkedAccounts.filter(
    (account): account is WalletWithMetadata =>
      account.type === 'wallet' && 
      account.walletClientType === 'privy'
  );

  // Check if any wallet is delegated
  const delegatedWallet = embeddedWallets?.find(wallet => wallet.delegated);
  const hasDelegatedWallet = Boolean(delegatedWallet);

  // Effect to request delegation when authenticated but not delegated
  useEffect(() => {
    async function requestDelegation() {
      if (authenticated && embeddedWallets?.length && !hasDelegatedWallet) {
        try {
          await delegateWallet({
            address: embeddedWallets[0].address,
            chainType: 'ethereum'
          });
        } catch (error) {
          console.error('Failed to delegate wallet:', error);
        }
      }
    }

    requestDelegation();
  }, [authenticated, embeddedWallets?.length, hasDelegatedWallet]);

  if (!ready || !privyReady) {
    return <div className="text-sm">Loading...</div>;
  }

  if (!authenticated) {
    return (
      <Button 
        onClick={login}
        size="sm"
        variant="outline"
        className="w-auto"
      >
        Connect Wallet
      </Button>
    );
  }

  if (!delegatedWallet) {
    return (
      <div className="text-sm">
        No embedded wallet found
      </div>
    );
  }

  // Use the first embedded wallet
  const shortAddress = `${delegatedWallet.address.slice(0, 4)}...${delegatedWallet.address.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium">
        Connected: {shortAddress}
      </div>
      <Button 
        onClick={logout}
        size="sm"
        variant="ghost"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        Sign Out
      </Button>
    </div>
  );
} 