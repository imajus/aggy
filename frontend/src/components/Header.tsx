import { LoginWalletButton } from "@/components/LoginWalletButton";
import AggyBalanceDisplay from "./AggyBalanceDisplay";
import EmbeddedWalletDisplay from "./EmbeddedWalletDisplay";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-background-paper p-4 shadow-sm">
      <div className="font-bold text-lg text-primary-main">Aggy Logo</div>
      <div className="flex items-center space-x-4">
        <LoginWalletButton />
        <EmbeddedWalletDisplay />
        <AggyBalanceDisplay/>
      </div>
    </header>
  );
} 