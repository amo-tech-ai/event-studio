-- Backfill profiles for existing auth users
-- Run this in Supabase SQL Editor after seeding auth users

-- Insert profiles for any auth.users that don't have profiles yet
INSERT INTO public.profiles (id, email, full_name, company, phone)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as full_name,
  au.raw_user_meta_data->>'company' as company,
  au.raw_user_meta_data->>'phone' as phone
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Verify profiles were created
SELECT
  p.id,
  p.email,
  p.full_name,
  p.company,
  p.phone,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
