# Supabase Connection Guide

Complete guide for connecting to your EventOS Supabase database using multiple methods.

## 📋 Table of Contents

- [Project Information](#project-information)
- [Connection Methods Overview](#connection-methods-overview)
- [1. Frontend Connection (JavaScript/TypeScript)](#1-frontend-connection-javascripttypescript)
- [2. REST API Connection](#2-rest-api-connection)
- [3. Direct Database Connection (psql)](#3-direct-database-connection-psql)
- [4. Connection Pooling](#4-connection-pooling)
- [5. Seeding Data](#5-seeding-data)
- [Troubleshooting](#troubleshooting)

---

## Project Information

**Project Details:**
- **Project ID**: `asrzdtpyrdgyggqdfwwl`
- **Project URL**: `https://asrzdtpyrdgyggqdfwwl.supabase.co`
- **Region**: `us-east-1`

**Environment Variables:**
```bash
# Frontend (safe for browser)
VITE_SUPABASE_URL=https://asrzdtpyrdgyggqdfwwl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Direct connection (IPv6 required - for migrations/admin)
SUPABASE_DB_URL_DIRECT=postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres

# Session pooler (IPv4/IPv6 - for persistent backends)
SUPABASE_DB_URL_SESSION=postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Transaction pooler (IPv4/IPv6 - for serverless/edge functions)
SUPABASE_DB_URL_TRANSACTION=postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Local development
VITE_SUPABASE_URL_LOCAL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY_LOCAL=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_DB_URL_LOCAL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

---

## Connection Methods Overview

| Method | Use Case | Port | IPv4/IPv6 | Prepared Statements |
|--------|----------|------|-----------|---------------------|
| **Supabase Client** | Frontend apps (React/Vue/etc) | 443 | Both | N/A |
| **REST API** | Direct HTTP requests | 443 | Both | N/A |
| **Direct Connection** | Database admin, migrations, persistent VMs | 5432 | IPv6 only | ✅ Supported |
| **Session Pooler (Supavisor)** | Persistent backends needing IPv4 | 5432 | Both | ✅ Supported |
| **Transaction Pooler (Supavisor)** | Serverless/Edge functions | 6543 | Both | ❌ Not supported |

**When to use each**:
- **Frontend/Mobile apps**: Use Supabase Client (wraps REST API with auth)
- **Direct Connection**: Long-running containers, VMs, local development
- **Session Pooler**: When you need IPv4 support for persistent backends
- **Transaction Pooler**: Serverless functions (Vercel, Netlify, AWS Lambda, Edge)

Reference: [Official Supabase Connection Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

## 1. Frontend Connection (JavaScript/TypeScript)

### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Create Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Basic Usage Examples

**Fetch Data:**
```typescript
import { supabase } from './lib/supabase'

// Get all events
const { data: events, error } = await supabase
  .from('events')
  .select('*')

// Get single event
const { data: event } = await supabase
  .from('events')
  .select('*')
  .eq('id', eventId)
  .single()
```

**Insert Data:**
```typescript
const { data, error } = await supabase
  .from('events')
  .insert([
    {
      name: 'Tech Conference 2025',
      location: 'Toronto',
      start_date: '2025-06-15'
    }
  ])
  .select()
```

**Update Data:**
```typescript
const { data, error } = await supabase
  .from('events')
  .update({ location: 'Montreal' })
  .eq('id', eventId)
  .select()
```

**Delete Data:**
```typescript
const { error } = await supabase
  .from('events')
  .delete()
  .eq('id', eventId)
```

---

## 2. REST API Connection

### Connection Details

- **Base URL**: `https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1`
- **API Key**: Use `VITE_SUPABASE_ANON_KEY` (for frontend) or service role key (for backend)

### cURL Examples

**GET Request (Fetch Data):**
```bash
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/events?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**POST Request (Insert Data):**
```bash
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/events" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "name": "Summer Festival",
    "location": "Toronto",
    "start_date": "2025-07-20"
  }'
```

**PATCH Request (Update Data):**
```bash
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/events?id=eq.1" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -X PATCH \
  -d '{"location": "Vancouver"}'
```

**DELETE Request:**
```bash
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/events?id=eq.1" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -X DELETE
```

### JavaScript Fetch Example

```javascript
const API_URL = 'https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1'
const API_KEY = 'YOUR_ANON_KEY'

async function fetchEvents() {
  const response = await fetch(`${API_URL}/events?select=*`, {
    headers: {
      'apikey': API_KEY,
      'Authorization': `Bearer ${API_KEY}`
    }
  })

  const data = await response.json()
  console.log(data)
}
```

### Advanced REST Features

**Filtering:**
```bash
# Equal to
?column=eq.value

# Not equal
?column=neq.value

# Greater than
?column=gt.value

# Less than
?column=lt.value

# LIKE pattern
?column=like.*pattern*

# ILIKE (case-insensitive)
?column=ilike.*pattern*
```

**Ordering:**
```bash
?order=column.asc
?order=column.desc
```

**Pagination:**
```bash
# Using Range header
-H "Range: 0-9"  # First 10 records

# Using limit and offset
?limit=10&offset=20
```

**Calling RPC Functions:**
```bash
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/rpc/function_name" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"param1": "value1"}'
```

---

## 3. Direct Database Connection (psql)

### Prerequisites

```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client  # Ubuntu/Debian
brew install postgresql                 # macOS
```

### Connection Methods

**Method 1: Direct Connection (IPv6 Required)**
```bash
psql "postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres"
```

**Method 2: Session Pooler (IPv4/IPv6)**
```bash
psql "postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

**Method 3: Transaction Pooler (Serverless)**
```bash
psql "postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
```

### Using Environment Variables

```bash
# Set environment variable
export SUPABASE_DB_URL="postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres"

# Connect
psql $SUPABASE_DB_URL
```

### Common psql Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d table_name

-- List all schemas
\dn

-- Execute SQL file
\i /path/to/file.sql

-- Output to file
\o output.txt
SELECT * FROM events;
\o

-- Quit
\q
```

---

## 4. Connection Pooling

### Understanding Supavisor (Connection Pooler)

Supabase uses **Supavisor** as a shared connection pooler that sits between your application and the database. It operates in two modes:

**Session Mode (Port 5432):**
- Connection maintained for the duration of the client session
- ✅ Prepared statements supported
- ✅ Best for persistent backends (servers, long-running containers)
- ✅ Supports IPv4 and IPv6
- ✅ Use when your environment doesn't support IPv6

**Transaction Mode (Port 6543):**
- Connection held only for the duration of a transaction
- ❌ Prepared statements NOT supported
- ✅ Best for serverless/edge functions (auto-scaling, transient connections)
- ✅ Maximizes connection reuse for high-concurrency apps
- ✅ Supports IPv4 and IPv6

### When to Use Each Method

**Direct Connection (Port 5432):**
```bash
postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres
```
- ✅ Database migrations and admin tasks
- ✅ Local development (Supabase CLI)
- ✅ Long-lived connections on VMs/containers
- ❌ **Requires IPv6** (or use IPv4 add-on)
- ❌ Not suitable for serverless (no connection pooling)

**Session Pooler (Port 5432):**
```bash
postgresql://postgres.PROJECT-REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```
- ✅ Persistent backend services needing IPv4
- ✅ Long-lived connections
- ✅ Prepared statements work
- ✅ When you can't use direct connection due to IPv6

**Transaction Pooler (Port 6543):**
```bash
postgresql://postgres.PROJECT-REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```
- ✅ Serverless functions (Vercel, Netlify, AWS Lambda)
- ✅ Edge functions (Cloudflare Workers, Deno Deploy)
- ✅ Auto-scaling applications with many short-lived connections
- ⚠️ **Disable prepared statements** in your connection library
- ❌ Not suitable for long-running queries or sessions

Reference: [Supabase Connection Management](https://supabase.com/docs/guides/database/connection-management)

### Connection Pool Configuration

The default pool size is configured in your Supabase project settings. Monitor usage:

```sql
-- Check active connections
SELECT
  count(*) as active_connections,
  usename,
  application_name
FROM pg_stat_activity
GROUP BY usename, application_name;

-- View all connections
SELECT
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query
FROM pg_stat_activity;
```

---

## 5. Seeding Data

### Method 1: Using SQL Migrations

Create a seed migration file:

```sql
-- supabase/migrations/20250113000000_seed_data.sql

-- Insert sample events
INSERT INTO public.events (name, location, start_date, end_date, description)
VALUES
  ('Tech Conference 2025', 'Toronto', '2025-06-15', '2025-06-17', 'Annual technology conference'),
  ('Music Festival', 'Montreal', '2025-07-20', '2025-07-22', 'Summer music festival'),
  ('Food Expo', 'Vancouver', '2025-08-10', '2025-08-12', 'International food exposition');
```

Apply migration:
```bash
npx supabase db push
```

### Method 2: Using seed.sql File

Create `/supabase/seed.sql`:

```sql
-- Seed file for development data
BEGIN;

-- Clear existing data (development only!)
TRUNCATE public.events CASCADE;

-- Insert events
INSERT INTO public.events (name, location, start_date, end_date, description, capacity)
VALUES
  ('Summer Tech Summit', 'Toronto', '2025-06-15', '2025-06-17', 'Technology conference', 500),
  ('Jazz in the Park', 'Montreal', '2025-07-20', '2025-07-21', 'Outdoor jazz festival', 2000),
  ('Startup Pitch Night', 'Vancouver', '2025-08-05', '2025-08-05', 'Pitch competition', 150);

COMMIT;
```

Run seed file:
```bash
psql $SUPABASE_DB_URL < supabase/seed.sql
```

### Method 3: Using Supabase CLI

```bash
# Reset and seed database
npx supabase db reset

# The reset command will:
# 1. Drop the database
# 2. Re-apply all migrations
# 3. Run seed.sql if it exists
```

### Method 4: Programmatic Seeding (TypeScript)

Create `scripts/seed.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🌱 Seeding database...')

  const { data: events, error } = await supabase
    .from('events')
    .insert([
      {
        name: 'Tech Conference 2025',
        location: 'Toronto',
        start_date: '2025-06-15',
        capacity: 500
      },
      {
        name: 'Music Festival',
        location: 'Montreal',
        start_date: '2025-07-20',
        capacity: 2000
      }
    ])
    .select()

  if (error) console.error('Error:', error)
  else console.log('✅ Seeded:', events.length, 'events')
}

seed()
```

Run:
```bash
npm install tsx
npx tsx scripts/seed.ts
```

### Method 5: Using REST API

Create `scripts/seed.sh`:

```bash
#!/bin/bash

API_URL="https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1"
API_KEY="YOUR_SERVICE_ROLE_KEY"

echo "🌱 Seeding database..."

curl "$API_URL/events" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -X POST \
  -d '[
    {
      "name": "Tech Conference 2025",
      "location": "Toronto",
      "start_date": "2025-06-15",
      "capacity": 500
    }
  ]'

echo "✅ Seeding complete!"
```

Make executable and run:
```bash
chmod +x scripts/seed.sh
./scripts/seed.sh
```

---

## Troubleshooting

### Connection Refused

**Problem**: Cannot connect to database

**Solutions**:
1. Check if project is active in Supabase dashboard
2. Verify connection string is correct
3. Ensure network allows PostgreSQL port (5432/6543)
4. For IPv6 issues, use session pooler instead

### Authentication Failed

**Problem**: "FATAL: password authentication failed"

**Solutions**:
1. Verify password is correct (check dashboard)
2. Ensure password is URL-encoded in connection string
3. Reset database password in project settings

### SSL/TLS Errors

**Problem**: SSL connection errors

**Solutions**:
```bash
# Add SSL mode to connection string
psql "postgresql://...?sslmode=require"

# Or disable SSL for local development only
psql "postgresql://...?sslmode=disable"
```

### Row Level Security (RLS) Blocking Access

**Problem**: Cannot read/write data via REST API

**Solutions**:
```sql
-- Allow public read
CREATE POLICY "Public read access"
ON public.events FOR SELECT
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated insert"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Too Many Connections

**Problem**: "too many connections" error

**Solutions**:
1. Use connection pooler (transaction mode for serverless)
2. Close idle connections
3. Upgrade compute tier for more connections
4. Monitor connections:
```sql
SELECT count(*) FROM pg_stat_activity;
```

---

## Quick Reference

### Connection Strings

```bash
# Direct (IPv6)
postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres

# Session Pooler
postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-1-us-east-1.pooler.supabase.com:5432/postgres

# Transaction Pooler
postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```

### API Endpoints

```bash
# REST API
https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1

# Auth
https://asrzdtpyrdgyggqdfwwl.supabase.co/auth/v1

# Storage
https://asrzdtpyrdgyggqdfwwl.supabase.co/storage/v1

# Realtime
wss://asrzdtpyrdgyggqdfwwl.supabase.co/realtime/v1
```

### Essential Commands

```bash
# Test connection
psql $SUPABASE_DB_URL -c "SELECT version();"

# Run migration
npx supabase db push

# Reset database (caution!)
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/database.ts
```

---

## Next Steps

1. ✅ Test connection using one of the methods above
2. 📝 Create your database schema (see `/supabase/migrations/`)
3. 🔐 Set up Row Level Security policies
4. 🌱 Seed your database with test data
5. 🚀 Deploy to production

For more information, see:
- [Supabase Documentation](https://supabase.com/docs)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
