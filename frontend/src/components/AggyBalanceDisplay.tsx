
interface AggyBalanceProps {
    balance: number;
  }

export default function AggyBalanceDisplay({ balance }: AggyBalanceProps) {
    return (
        <div className="border border-gray-300 rounded-md p-2 flex items-center">
          <span className="text-sm font-mono">Balance: {balance.toFixed(2)} AGGY</span>
        </div>
      );
}
