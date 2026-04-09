// Fee Configuration — Types & Defaults
// Extracted from advance-calculator.ts for modularity

export type FeeMode = 'flat' | 'percentage' | 'tiered';

export interface FeeConfig {
  mode: FeeMode;
  flatAmount: number;
  percentageRate: number;
  tiers: Array<{
    maxSalary: number;
    fee: number;
  }>;
}

export const DEFAULT_FEE_CONFIG: FeeConfig = {
  mode: 'flat',
  flatAmount: 200,
  percentageRate: 0.03,
  tiers: [
    { maxSalary: 25000, fee: 150 },
    { maxSalary: 50000, fee: 200 },
    { maxSalary: 100000, fee: 300 },
    { maxSalary: Infinity, fee: 400 },
  ],
};

export function calculateFee(amount: number, monthlySalary: number, feeConfig: FeeConfig = DEFAULT_FEE_CONFIG): number {
  switch (feeConfig.mode) {
    case 'flat':
      return feeConfig.flatAmount;
    case 'percentage':
      return Math.floor(amount * feeConfig.percentageRate);
    case 'tiered': {
      const tier = feeConfig.tiers.find(t => monthlySalary <= t.maxSalary);
      return tier ? tier.fee : feeConfig.tiers[feeConfig.tiers.length - 1].fee;
    }
    default:
      return feeConfig.flatAmount;
  }
}

export function getFeeLabel(feeConfig: FeeConfig = DEFAULT_FEE_CONFIG): string {
  switch (feeConfig.mode) {
    case 'flat':
      return `RD$${feeConfig.flatAmount}`;
    case 'percentage':
      return `${(feeConfig.percentageRate * 100).toFixed(0)}%`;
    case 'tiered':
      return 'según salario';
    default:
      return `RD$${feeConfig.flatAmount}`;
  }
}
