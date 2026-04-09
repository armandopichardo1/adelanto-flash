
-- Create risk_config table (generic + per-company overrides)
CREATE TABLE public.risk_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id TEXT DEFAULT NULL,
  safety_cap NUMERIC NOT NULL DEFAULT 0.50,
  max_salary_deduction_rate NUMERIC NOT NULL DEFAULT 0.30,
  tenure_under_1yr NUMERIC NOT NULL DEFAULT 0.20,
  tenure_1_to_3yr NUMERIC NOT NULL DEFAULT 0.50,
  tenure_over_3yr NUMERIC NOT NULL DEFAULT 0.80,
  max_advance_per_employer NUMERIC NOT NULL DEFAULT 0.15,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Enable RLS
ALTER TABLE public.risk_config ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Risk config is readable by everyone"
ON public.risk_config FOR SELECT TO public
USING (true);

CREATE POLICY "Authenticated users can insert risk config"
ON public.risk_config FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update risk config"
ON public.risk_config FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete risk config"
ON public.risk_config FOR DELETE TO authenticated
USING (true);

-- Insert default generic config
INSERT INTO public.risk_config (company_id, safety_cap, max_salary_deduction_rate, tenure_under_1yr, tenure_1_to_3yr, tenure_over_3yr, max_advance_per_employer)
VALUES (NULL, 0.50, 0.30, 0.20, 0.50, 0.80, 0.15);
