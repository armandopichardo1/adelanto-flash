import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type RiskConfig, DEFAULT_RISK_CONFIG } from "@/lib/risk-config";

function rowToRiskConfig(row: {
  safety_cap: number;
  max_salary_deduction_rate: number;
  tenure_under_1yr: number;
  tenure_1_to_3yr: number;
  tenure_over_3yr: number;
  max_advance_per_employer: number;
}): RiskConfig {
  return {
    safetyCap: Number(row.safety_cap),
    maxSalaryDeductionRate: Number(row.max_salary_deduction_rate),
    tenureRiskCaps: {
      under1Year: Number(row.tenure_under_1yr),
      years1to3: Number(row.tenure_1_to_3yr),
      over3Years: Number(row.tenure_over_3yr),
    },
    maxAdvancePerEmployer: Number(row.max_advance_per_employer),
  };
}

export function useRiskConfig(companyId?: string): RiskConfig {
  const { data } = useQuery({
    queryKey: ["risk-config", companyId ?? "global"],
    queryFn: async () => {
      // Try company-specific first, then fall back to global
      if (companyId) {
        const { data: companyData } = await supabase
          .from("risk_config")
          .select("*")
          .eq("company_id", companyId)
          .maybeSingle();
        if (companyData) return rowToRiskConfig(companyData);
      }
      // Global config (company_id IS NULL)
      const { data: globalData } = await supabase
        .from("risk_config")
        .select("*")
        .is("company_id", null)
        .single();
      if (globalData) return rowToRiskConfig(globalData);
      return DEFAULT_RISK_CONFIG;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  return data ?? DEFAULT_RISK_CONFIG;
}
