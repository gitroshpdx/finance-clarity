CREATE TABLE public.auto_publish_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_id uuid,
  cost_amount numeric NOT NULL DEFAULT 8,
  feature_used text NOT NULL DEFAULT 'auto_publish',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.auto_publish_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON public.auto_publish_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert usage"
  ON public.auto_publish_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);