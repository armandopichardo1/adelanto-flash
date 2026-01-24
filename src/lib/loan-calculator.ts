// Dinero Ya - Loan Calculator based on DR Labor Code
// Risk & Loan Limits Implementation

export type RiskMode = 'conservative' | 'aggressive';

export interface LoanCalculationResult {
  maxLoanAmount: number;
  collateralBase: number;
  riskMultiplier: number;
  salaryCapLimit: number;
  appliedLimit: 'collateral' | 'salary_cap';
  tenureLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  fee: number;
  totalDebt: number;
  netDisbursement: number;
}

export interface EmployeeData {
  monthlySalary: number;
  tenureYears: number;
  riskMode: RiskMode;
}

// Service fee rate (7% per 15-day cycle)
const SERVICE_FEE_RATE = 0.07;

// Art. 201 DR Labor Code - Max monthly deduction
const MAX_SALARY_DEDUCTION_RATE = 0.30;

/**
 * Calculate the tenure level for gamification
 */
export function getTenureLevel(tenureYears: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (tenureYears < 1) return 'bronze';
  if (tenureYears < 2) return 'silver';
  if (tenureYears < 3) return 'gold';
  return 'platinum';
}

/**
 * Get risk multiplier based on tenure
 */
export function getRiskMultiplier(tenureYears: number): number {
  if (tenureYears < 1) return 0.20; // 20% for < 1 year
  if (tenureYears <= 3) return 0.50; // 50% for 1-3 years
  return 0.80; // 80% for > 3 years
}

/**
 * Calculate daily salary from monthly
 */
export function getDailySalary(monthlySalary: number): number {
  return monthlySalary / 23.83; // Average working days per month in DR
}

/**
 * Calculate base collateral (Severance/Cesantía)
 * Based on DR Labor Code
 */
export function calculateBaseCollateral(
  monthlySalary: number,
  tenureYears: number,
  riskMode: RiskMode
): number {
  const dailySalary = getDailySalary(monthlySalary);
  
  // Cesantía: 21 days per year of service
  const cesantia = dailySalary * 21 * tenureYears;
  
  if (riskMode === 'conservative') {
    return cesantia;
  }
  
  // Aggressive mode includes Preaviso (28 days)
  const preaviso = dailySalary * 28;
  return cesantia + preaviso;
}

/**
 * Main loan limit calculation
 */
export function calculateLoanLimit(employee: EmployeeData): LoanCalculationResult {
  const { monthlySalary, tenureYears, riskMode } = employee;
  
  // 1. Calculate base collateral
  const collateralBase = calculateBaseCollateral(monthlySalary, tenureYears, riskMode);
  
  // 2. Apply risk multiplier
  const riskMultiplier = getRiskMultiplier(tenureYears);
  const collateralLimit = collateralBase * riskMultiplier;
  
  // 3. Calculate salary cap (Art. 201 - 30% max)
  const salaryCapLimit = monthlySalary * MAX_SALARY_DEDUCTION_RATE;
  
  // 4. Take the lower of the two limits
  const maxLoanAmount = Math.min(collateralLimit, salaryCapLimit);
  const appliedLimit = collateralLimit <= salaryCapLimit ? 'collateral' : 'salary_cap';
  
  // 5. Calculate fee and total debt
  const fee = maxLoanAmount * SERVICE_FEE_RATE;
  const totalDebt = maxLoanAmount + fee;
  
  return {
    maxLoanAmount: Math.floor(maxLoanAmount),
    collateralBase: Math.floor(collateralBase),
    riskMultiplier,
    salaryCapLimit: Math.floor(salaryCapLimit),
    appliedLimit,
    tenureLevel: getTenureLevel(tenureYears),
    fee: Math.floor(fee),
    totalDebt: Math.floor(totalDebt),
    netDisbursement: Math.floor(maxLoanAmount),
  };
}

/**
 * Calculate loan details for a specific requested amount
 */
export function calculateLoanDetails(requestedAmount: number): {
  fee: number;
  totalDebt: number;
  netDisbursement: number;
} {
  const fee = Math.floor(requestedAmount * SERVICE_FEE_RATE);
  return {
    fee,
    totalDebt: requestedAmount + fee,
    netDisbursement: requestedAmount,
  };
}

/**
 * Format currency for Dominican Peso
 */
export function formatDOP(amount: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('DOP', 'RD$');
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
