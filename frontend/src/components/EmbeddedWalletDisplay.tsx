"use client";

import { shortenAddress } from "@/utils/FormatAddress";
import { useWallets } from "@privy-io/react-auth";

function EmbeddedWalletDisplay() {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.connectorType === "embedded") || null;

  if (!embeddedWallet) {
    return null;
  }

  return     (
  <div className="border border-gray-300 rounded-md p-2 flex items-center">
  <span className="text-sm font-mono">{`Embedded: ${shortenAddress(embeddedWallet?.address || "")}`}</span>
</div>);
}

export default EmbeddedWalletDisplay;
