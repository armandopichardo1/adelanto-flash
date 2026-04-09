// Adelanto Ya - Advance Calculator based on DR Labor Code
// Risk & Advance Limits Implementation
// Internal only — NEVER expose "cesantía" or "collateral" to users (Art. 86 Labor Code)

// Re-export from split modules for backward compatibility
export { type FeeConfig, type FeeMode, DEFAULT_FEE_CONFIG, calculateFee, getFeeLabel } from './fee-config';
export { type RiskConfig, DEFAULT_RISK_CONFIG, getRiskMultiplier, getTenureLevel } from './risk-config';

import { type FeeConfig, DEFAULT_FEE_CONFIG, calculateFee } from './fee-config';
import { type RiskConfig, DEFAULT_RISK_CONFIG, getRiskMultiplier } from './risk-config';
import { getTenureLevel } from './risk-config';

export type RiskMode = 'conservative' | 'aggressive';

export interface AdvanceCalculationResult {
  maxAdvanceAmount: number;
  collateralBase: number;
  riskMultiplier: number;
  salaryCapLimit: number;
  safetyCapLimit: number;
  appliedLimit: 'collateral' | 'salary_cap' | 'safety_cap';
  tenureLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  fee: number;
  totalToDeduct: number;
  netDisbursement: number;
}

export interface EmployeeData {
  monthlySalary: number;
  tenureYears: number;
  riskMode: RiskMode;
  feeConfig?: FeeConfig;
  riskConfig?: RiskConfig;
  outstandingBalance?: number;
  daysWorkedInCycle?: number;
  daysInCycle?: number;
}

export function getDailySalary(monthlySalary: number): number {
  return monthlySalary / 23.83;
}

export function calculateBaseCollateral(
  monthlySalary: number,
  tenureYears: number,
  riskMode: RiskMode
): number {
  const dailySalary = getDailySalary(monthlySalary);
  const cesantia = dailySalary * 21 * tenureYears;
  if (riskMode === 'conservative') return cesantia;
  const preaviso = dailySalary * 28;
  return cesantia + preaviso;
}

export function calculateAdvanceLimit(employee: EmployeeData): AdvanceCalculationResult {
  const {
    monthlySalary,
    tenureYears,
    riskMode,
    feeConfig = DEFAULT_FEE_CONFIG,
    riskConfig = DEFAULT_RISK_CONFIG,
    outstandingBalance = 0,
    daysWorkedInCycle,
    daysInCycle,
  } = employee;

  const legalHardCap = monthlySalary * riskConfig.maxSalaryDeductionRate;
  const safetyCapLimit = monthlySalary * riskConfig.safetyCap;
  const earnedWagesCap = (daysWorkedInCycle !== undefined && daysInCycle !== undefined && daysInCycle > 0)
    ? (daysWorkedInCycle / daysInCycle) * monthlySalary
    : Infinity;

  const collateralBase = calculateBaseCollateral(monthlySalary, tenureYears, riskMode);
  const riskMultiplier = getRiskMultiplier(tenureYears, riskConfig);
  const tenureRiskCap = collateralBase * riskMultiplier;

  const caps = [
    { value: legalHardCap, name: 'salary_cap' as const },
    { value: safetyCapLimit, name: 'safety_cap' as const },
    { value: earnedWagesCap, name: 'salary_cap' as const },
    { value: tenureRiskCap, name: 'collateral' as const },
  ];

  const binding = caps.reduce((min, cap) => cap.value < min.value ? cap : min, caps[0]);
  const maxAdvanceAmount = Math.max(0, Math.floor(binding.value) - outstandingBalance);

  const fee = calculateFee(maxAdvanceAmount, monthlySalary, feeConfig);
  const totalToDeduct = maxAdvanceAmount + fee;

  const tenLevel = getTenureLevel(tenureYears);
  return {
    maxAdvanceAmount,
    collateralBase: Math.floor(collateralBase),
    riskMultiplier,
    salaryCapLimit: Math.floor(legalHardCap),
    safetyCapLimit: Math.floor(safetyCapLimit),
    appliedLimit: binding.name,
    tenureLevel: getTenureLevel(tenureYears),
    fee,
    totalToDeduct,
    netDisbursement: maxAdvanceAmount,
  };
}

export function calculateAdvanceDetails(
  requestedAmount: number,
  monthlySalary: number = 28500,
  feeConfig: FeeConfig = DEFAULT_FEE_CONFIG
): {
  fee: number;
  totalToDeduct: number;
  netDisbursement: number;
} {
  const fee = calculateFee(requestedAmount, monthlySalary, feeConfig);
  return {
    fee,
    totalToDeduct: requestedAmount + fee,
    netDisbursement: requestedAmount,
  };
}

export function formatDOP(amount: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('DOP', 'RD$');
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
