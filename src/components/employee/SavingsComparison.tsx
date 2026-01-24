import { TrendingDown, Sparkles } from "lucide-react";
import { formatDOP } from "@/lib/loan-calculator";

interface SavingsComparisonProps {
  requestedAmount: number;
}

// Street loan rate (typical informal lending in DR)
const STREET_LOAN_RATE = 0.20; // 20%
// Our service fee
const SERVICE_FEE_RATE = 0.07; // 7%

export function SavingsComparison({ requestedAmount }: SavingsComparisonProps) {
  const streetLoanFee = Math.floor(requestedAmount * STREET_LOAN_RATE);
  const ourFee = Math.floor(requestedAmount * SERVICE_FEE_RATE);
  const savings = streetLoanFee - ourFee;

  if (savings <= 0) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
      <div className="flex items-center gap-1 text-primary">
        <TrendingDown className="w-4 h-4" />
        <Sparkles className="w-3 h-3" />
      </div>
      <span className="text-sm font-medium text-foreground">
        Te ahorras <span className="font-bold text-primary">{formatDOP(savings)}</span> vs. Préstamo informal
      </span>
    </div>
  );
}
