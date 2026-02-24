
-- Change default status to 'approved' so stalls are immediately visible to everyone
ALTER TABLE public.tea_stalls ALTER COLUMN status SET DEFAULT 'approved';

-- Update RLS: allow anyone to view all stalls (not just approved ones)
DROP POLICY IF EXISTS "Anyone can view approved stalls" ON public.tea_stalls;
CREATE POLICY "Anyone can view all stalls"
ON public.tea_stalls FOR SELECT
USING (true);
