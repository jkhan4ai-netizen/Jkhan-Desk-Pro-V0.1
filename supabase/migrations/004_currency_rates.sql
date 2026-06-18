-- Add custom currency rates to settings table
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS custom_usd_rate NUMERIC,
ADD COLUMN IF NOT EXISTS custom_rub_rate NUMERIC;
