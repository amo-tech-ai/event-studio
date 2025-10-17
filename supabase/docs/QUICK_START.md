# 🚀 Supabase Quick Start

Quick reference guide to get started with Supabase in EventOS.

## ✅ Connection Verified

Your Supabase project is **connected and ready**!

- **Project URL**: `https://asrzdtpyrdgyggqdfwwl.supabase.co`
- **Project ID**: `asrzdtpyrdgyggqdfwwl`
- **Region**: `us-east-1`

## 📦 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 🔧 2. Configure Environment

Your `.env` file is already configured with:

```bash
VITE_SUPABASE_URL=https://asrzdtpyrdgyggqdfwwl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 💻 3. Create Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

## 🎯 4. Basic Usage

### Fetch Data
```typescript
const { data: events, error } = await supabase
  .from('events')
  .select('*')
```

### Insert Data
```typescript
const { data, error } = await supabase
  .from('events')
  .insert([{ name: 'My Event', location: 'Toronto' }])
  .select()
```

### Update Data
```typescript
const { data, error } = await supabase
  .from('events')
  .update({ location: 'Montreal' })
  .eq('id', eventId)
```

### Delete Data
```typescript
const { error } = await supabase
  .from('events')
  .delete()
  .eq('id', eventId)
```

## 🗄️ 5. Database Access (psql)

```bash
# Direct connection
psql "postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres"

# Or use pooler
psql "postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
```

## 🌱 6. Seed Database

Create `supabase/seed.sql`:

```sql
BEGIN;

INSERT INTO public.events (name, location, start_date, capacity)
VALUES
  ('Tech Summit 2025', 'Toronto', '2025-06-15', 500),
  ('Music Fest', 'Montreal', '2025-07-20', 2000);

COMMIT;
```

Run:
```bash
psql $SUPABASE_DB_URL_DIRECT < supabase/seed.sql
```

## 🔐 7. Enable Row Level Security

```sql
-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read access"
ON public.events FOR SELECT
USING (true);

-- Authenticated insert policy
CREATE POLICY "Authenticated users can insert"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (true);
```

## 📡 8. Test REST API

```bash
# Fetch data
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/events?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Insert data
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/events" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"name": "New Event", "location": "Vancouver"}'
```

## 🛠️ Useful Commands

```bash
# Run migrations
npx supabase db push

# Reset database (dev only!)
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > src/types/database.ts

# Test connection
./scripts/test-supabase-connection.sh
```

## 📚 Full Documentation

For complete guides, see:
- [Connection Guide](./connection.md) - All connection methods
- [README](./README.md) - Documentation index

## 🆘 Troubleshooting

### Connection Issues
1. Verify environment variables are set
2. Check project is active in Supabase dashboard
3. For IPv6 issues, use session pooler

### RLS Blocking Access
```sql
-- Temporarily disable for testing (dev only!)
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
```

### Authentication Failed
1. Check password in dashboard
2. Ensure password is URL-encoded
3. Reset password in project settings

## ✨ Next Steps

1. ✅ Connection verified
2. 📝 Create your schema (`supabase/migrations/`)
3. 🔐 Add RLS policies
4. 🌱 Seed test data
5. 🚀 Start building!
