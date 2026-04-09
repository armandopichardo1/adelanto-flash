
-- Create fee_config table (singleton pattern)
CREATE TABLE public.fee_config (
  id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid PRIMARY KEY,
  mode TEXT NOT NULL DEFAULT 'flat' CHECK (mode IN ('flat', 'percentage', 'tiered')),
  flat_amount NUMERIC NOT NULL DEFAULT 200,
  percentage_rate NUMERIC NOT NULL DEFAULT 0.03,
  tiers JSONB NOT NULL DEFAULT '[{"maxSalary": 25000, "fee": 150}, {"maxSalary": 50000, "fee": 200}, {"maxSalary": 100000, "fee": 300}, {"maxSalary": 999999999, "fee": 400}]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

-- Enable RLS
ALTER TABLE public.fee_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read the fee config (needed for calculators)
CREATE POLICY "Fee config is readable by everyone"
ON public.fee_config
FOR SELECT
USING (true);

-- Only authenticated users can update (admin role enforcement comes later)
CREATE POLICY "Authenticated users can update fee config"
ON public.fee_config
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert the default row
INSERT INTO public.fee_config (id) VALUES ('00000000-0000-0000-0000-000000000001'::uuid);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_fee_config_updated_at
BEFORE UPDATE ON public.fee_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
