import {
    useDelegatedActions,
    usePrivy,
    useWallets,
    type WalletWithMetadata
} from '@privy-io/react-auth';
import { KeyRound } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Button } from './Button';
export function DelegateActionButton() {
    const { user } = usePrivy();
    const {wallets, ready} = useWallets();
    const { delegateWallet } = useDelegatedActions();

    // Find the embedded wallet to delegate from the array of the user's wallets
    const walletToDelegate = useMemo(() => {
        return wallets.find((wallet) => wallet.connectorType === 'embedded');
    }, [wallets]);

    // Check if the wallet is already delegated
    const isAlreadyDelegated = !!user?.linkedAccounts.find(
        (account): account is WalletWithMetadata => account.type === 'wallet' && account.delegated,
    );

    const onDelegate = useCallback(async () => {
        console.log("Delegate button clicked");
        if (!walletToDelegate || !ready) {
            console.log("Cannot delegate: wallet not ready or not found", { walletToDelegate, ready });
            return;
        }
        try {
            console.log("Starting wallet delegation for:", walletToDelegate.address);
            await delegateWallet({ address: walletToDelegate.address, chainType: 'solana' });
            console.log("Wallet delegated successfully");
        } catch (error) {
            console.error('Failed to delegate wallet:', error);
        }
    }, [walletToDelegate, ready, delegateWallet]);

    if (isAlreadyDelegated) {
        return (
            <Button
                className="bg-[#e6e2ae] text-black py-1 rounded-full border border-black font-medium flex items-center justify-center gap-2 px-4"
                disabled
            >
                <KeyRound className="w-4 h-4 mr-2" />
                Wallet Delegated
            </Button>
        );
    }

    return (
        <>
        {/* <Button
            disabled={!ready || !walletToDelegate}
            onClick={onDelegate}>
            <KeyRound className="w-4 h-4 mr-2" />
            {!ready ? 'Loading...' : 'Delegate Wallet'}
        </Button> */}

        <button onClick={onDelegate}>
            <KeyRound className="w-4 h-4 mr-2" />
        Delegate Wallet </button>
        </>
    );
}