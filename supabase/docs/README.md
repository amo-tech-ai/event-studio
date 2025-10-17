# Supabase Documentation

Comprehensive guides for working with Supabase in the EventOS project.

## 📚 Available Guides

### [Connection Guide](./connection.md)
Complete guide for connecting to your Supabase database using multiple methods:
- Frontend connection (JavaScript/TypeScript)
- REST API connection with cURL and fetch
- Direct database connection with psql
- Connection pooling strategies
- Database seeding methods
- Troubleshooting tips

## 🚀 Quick Start

### 1. Test Your Connection

Run the automated test script:

```bash
./scripts/test-supabase-connection.sh
```

This will verify:
- Environment variables are set correctly
- REST API is accessible
- Database connection works

### 2. Connect via psql

```bash
# Using direct connection
psql "postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres"

# Or use environment variable
export SUPABASE_DB_URL="postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres"
psql $SUPABASE_DB_URL
```

### 3. Test REST API

```bash
# Get all tables info
curl "https://asrzdtpyrdgyggqdfwwl.supabase.co/rest/v1/" \
  -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}"
```

### 4. Use in JavaScript/TypeScript

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Fetch data
const { data, error } = await supabase
  .from('events')
  .select('*')
```

## 🔧 Environment Setup

Make sure your `.env` file contains:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://asrzdtpyrdgyggqdfwwl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URLs
SUPABASE_DB_URL_DIRECT=postgresql://postgres:Toronto2025%23@db.asrzdtpyrdgyggqdfwwl.supabase.co:5432/postgres
SUPABASE_DB_URL_POOLER=postgresql://postgres.asrzdtpyrdgyggqdfwwl:Toronto2025%23@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```

## 📖 Documentation Index

| Guide | Description | Link |
|-------|-------------|------|
| **Connection Guide** | Complete connection methods and troubleshooting | [View](./connection.md) |
| **React Integration** | Using Supabase with React | [View](./01-react.md) |

## 🛠️ Useful Commands

```bash
# Test database connection
psql $SUPABASE_DB_URL -c "SELECT version();"

# Run migrations
npx supabase db push

# Reset database (development only!)
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/database.ts

# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop
```

## 🔗 External Resources

- [Supabase Official Docs](https://supabase.com/docs)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📝 Notes

- Always use the **anon key** for frontend applications
- Use the **service role key** only for backend/server-side operations
- Enable Row Level Security (RLS) on all tables
- Use connection pooling for serverless/edge functions
- Direct connections require IPv6 support

## 🆘 Getting Help

If you encounter issues:

1. Check the [Connection Guide troubleshooting section](./connection.md#troubleshooting)
2. Run the test script: `./scripts/test-supabase-connection.sh`
3. Verify environment variables are set correctly
4. Check Supabase project status in the dashboard
