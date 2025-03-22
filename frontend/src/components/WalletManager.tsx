import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";
import { DelegateActionButton } from "./DelegateActionButton";

interface WalletBalance {
    address: string;
    balance: number;
    isEmbedded: boolean;
}

export function WalletManager() {
    const { authenticated, ready, user, createWallet } = usePrivy();

    const {wallets} = useWallets();
    const [balances, setBalances] = useState<WalletBalance[]>([]);
    const [fundAmount, setFundAmount] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    // Get the connected external wallet address
    const connectedAddress = user?.wallet?.address;

    // Fetch balances for all wallets
    const fetchBalances = useCallback(async () => {
        if (!wallets) return;
        const balances = await Promise.all(wallets.map(async (wallet) => {
            const balance = 0;
            return {
                address: wallet.address,
                balance,
                isEmbedded: wallet.connectorType === 'embedded',
            };
        }));
        setBalances(balances);
    },[wallets]);

    useEffect(() => {
        console.log("wallets", wallets);    
        if (authenticated && wallets && wallets.length > 0) {
          fetchBalances();
          const interval = setInterval(fetchBalances, 60000);
          return () => clearInterval(interval);
        }
      }, [authenticated, wallets, fetchBalances]);

    // Handle wallet creation
    const handleCreateWallet = async () => {
        setLoading(true);
        try {
            await createWallet();
            await fetchBalances();
        } catch (error) {
            console.error("Error creating wallet:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle funding between wallets
    const handleFund = useCallback(async (fromAddress: string, toAddress: string) => {
    },[wallets, balances]);

    if (!ready) {
        return <div className="p-4 text-black">Loading...</div>;
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="space-x-2 text-sm text-black">
                        <span>Status: {authenticated ? "Authenticated" : "Not Authenticated"}</span>
                        <span>Ready: {ready ? "Yes" : "No"}</span>
                        <span>User: {user?.wallet?.address}</span>
                        <span>Privy User: {user?.id}</span>
                    </div>
                </div>
            </div>

            {authenticated && (
                <>
                    <DelegateActionButton />
                    <button
                        onClick={handleCreateWallet}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                    >
                        {loading ? "Creating..." : "Create New Embedded Wallet"}
                    </button>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">Your Wallets</h3>
                        {balances.map((walletBalance) => (
                            <div
                                key={walletBalance.address}
                                className="p-4 border rounded-lg space-y-2"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-mono text-sm text-black">
                                            {walletBalance.address}
                                        </p>
                                        <p className="text-sm text-black">
                                            Balance: {walletBalance.balance.toFixed(4)} SOL
                                        </p>
                                        <p className="text-sm text-black">
                                            Type: {walletBalance.isEmbedded ? "Embedded" : "External"}
                                        </p>
                                    </div>
                                    {walletBalance.isEmbedded && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="Amount in SOL"
                                                className="px-2 py-1 border rounded text-black"
                                                value={fundAmount[walletBalance.address] || ""}
                                                onChange={(e) => setFundAmount({
                                                    ...fundAmount,
                                                    [walletBalance.address]: e.target.value
                                                })}
                                            />
                                            <button
                                                onClick={() => handleFund(wallets[0].address, walletBalance.address)}
                                                disabled={loading}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                                            >
                                                Fund
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}