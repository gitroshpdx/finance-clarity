

# Track Auto-Publish Usage and Outstanding Balance

## Overview
Create a system to track every time an admin uses the Auto-Publish or One-Click Publish feature, charge a cost per usage (7-9 Rs, we'll use 8 Rs as default), and display the outstanding balance on the admin dashboard.

## Changes

### 1. New Database Table: `auto_publish_usage`
Create a table to log each auto-publish action with user, cost, and timestamp.

Columns:
- `id` (uuid, primary key)
- `user_id` (uuid, not null) -- who published
- `report_id` (uuid, nullable) -- linked report
- `cost_amount` (numeric, default 8) -- cost in Rs
- `feature_used` (text) -- "auto_publish" or "one_click_publish"
- `created_at` (timestamptz, default now())

RLS policies:
- Users can view their own usage records
- Admins can insert usage records (needed when publishing)

### 2. Dashboard Update (`src/pages/admin/Dashboard.tsx`)
Add a new card showing:
- Total auto-publish posts by the logged-in user
- Cost per post (8 Rs)
- Total outstanding amount (count x 8)
- A small table/list of recent usage entries

This card will appear prominently at the top of the dashboard with an Indian Rupee icon and amber/orange styling to draw attention.

### 3. Auto-Publish Page Update (`src/pages/admin/AutoPublish.tsx`)
After a successful publish (lines 129 and 177), insert a row into `auto_publish_usage` with `feature_used: 'auto_publish'`.

### 4. One-Click Publish Page Update (`src/pages/admin/OneClickPublish.tsx`)
After a successful publish (line 175), insert a row into `auto_publish_usage` with `feature_used: 'one_click_publish'`.

### 5. Custom Hook: `src/hooks/useAutoPublishUsage.ts`
A hook that fetches the logged-in user's usage records and calculates:
- `totalPosts`: count of records
- `costPerPost`: 8 (constant)
- `outstandingAmount`: totalPosts x 8
- `usageRecords`: recent records for display

Used by the Dashboard component.

## Technical Details

### Migration SQL
```sql
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

CREATE POLICY "Admins can insert usage"
  ON public.auto_publish_usage FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

### Dashboard Card Design
- Amber/orange gradient card with Rupee symbol
- Shows: "X posts via Auto-Publish" and "Outstanding: Rs Y"
- Small breakdown list of recent charges

### Files Modified
1. **New migration** -- create `auto_publish_usage` table
2. **New file**: `src/hooks/useAutoPublishUsage.ts`
3. **Modified**: `src/pages/admin/Dashboard.tsx` -- add outstanding balance card
4. **Modified**: `src/pages/admin/AutoPublish.tsx` -- log usage on publish
5. **Modified**: `src/pages/admin/OneClickPublish.tsx` -- log usage on publish

