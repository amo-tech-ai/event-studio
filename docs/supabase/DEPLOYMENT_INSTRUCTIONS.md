# 🚀 EventOS Production Deployment Instructions

**Status:** Ready for deployment
**Date:** 2025-10-13
**Migration File:** `supabase/migrations/20251013044316_core_eventos_schema.sql`

---

## ⚠️ DEPLOYMENT BLOCKERS RESOLVED

### Issue: CLI Token Authentication Failed
```
ERROR: Invalid access token format. Must be like `sbp_0102...1920`.
```
**Token provided:** `sbp_81a68c235f81b19ec5d08036bd7297f2c12edc2bd`

### Issue: Direct Database Connection Unreachable
```
ERROR: Network is unreachable
```

### ✅ SOLUTION: Manual Deployment via Supabase Dashboard

Since CLI-based deployment is blocked, use the Supabase Dashboard SQL Editor for manual deployment.

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Access Supabase Dashboard

1. Open your Supabase project dashboard:
   **URL:** https://supabase.com/dashboard/project/asrzdtpyrdgyggqdfwwl

2. Navigate to **SQL Editor** in the left sidebar

### Step 2: Execute Migration

1. Click **"New Query"** button

2. Copy the entire contents of:
   `supabase/migrations/20251013044316_core_eventos_schema.sql`

3. Paste into the SQL Editor

4. Click **"Run"** button (or press `Ctrl/Cmd + Enter`)

5. Wait for execution to complete (~5-10 seconds)

6. Verify success message appears

### Step 3: Verify Deployment

Run these verification queries in the SQL Editor:

#### Verify Tables Created
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```
**Expected:** 6 tables (attendees, events, orders, profiles, tickets, venues)

#### Verify RLS Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```
**Expected:** All tables show `rowsecurity = true`

#### Verify Functions Exist
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```
**Expected:** 5 functions (generate_event_slug, generate_order_number, generate_ticket_codes, handle_updated_at, update_tickets_sold)

#### Verify Triggers Active
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```
**Expected:** 10 triggers across 6 tables

---

## 👥 SEED AUTH USERS (After Migration)

### Why This Step Is Separate

Auth users are managed by **Supabase GoTrue** (REST API), not PostgreSQL.
You **cannot** use SQL to create users - must use the Admin API.

### Prerequisites

1. Install Supabase client:
```bash
npm install @supabase/supabase-js
```

2. Add to `.env`:
```env
SUPABASE_URL=https://asrzdtpyrdgyggqdfwwl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**Get Service Role Key:**
1. Go to Project Settings → API
2. Copy "service_role" key (secret)
3. ⚠️ **Never commit this key to git**

### Seeding Script

Create `scripts/seed-auth-users.mjs`:

```javascript
import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const users = [
  { email: 'sofia.martinez@toronto-events.local', name: 'Sofía Martínez', company: 'Toronto Tech Summit' },
  { email: 'carlos.lopez@toronto-events.local', name: 'Carlos López', company: 'Innovation Network' },
  { email: 'ana.rodriguez@toronto-events.local', name: 'Ana Rodríguez', company: 'Business Connect TO' },
  { email: 'diego.sanchez@toronto-events.local', name: 'Diego Sánchez', company: 'Startup Hub Toronto' },
  { email: 'maria.garcia@toronto-events.local', name: 'María García', company: 'Professional Events Co' },
]

async function main() {
  console.log('👤 Seeding auth users via Admin API...\n')

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: 'EventOS2025!',
      email_confirm: true, // Bypasses email confirmation
      user_metadata: {
        full_name: u.name,
        company: u.company
      },
    })

    if (error) {
      // 422 = already exists; treat as ok for idempotent seeds
      if (error.status === 422) {
        console.log(`↺ User already exists: ${u.email}`)
        continue
      }
      console.error(`❌ Failed for ${u.email}:`, error.message)
      process.exit(1)
    }
    console.log(`✅ Created: ${u.email}`)
    console.log(`   - ID: ${data.user.id}`)
    console.log(`   - Name: ${u.name}`)
    console.log(`   - Company: ${u.company}\n`)
  }

  console.log('✅ All users seeded successfully!\n')
}

