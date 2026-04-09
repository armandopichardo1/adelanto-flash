// Risk Configuration — Types & Defaults
// Extracted from advance-calculator.ts for modularity

export interface RiskConfig {
  safetyCap: number;
  maxSalaryDeductionRate: number;
  tenureRiskCaps: {
    under1Year: number;
    years1to3: number;
    over3Years: number;
  };
  maxAdvancePerEmployer: number;
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  safetyCap: 0.50,
  maxSalaryDeductionRate: 0.30,
  tenureRiskCaps: { under1Year: 0.20, years1to3: 0.50, over3Years: 0.80 },
  maxAdvancePerEmployer: 0.15,
};

export function getRiskMultiplier(tenureYears: number, riskConfig: RiskConfig = DEFAULT_RISK_CONFIG): number {
  if (tenureYears < 1) return riskConfig.tenureRiskCaps.under1Year;
  if (tenureYears <= 3) return riskConfig.tenureRiskCaps.years1to3;
  return riskConfig.tenureRiskCaps.over3Years;
}

export function getTenureLevel(tenureYears: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (tenureYears < 1) return 'bronze';
  if (tenureYears < 2) return 'silver';
  if (tenureYears < 3) return 'gold';
  return 'platinum';
}
