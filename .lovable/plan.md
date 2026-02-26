
# Generate Plain-Text Sitemap for Google Search Console

## What This Does
Creates a new backend function that outputs a plain-text sitemap (one URL per line) -- the format Google Search Console accepts when you submit a sitemap URL. It also adds a button in the admin dashboard so you can easily copy the sitemap link.

## How It Works

### 1. New Edge Function: `sitemap-txt`
A new backend function at `supabase/functions/sitemap-txt/index.ts` that:
- Fetches all published reports, categories, and static pages (reusing the same logic as the existing XML sitemap function)
- Returns a plain text response with `Content-Type: text/plain`
- One URL per line, no XML -- just clean URLs like:
```text
https://macrofinancereport.com/
https://macrofinancereport.com/reports
https://macrofinancereport.com/report/some-slug
...
```
- The URL to submit in Google Search Console will be:
  `https://cqivqqhshxetmecpzcsr.supabase.co/functions/v1/sitemap-txt`

### 2. Admin Dashboard: Sitemap Link Card
Add a small card/section on the admin Dashboard page (`src/pages/admin/Dashboard.tsx`) that:
- Shows the sitemap.txt URL ready to copy
- Has a "Copy Link" button that copies the URL to clipboard
- Includes a brief instruction: "Paste this URL in Google Search Console under Sitemaps"

### 3. Config Update
Add the new function to `supabase/config.toml` with `verify_jwt = false` (public access needed for Google's crawler).

## Technical Details

### Files to Create
- `supabase/functions/sitemap-txt/index.ts` -- plain text sitemap endpoint

### Files to Modify
- `src/pages/admin/Dashboard.tsx` -- add sitemap URL copy card
- `supabase/config.toml` -- register new function

### Edge Function Logic
```
Static pages: /, /reports, /about, /contact, /disclaimer, /privacy, /terms
+ All published report URLs: /report/{slug}
+ All category URLs: /reports?category={slug}
```
Output is plain text, one URL per line. Uses service role key to fetch all published reports (handles 1000+ row limit by paginating if needed).
