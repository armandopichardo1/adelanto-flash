// Dinero Score — Internal credit scoring for Adelanto Ya

export function calculateDineroScore(tenureYears: number, repaidCycles: number): number {
  const base = 500;
  const tenureBonus = Math.floor(tenureYears) * 50;    // +50 per full year
  const repaymentBonus = repaidCycles * 10;              // +10 per on-time cycle
  return Math.min(1000, base + tenureBonus + repaymentBonus);
}

export function getScoreLevel(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 900) return { label: "Excepcional", color: "text-emerald-500", bgColor: "bg-emerald-100" };
  if (score >= 750) return { label: "Excelente", color: "text-green-500", bgColor: "bg-green-100" };
  if (score >= 600) return { label: "Bueno", color: "text-blue-500", bgColor: "bg-blue-100" };
  if (score >= 450) return { label: "En Construcción", color: "text-amber-500", bgColor: "bg-amber-100" };
  return { label: "Nuevo", color: "text-slate-400", bgColor: "bg-slate-100" };
}
