-- Fix overly permissive RLS policies on reports table
-- Drop existing policies that allow any authenticated user to modify any report
DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can update reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can delete reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can view all reports" ON public.reports;

-- Create new admin-only policies for reports
-- Admins can create reports
CREATE POLICY "Admins can create reports" 
ON public.reports 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update reports
CREATE POLICY "Admins can update reports" 
ON public.reports 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete reports
CREATE POLICY "Admins can delete reports" 
ON public.reports 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all reports (including drafts)
CREATE POLICY "Admins can view all reports" 
ON public.reports 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));