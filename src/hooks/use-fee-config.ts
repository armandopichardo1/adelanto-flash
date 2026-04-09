import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type FeeConfig, DEFAULT_FEE_CONFIG } from "@/lib/fee-config";

const FEE_CONFIG_ID = "00000000-0000-0000-0000-000000000001";

export function useFeeConfig(): FeeConfig {
  const { data } = useQuery({
    queryKey: ["fee-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_config")
        .select("*")
        .eq("id", FEE_CONFIG_ID)
        .single();
      if (error || !data) return DEFAULT_FEE_CONFIG;
      return {
        mode: data.mode as FeeConfig["mode"],
        flatAmount: Number(data.flat_amount),
        percentageRate: Number(data.percentage_rate),
        tiers: (data.tiers as unknown as Array<{ maxSalary: number; fee: number }>).map((t) => ({
          ...t,
          maxSalary: t.maxSalary >= 999999999 ? Infinity : t.maxSalary,
        })),
      } satisfies FeeConfig;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  return data ?? DEFAULT_FEE_CONFIG;
}
