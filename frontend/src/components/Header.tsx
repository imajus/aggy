import { LoginWalletButton } from "@/components/LoginWalletButton";
import EmbeddedWalletDisplay from "./EmbeddedWalletDisplay";
import AggyBalanceDisplay from "./AggyBalanceDisplay";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-background-paper p-4 shadow-sm">
      <div className="font-bold text-lg text-primary-main">Aggy Logo</div>
      <div className="flex items-center space-x-4">
        <LoginWalletButton />
        <EmbeddedWalletDisplay />
        <AggyBalanceDisplay balance={123.45} />
      </div>
    </header>
  );
} 