

# Grant Super Admin Role to Rishab and Adarsh

## Summary

Insert `super_admin` role entries for the two regular admin users so they can access the Auto-Publish and One-Click Publish features.

## Changes

### Database: Insert super_admin roles

Using the data insert tool, add two rows to `user_roles`:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email IN ('rishabyadav9758@gmail.com', 'thakuradarshchauhan3012@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Update `assign_admin_role()` trigger function

Update the database function so future sign-ups by these emails also get `super_admin` automatically:

```sql
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.email IN (
    'work.roshansingh0@gmail.com',
    'rishabyadav9758@gmail.com',
    'thakuradarshchauhan3012@gmail.com'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
```

## Result

All three admin users will have both `admin` and `super_admin` roles, giving them full access to Auto-Publish and One-Click Publish features. No frontend code changes needed.

