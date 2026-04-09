import { TrendingDown, Sparkles } from "lucide-react";
import { formatDOP, type FeeConfig, DEFAULT_FEE_CONFIG, calculateFee } from "@/lib/advance-calculator";

interface SavingsComparisonProps {
  requestedAmount: number;
  monthlySalary?: number;
  feeConfig?: FeeConfig;
}

const STREET_LOAN_RATE = 0.20;

export function SavingsComparison({ 
  requestedAmount, 
  monthlySalary = 45000,
  feeConfig = DEFAULT_FEE_CONFIG 
}: SavingsComparisonProps) {
  const streetLoanFee = Math.floor(requestedAmount * STREET_LOAN_RATE);
  const ourFee = calculateFee(requestedAmount, monthlySalary, feeConfig);
  const savings = streetLoanFee - ourFee;

  if (savings <= 0) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent">
      <div className="flex items-center gap-1 text-primary">
        <TrendingDown className="w-4 h-4" />
        <Sparkles className="w-3 h-3" />
      </div>
      <span className="text-sm font-medium text-foreground">
        Te ahorras <span className="font-bold text-primary">{formatDOP(savings)}</span> vs. Alternativa informal
      </span>
    </div>
  );
}
