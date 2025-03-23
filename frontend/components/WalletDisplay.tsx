import React from 'react';
import { shortenAddress } from '@/utils/formatAddress';

interface WalletDisplayProps {
  address: string;
}

export default function WalletDisplay({ address }: WalletDisplayProps) {
  return (
    <div className="border border-gray-300 rounded-md p-2 flex items-center">
      <span className="text-sm font-mono">{shortenAddress(address)}</span>
    </div>
  );
} 