// Adelanto Ya - Advance Calculator based on DR Labor Code
// Risk & Advance Limits Implementation
// Internal only — NEVER expose "cesantía" or "collateral" to users (Art. 86 Labor Code)

export type RiskMode = 'conservative' | 'aggressive';

// Fee configuration — controlled from Admin Dashboard
export interface FeeConfig {
  mode: 'flat' | 'percentage' | 'tiered';
  flatAmount: number;       // Default: 200 (RD$)
  percentageRate: number;   // Default: 0.03 (3%) — only used if mode='percentage'
  tiers: Array<{            // Only used if mode='tiered'
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

export interface RiskConfig {
  safetyCap: number;              // Default: 0.50 (50% of one pay period net)
  maxSalaryDeductionRate: number; // Default: 0.30 (Art. 201 — 30%)
  tenureRiskCaps: {
    under1Year: number;   // Default: 0.20
    years1to3: number;    // Default: 0.50
    over3Years: number;   // Default: 0.80
  };
  maxAdvancePerEmployer: number;  // Default: 0.15 (15% portfolio concentration)
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  safetyCap: 0.50,
  maxSalaryDeductionRate: 0.30,
  tenureRiskCaps: { under1Year: 0.20, years1to3: 0.50, over3Years: 0.80 },
  maxAdvancePerEmployer: 0.15,
};

export interface AdvanceCalculationResult {
  maxAdvanceAmount: number;
  collateralBase: number; // Internal only — NEVER expose "cesantía" or "collateral" to users (Art. 86 Labor Code)
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

/**
 * Calculate fee based on config
 */
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

/**
 * Get fee display label
 */
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
export function getRiskMultiplier(tenureYears: number, riskConfig: RiskConfig = DEFAULT_RISK_CONFIG): number {
  if (tenureYears < 1) return riskConfig.tenureRiskCaps.under1Year;
  if (tenureYears <= 3) return riskConfig.tenureRiskCaps.years1to3;
  return riskConfig.tenureRiskCaps.over3Years;
}

/**
 * Calculate daily salary from monthly
 */
export function getDailySalary(monthlySalary: number): number {
  return monthlySalary / 23.83; // Average working days per month in DR
}

/**
 * Calculate base collateral (internal — Art. 86 prohibits exposing as cesantía)
 * Based on DR Labor Code
 */
export function calculateBaseCollateral(
  monthlySalary: number,
  tenureYears: number,
  riskMode: RiskMode
): number {
  const dailySalary = getDailySalary(monthlySalary);
  
  // Internal: 21 days per year of service
  const cesantia = dailySalary * 21 * tenureYears;
  
  if (riskMode === 'conservative') {
    return cesantia;
  }
  
  // Aggressive mode includes Preaviso (28 days)
  const preaviso = dailySalary * 28;
  return cesantia + preaviso;
}

/**
 * Main advance limit calculation
 * 5-cap risk hierarchy (enforced in this exact order):
 * 1. Legal Hard Cap: Art. 201 — never exceed maxSalaryDeductionRate of net salary
 * 2. Safety Cap: never exceed safetyCap of one pay period net salary
 * 3. Earned Wages Cap: never exceed wages actually earned in current cycle
 * 4. Tenure Risk Cap: collateral base × tenure risk multiplier
 * 5. Outstanding Balance: subtract any active advance amount
 */
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
  
  // 1. Legal Hard Cap (Art. 201 — 30% of net salary)
  const legalHardCap = monthlySalary * riskConfig.maxSalaryDeductionRate;
  
  // 2. Safety Cap (50% of one pay period net)
  const safetyCapLimit = monthlySalary * riskConfig.safetyCap;
  
  // 3. Earned Wages Cap (if days data available)
  const earnedWagesCap = (daysWorkedInCycle !== undefined && daysInCycle !== undefined && daysInCycle > 0)
    ? (daysWorkedInCycle / daysInCycle) * monthlySalary
    : Infinity;
  
  // 4. Tenure Risk Cap: collateral base × risk multiplier
  const collateralBase = calculateBaseCollateral(monthlySalary, tenureYears, riskMode);
  const riskMultiplier = getRiskMultiplier(tenureYears, riskConfig);
  const tenureRiskCap = collateralBase * riskMultiplier;
  
  // Take the minimum of all caps
  const caps = [
    { value: legalHardCap, name: 'salary_cap' as const },
    { value: safetyCapLimit, name: 'safety_cap' as const },
    { value: earnedWagesCap, name: 'salary_cap' as const },
    { value: tenureRiskCap, name: 'collateral' as const },
  ];
  
  const binding = caps.reduce((min, cap) => cap.value < min.value ? cap : min, caps[0]);
  
  // 5. Subtract outstanding balance
  const maxAdvanceAmount = Math.max(0, Math.floor(binding.value) - outstandingBalance);
  
  // Calculate fee
  const fee = calculateFee(maxAdvanceAmount, monthlySalary, feeConfig);
  const totalToDeduct = maxAdvanceAmount + fee;
  
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

/**
 * Calculate advance details for a specific requested amount
 */
export function calculateAdvanceDetails(
  requestedAmount: number, 
  monthlySalary: number = 45000,
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
