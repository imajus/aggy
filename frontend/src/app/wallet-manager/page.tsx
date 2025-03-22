'use client';

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { WalletManager } from "@/components/WalletManager";

export default function WalletManagerPage() {
  const { user, ready } = usePrivy();
  const router = useRouter();

  if (!ready) {
    return <div className="text-black">Loading...</div>;
  }

  const walletAddress = user?.wallet?.address;
  const email = user?.email?.address;
  const telegram = user?.telegram?.username;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black mb-4">Wallet Manager</h1>
        <Button
          onClick={() => router.push('/')}
          className="mb-4"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-black">Connected Wallet</h2>
          <p className="text-black break-all">
            {walletAddress || 'No wallet connected'}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-black">Connected Accounts</h2>
          <div className="space-y-2">
            {email && (
              <div className="flex items-center space-x-2">
                <span className="text-black">Email:</span>
                <span className="text-black">{email}</span>
              </div>
            )}
            {telegram && (
              <div className="flex items-center space-x-2">
                <span className="text-black">Telegram:</span>
                <span className="text-black">@{telegram}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <WalletManager/>
    </div>
  );
} 