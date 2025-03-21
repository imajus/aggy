import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/Button";


interface LoginWalletButtonProps {
    type?: string;
    connectedAddress?: string;
    className?: string;
    children?: any;
}

export function LoginWalletButton({ type = 'button', className = '', children, }: LoginWalletButtonProps) {
    const { authenticated, logout, user } = usePrivy();
    const { login } = useLogin();

    const connectedAddress = user?.wallet?.address;

    // Format address for display
    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    // Handle connect/disconnect
    const handleConnectWallet = async () => {
        if (authenticated) {
            await logout();
            // Navigate to the onboarding page
        } else {
            await login({ loginMethods: ['wallet'] });
        }
    };

    return type === 'button' ? (
        <Button
            onClick={handleConnectWallet}
            className={`px-4 py-2 rounded font-medium transition-colors ${
                authenticated 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            } ${className}`}
        >
            {authenticated && connectedAddress
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
