import { LoginWalletButton } from "@/components/LoginWalletButton";

export default function LandingPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#2D3748]">Welcome to Aggy</h1>
      <div className="space-y-4">
        <p className="text-lg text-[#2D3748]">
          Aggy is a decentralized platform for hiring and freelancing services,
          powered by Ethereum and USDC.
        </p>
        <p className="text-[#4A5568]">
          Get started by connecting your wallet and{" "}
          <span className="text-[#2B6CB0] font-medium">submitting a job request</span>{" "}
          or exploring the{" "}
          <span className="text-[#2B6CB0] font-medium">task board</span>.
        </p>
        <LoginWalletButton />
      </div>
    </div>
  );
}