main().catch((e) => {
  console.error('❌ Seed error:', e)
  process.exit(1)
})
```

### Run Seeding

```bash
node --env-file=.env scripts/seed-auth-users.mjs
```

### Verify Users Created

Run in Supabase SQL Editor:

```sql
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'company' as company,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;
```

**Expected:** 5 users with confirmed emails

---

## 📝 CREATE PROFILES (If Using Trigger)

If you have a trigger that auto-creates `public.profiles` from `auth.users`, profiles will be created automatically when users are seeded.

If **NOT**, run this SQL after seeding users:

```sql
-- Backfill profiles for existing auth users
INSERT INTO public.profiles (id, email, full_name, company)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'company'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
```

Verify profiles created:

```sql
SELECT
  p.id,
  p.email,
  p.full_name,
  p.company,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Migration applied successfully via Dashboard SQL Editor
- [ ] All 6 tables created (attendees, events, orders, profiles, tickets, venues)
- [ ] RLS enabled on all tables
- [ ] 5 functions created
- [ ] 10 triggers active
- [ ] Service role key added to `.env`
- [ ] Auth users seeded (5 users)
- [ ] Profiles created/backfilled
- [ ] Test RLS policies with authenticated user

---

## 🔍 TESTING RLS POLICIES

### Test as Anonymous User

```sql
SET ROLE anon;

-- Should see only published public events
SELECT count(*) FROM public.events WHERE status = 'published' AND visibility = 'public';

-- Should fail (no access to profiles without being authenticated)
SELECT * FROM public.orders;

RESET ROLE;
```

### Test as Authenticated User

1. Get a user ID from auth.users:
```sql
SELECT id, email FROM auth.users LIMIT 1;
```

2. Simulate authenticated request (requires setting JWT):
```sql
-- This is more complex - usually tested via API calls
-- For now, verify policies exist:
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected:** 16 policies across all tables

---

## 🚨 TROUBLESHOOTING

### Migration Fails with "relation already exists"

**Solution:** Database has old schema. Options:
1. **Reset database** (⚠️ DELETES ALL DATA):
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```
   Then re-run migration.

2. **Or** manually drop conflicting tables:
   ```sql
   DROP TABLE IF EXISTS public.tickets CASCADE;
   DROP TABLE IF EXISTS public.attendees CASCADE;
   DROP TABLE IF EXISTS public.orders CASCADE;
   DROP TABLE IF EXISTS public.events CASCADE;
   DROP TABLE IF EXISTS public.venues CASCADE;
   DROP TABLE IF EXISTS public.profiles CASCADE;
   ```

### RLS Policy Denies Access

**Check:**
1. User is authenticated (`auth.uid()` returns valid UUID)
2. User owns the resource (e.g., `customer_id = auth.uid()`)
3. Policy conditions are met (e.g., event is published)

### Trigger Not Firing

**Check:**
1. Function exists: `SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public'`
2. Trigger is enabled: `SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema = 'public'`
3. Trigger timing is correct (BEFORE vs AFTER)

### Foreign Key Violation

**Solution:** Insert parent records before children:
1. `auth.users` (via Admin API)
2. `profiles` (manually or via trigger)
3. `venues`
4. `events`
5. `orders`
6. `attendees`
7. `tickets`

---

## 📞 SUPPORT RESOURCES

- **Supabase Dashboard:** https://supabase.com/dashboard/project/asrzdtpyrdgyggqdfwwl
- **Database Logs:** Dashboard → Database → Logs
- **Query Performance:** Dashboard → Database → Query Performance
- **Database Advisors:** Dashboard → Database → Advisors

---

## 🎉 SUCCESS CRITERIA

✅ **Migration deployed** - All tables, functions, triggers, RLS policies created
✅ **Auth users seeded** - 5 organizers created with confirmed emails
✅ **Profiles created** - All auth users have matching profiles
✅ **RLS verified** - Policies correctly restrict/allow access
✅ **Triggers working** - Auto-generation of slugs, ticket codes, order numbers
✅ **Foreign keys enforced** - Referential integrity maintained

---

**Deployment Status:** ✅ READY FOR MANUAL DEPLOYMENT
**Estimated Time:** 10-15 minutes (migration + seeding)
**Risk Level:** Low (fully tested locally)

---

🚀 **Proceed with deployment using the steps above!**
