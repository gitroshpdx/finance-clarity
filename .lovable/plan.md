

# Update Reports Dropdown and Footer Categories

## Summary

You have **5 Geopolitics reports** and **3 Central Banks reports** that are currently invisible in the navigation because those categories don't exist in your categories table. I'll add them and reorganize the navigation.

---

## Current State

| Location | Categories Shown |
|----------|-----------------|
| Dropdown | Banking, Commodities, Crypto, Economy, Markets, Real Estate, Technology |
| Footer | None (just static links) |

## After Changes

| Location | Categories Shown |
|----------|-----------------|
| Dropdown | Banking, Commodities, Crypto, Economy, Markets, **Geopolitics**, **Central Banks** |
| Footer | Platform section + **Technology**, **Real Estate** |

---

## Changes Required

### 1. Add Missing Categories to Database

Add two new categories so the filtering works correctly:

| Name | Slug |
|------|------|
| Geopolitics | geopolitics |
| Central Banks | central-banks |

### 2. Update Navigation Component

**File: `src/components/Navigation.tsx`**

Filter the categories to only show specific ones in the dropdown:
- Banking
- Commodities  
- Crypto
- Economy
- Markets
- Geopolitics (new)
- Central Banks (new)

Exclude from dropdown: Technology, Real Estate

### 3. Update Footer Component

**File: `src/components/Footer.tsx`**

Add a new "Topics" section with category links:
- Technology
- Real Estate

---

## Technical Implementation

### Navigation Changes

```tsx
// Filter categories for dropdown - exclude Technology and Real Estate
const dropdownCategories = categories?.filter(cat => 
  !['technology', 'real-estate'].includes(cat.slug)
);
```

### Footer Changes

Add a new "Topics" column with links to Technology and Real Estate category pages:

```tsx
{/* Topics */}
<div className="space-y-4">
  <h4 className="font-medium text-foreground">Topics</h4>
  <nav className="flex flex-col gap-3">
    <Link to="/reports?category=technology">Technology</Link>
    <Link to="/reports?category=real-estate">Real Estate</Link>
  </nav>
</div>
```

---

## Files to Modify

| File | Change |
|------|--------|
| Database | Add 2 new categories (Geopolitics, Central Banks) |
| `src/components/Navigation.tsx` | Filter dropdown to exclude Technology & Real Estate |
| `src/components/Footer.tsx` | Add Topics section with Technology & Real Estate links |

---

## Result

- **8 reports** (5 Geopolitics + 3 Central Banks) become discoverable via navigation
- Technology and Real Estate remain accessible via footer
- All category filtering on `/reports` page continues to work correctly

