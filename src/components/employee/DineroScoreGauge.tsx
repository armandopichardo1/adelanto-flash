import { TrendingUp } from "lucide-react";

interface DineroScoreGaugeProps {
  tenureYears: number;
  repaidCycles: number;
}

/**
 * Dinero Score Logic:
 * Base 500 + (10 pts per repaid cycle) + (50 pts per year of tenure)
 * Range: 0-1000
 */
export function calculateDineroScore(tenureYears: number, repaidCycles: number): number {
  const base = 500;
  const tenureBonus = Math.floor(tenureYears) * 50;
  const cycleBonus = repaidCycles * 10;
  return Math.min(1000, Math.max(0, base + tenureBonus + cycleBonus));
}

export function getScoreLevel(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 800) return { label: "Excelente", color: "text-primary", bgColor: "bg-primary/20" };
  if (score >= 650) return { label: "Muy Bueno", color: "text-emerald-600", bgColor: "bg-emerald-100" };
  if (score >= 550) return { label: "Bueno", color: "text-blue-600", bgColor: "bg-blue-100" };
  return { label: "En Construcción", color: "text-amber-600", bgColor: "bg-amber-100" };
}

export function DineroScoreGauge({ tenureYears, repaidCycles }: DineroScoreGaugeProps) {
  const score = calculateDineroScore(tenureYears, repaidCycles);
  const scoreLevel = getScoreLevel(score);
  const percentage = (score / 1000) * 100;
  
  // SVG arc calculations
  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; // Semi-circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-background rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Dinero Score</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${scoreLevel.color} ${scoreLevel.bgColor}`}>
          {scoreLevel.label}
        </span>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Gauge SVG */}
        <svg 
          viewBox="0 0 200 110" 
          className="w-full max-w-[200px]"
        >
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score display - positioned inside gauge */}
        <div className="absolute bottom-0 text-center">
          <p className="text-4xl font-bold text-foreground tabular-nums">{score}</p>
          <p className="text-sm text-muted-foreground">de 1,000</p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-muted-foreground">Por Antigüedad</p>
          <p className="font-semibold text-foreground">+{Math.floor(tenureYears) * 50} pts</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-muted-foreground">Por Pagos</p>
          <p className="font-semibold text-foreground">+{repaidCycles * 10} pts</p>
        </div>
      </div>
    </div>
  );
}
