// Smart Refill (Retiros Flexibles) Logic
// Allows users to "top up" their advance if they haven't reached their limit

import { calculateAdvanceDetails, type FeeConfig, DEFAULT_FEE_CONFIG } from "./advance-calculator";

export interface ActiveAdvance {
  id: string;
  amount: number;
  fee: number;
  totalToDeduct: number;
  disbursedDate: string;
  status: 'active' | 'paid';
}

export interface SmartRefillResult {
  canRefill: boolean;
  currentlyUsed: number;
  maxLimit: number;
  remainingAvailable: number;
  buttonLabel: 'Solicitar' | 'Recargar';
}

/**
 * Check if user can do a "Smart Refill" (top-up)
 */
export function checkSmartRefill(
  activeAdvance: ActiveAdvance | null,
  maxAdvanceLimit: number
): SmartRefillResult {
  // No active advance - full limit available
  if (!activeAdvance || activeAdvance.status === 'paid') {
    return {
      canRefill: false,
      currentlyUsed: 0,
      maxLimit: maxAdvanceLimit,
      remainingAvailable: maxAdvanceLimit,
      buttonLabel: 'Solicitar',
    };
  }

  // Has active advance - check remaining
  const currentlyUsed = activeAdvance.amount;
  const remainingAvailable = maxAdvanceLimit - currentlyUsed;

  return {
    canRefill: remainingAvailable > 0,
    currentlyUsed,
    maxLimit: maxAdvanceLimit,
    remainingAvailable: Math.max(0, remainingAvailable),
    buttonLabel: remainingAvailable > 0 ? 'Recargar' : 'Solicitar',
  };
}

/**
 * Calculate fee for incremental refill amount
 * Fee is ONLY applied to the new incremental amount, not the total
 */
export function calculateRefillDetails(
  incrementalAmount: number,
  monthlySalary: number = 45000,
  feeConfig: FeeConfig = DEFAULT_FEE_CONFIG
): {
  incrementalAmount: number;
  incrementalFee: number;
  incrementalTotalToDeduct: number;
} {
  const details = calculateAdvanceDetails(incrementalAmount, monthlySalary, feeConfig);
  return {
    incrementalAmount,
    incrementalFee: details.fee,
    incrementalTotalToDeduct: details.totalToDeduct,
  };
}

/**
 * Format the refill status message
 */
export function getRefillStatusMessage(refillResult: SmartRefillResult): string {
  if (!refillResult.canRefill) {
    return "Límite disponible para nuevo adelanto";
  }
  return `Ya tienes RD$${refillResult.currentlyUsed.toLocaleString()} activo. Puedes recargar hasta RD$${refillResult.remainingAvailable.toLocaleString()} más.`;
}
