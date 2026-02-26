

# Sitemap Generator at macrofinancereport.com/sitemap.txt

## What Changes

### 1. Replace the static sitemap copy card with a "Generate Sitemap" button
The current dashboard card just shows a Supabase edge function URL. Instead, we'll add a **"Generate Sitemap"** button that:
- Calls the existing `sitemap-txt` edge function to fetch all current URLs
- Downloads the result as a `sitemap.txt` file to the admin's computer
- Also writes the content to `public/sitemap.txt` so it's served at `macrofinancereport.com/sitemap.txt`

Since `public/sitemap.txt` is a static file served at the root of the domain, Google Search Console can use `macrofinancereport.com/sitemap.txt` directly.

### 2. Create initial `public/sitemap.txt`
Create a starter file with all static pages. The "Generate" button will produce a fresh version with all dynamic report URLs included that the admin can then ask Lovable to update.

### 3. Update Dashboard card
Replace the current sitemap card with:
- The sitemap URL shown as `macrofinancereport.com/sitemap.txt`
- A **"Generate Fresh Sitemap"** button that calls the edge function, fetches all URLs, and triggers a download of the `sitemap.txt` file
- A **"Copy URL"** button for the domain-based sitemap URL
- The admin downloads the fresh file and can ask Lovable to update `public/sitemap.txt`

## Technical Details

### Files to modify
1. **`src/pages/admin/Dashboard.tsx`** -- Replace the sitemap card: add a "Generate & Download" button that calls the edge function and triggers a `.txt` file download. Show `macrofinancereport.com/sitemap.txt` as the URL to submit to Google.

2. **`public/sitemap.txt`** (new) -- Initial static file with all known URLs. Will be regenerated when the admin clicks the button and updates it.

### Flow
1. Admin clicks "Generate Fresh Sitemap"
2. Frontend calls the `sitemap-txt` edge function
3. Gets back plain text with all URLs
4. Triggers browser download of `sitemap.txt`
5. Admin submits `https://macrofinancereport.com/sitemap.txt` to Google Search Console

