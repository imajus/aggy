'use client';

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/Button";
import { useState } from "react";

interface LoginWalletButtonProps {
    type?: string;
    connectedAddress?: string;
    className?: string;
    children?: any;
}

export function LoginWalletButton({ type = 'button', className = '', children, }: LoginWalletButtonProps) {
    const { authenticated, logout, user, ready } = usePrivy();
    const { login } = useLogin();
    const [isLoading, setIsLoading] = useState(false);

    const connectedAddress = user?.wallet?.address;

    // Format address for display
    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    // Handle connect/disconnect
    const handleConnectWallet = async () => {
        try {
            setIsLoading(true);
            if (authenticated) {
                await logout();
            } else {
                await login({ loginMethods: ['wallet'] });
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!ready) {
        return null; // or a loading spinner
    }

    return type === 'button' ? (
        <Button
            onClick={handleConnectWallet}
            disabled={isLoading}
            className={`px-4 py-2 rounded font-medium transition-colors ${
                authenticated 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            } ${className}`}
        >
            {isLoading ? 'Loading...' : authenticated && connectedAddress
                ? `Disconnect (${formatAddress(connectedAddress)})`
                : 'Connect Wallet'
            }
        </Button>
    ): (
        <div onClick={handleConnectWallet}>
            {children}
        </div>
    )
}
