import { TrendingUp } from "lucide-react";
import { calculateDineroScore, getScoreLevel } from "@/lib/dinero-score";

interface DineroScoreGaugeProps {
  tenureYears: number;
  repaidCycles: number;
}

export function DineroScoreGauge({ tenureYears, repaidCycles }: DineroScoreGaugeProps) {
  const score = calculateDineroScore(tenureYears, repaidCycles);
  const scoreLevel = getScoreLevel(score);
  const percentage = (score / 1000) * 100;
  
  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-headline font-semibold text-foreground">Dinero Score</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${scoreLevel.color} ${scoreLevel.bgColor}`}>
          {scoreLevel.label}
        </span>
      </div>

      <div className="relative flex flex-col items-center">
        <svg viewBox="0 0 200 110" className="w-full max-w-[200px]">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--surface-container))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
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
        
        <div className="absolute bottom-0 text-center">
          <p className="font-headline text-4xl font-bold text-foreground tabular-nums">{score}</p>
          <p className="text-sm text-muted-foreground">de 1,000</p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-surface-container-low rounded-2xl p-3 text-center">
          <p className="text-muted-foreground">Por Antigüedad</p>
          <p className="font-semibold text-foreground">+{Math.floor(tenureYears) * 50} pts</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-3 text-center">
          <p className="text-muted-foreground">Por Pagos</p>
          <p className="font-semibold text-foreground">+{repaidCycles * 10} pts</p>
        </div>
      </div>
    </div>
  );
}
