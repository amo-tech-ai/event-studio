# Supabase CLI Setup Guide for Local Development

## Current Status: ✅ PARTIALLY CONFIGURED

**Working**:
- ✅ Supabase CLI v2.51.0 installed
- ✅ Authenticated and logged in
- ✅ Linked to project `asrzdtpyrdgyggqdfwwl` (eventos)

**Blocking Issue**:
- ❌ Docker not running (see `02-docker.md`)
- ⚠️ Migration history mismatch detected

---

## 🚀 Quick Start (After Docker is Running)

```bash
# 1. Verify Docker is running
docker ps

# 2. Initialize Supabase project (if not done)
cd /home/sk/event-studio
npx supabase init

# 3. Start local development environment
npx supabase start

# 4. Check status
npx supabase status

# Success: All services show "healthy" status
```

---

## 📋 Complete Setup Checklist

### Prerequisites
- [x] Supabase CLI installed (`npx supabase --version`)
- [x] Authenticated (`npx supabase login`)
- [x] Project linked (`npx supabase link`)
- [ ] **Docker running** (see `02-docker.md`)
- [ ] Local environment started
- [ ] Migration history resolved

---

## 🔧 Step-by-Step Configuration

### 1. Docker Verification (CRITICAL FIRST STEP)

**Before proceeding**, ensure Docker is running:

```bash
# Start Docker Desktop
systemctl --user start docker-desktop

# Wait 10-20 seconds, then verify
docker ps
# Should NOT error with "Cannot connect to Docker daemon"

# If you see errors, stop here and fix Docker first
# See: supabase/docs/02-docker.md
```

---

### 2. Project Initialization

Your project is already initialized (`supabase/config.toml` exists), but verify configuration:

```bash
# Check current config
cat supabase/config.toml | head -20

# Expected sections:
# [api] - API settings
# [db] - Database configuration
# [auth] - Authentication settings
```

#### Key Configuration Values

Edit `supabase/config.toml` if needed:

```toml
# Database settings (leave default for local dev)
[db]
port = 54322
major_version = 17

# API settings
[api]
enabled = true
port = 54321

# Auth settings
[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["http://localhost:5173"]
```

**For Vite React**: Ensure `additional_redirect_urls` includes your dev server port.

---

### 3. Start Local Supabase

```bash
cd /home/sk/event-studio

# Start all services (first time takes 5-10 minutes)
npx supabase start

# Expected output:
# - Downloading Docker images (~15 services)
# - Starting containers
# - Running migrations
# - API URL, DB URL, Studio URL displayed
```

#### First Start Checklist

When starting for the first time, Supabase CLI will:

1. **Pull Docker images** (~2-3 GB total):
   - PostgreSQL 17.6
   - PostgREST API
   - GoTrue Auth
   - Realtime
   - Storage
   - Studio (UI)
   - And more...

2. **Create Docker containers**:
   ```bash
   # View running containers
   docker ps --filter "name=supabase_"
   ```

3. **Apply migrations**:
   - From `supabase/migrations/`
   - Your schema: `20251013044316_core_eventos_schema.sql`

4. **Start services on ports**:
   - API: `http://localhost:54321`
   - Studio: `http://localhost:54323`
   - DB: `postgresql://postgres:postgres@localhost:54322/postgres`

---

### 4. Verify Local Environment

```bash
# Check all services are healthy
npx supabase status

# Expected output:
# API URL: http://localhost:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
# Inbucket URL: http://localhost:54324
# anon key: eyJh... (JWT token)
# service_role key: eyJh... (JWT token)

# All services should show as "running"
```

#### Access Points After Start

- **Studio UI**: `http://localhost:54323`
  - Visual database editor
  - SQL editor
  - Auth user management
  
- **API Endpoint**: `http://localhost:54321`
  - Use with Supabase client in your React app
  
- **Direct DB Access**: 
  ```bash
  psql postgresql://postgres:postgres@localhost:54322/postgres
  ```

---

## 🔄 Migration Management

### Current Issue: Migration History Mismatch

You saw this error:
```
The remote database's migration history does not match local files
```

#### Understanding the Problem

- **Remote DB** (asrzdtpyrdgyggqdfwwl): Has migration history
- **Local files**: `supabase/migrations/20251013044316_core_eventos_schema.sql`
- **Mismatch**: Remote DB may have different version/timestamp

#### Solution 1: Repair Migration History (Recommended)

```bash
# Mark the migration as applied remotely
npx supabase migration repair --status applied 20251013044316

# Then pull to sync
npx supabase db pull

# Verify sync
npx supabase db diff
# Should show: "No schema changes found"
```

#### Solution 2: Fresh Start (Nuclear Option)

```bash
# ⚠️ WARNING: This resets your migration history

# 1. Backup current schema
npx supabase db dump -f backup_$(date +%Y%m%d).sql

# 2. Reset local migrations
rm supabase/migrations/*

# 3. Pull fresh from remote
npx supabase db pull

# 4. New baseline migration created
ls supabase/migrations/
```

#### Solution 3: Generate Diff and Push

```bash
# Create a new migration for any local changes
npx supabase db diff -f sync_local_remote

# Review the generated migration
cat supabase/migrations/*_sync_local_remote.sql

# Push to remote if changes look correct
npx supabase db push

# Verify
npx supabase db diff  # Should show "No schema changes"
```

---

## 🛠️ Common Development Workflows

### Workflow 1: Pull Remote Changes

When your remote database changes (e.g., via Supabase Studio):

```bash
# 1. Pull changes to local files
npx supabase db pull

# 2. Restart local environment to apply
npx supabase db reset

# 3. Verify changes
npx supabase status
```

### Workflow 2: Push Local Changes

After modifying local schema files:

```bash
# 1. Create migration from schema files
npx supabase db diff -f my_new_feature

# 2. Review generated SQL
cat supabase/migrations/*_my_new_feature.sql

# 3. Test locally
npx supabase db reset

# 4. Push to remote (production)
npx supabase db push

# 5. Verify deployment
npx supabase db remote commit
```

### Workflow 3: Reset Local Database

When you need a clean slate:

```bash
# Stop services
npx supabase stop

# Remove volumes (deletes all data)
npx supabase stop --no-backup

# Start fresh
npx supabase start

# Re-apply migrations automatically
```

### Workflow 4: Switch Between Projects

You have multiple Supabase projects:

```bash
# List your projects
npx supabase projects list

# Link to different project
npx supabase link --project-ref dhesktsqhcxhqfjypulk  # medellinai

# Switch back to eventos
npx supabase link --project-ref asrzdtpyrdgyggqdfwwl

# Always verify which project is linked
npx supabase status | grep "Project ref"
```

---

## 🔍 Troubleshooting Common Issues

### Issue 1: "No such container" errors

```bash
# Symptom
npx supabase status
# Error: No such container: supabase_db_asrzdtpyrdgyggqdfwwl

# Diagnosis
docker ps  # Shows no containers

# Root Cause: Docker not running

# Solution
systemctl --user start docker-desktop
# Wait 20 seconds
npx supabase start
```

---

### Issue 2: Port conflicts

```bash
# Symptom
npx supabase start
# Error: port 54322 already in use

# Diagnosis
sudo lsof -i :54322  # Find what's using the port

# Solution 1: Stop conflicting service
# If it's an old Supabase instance:
docker ps -a | grep supabase
docker rm -f $(docker ps -a -q --filter "name=supabase_")

# Solution 2: Change ports in config.toml
[db]
port = 54422  # Different port

# Then restart
npx supabase start
```

---

### Issue 3: Migration fails to apply

```bash
# Symptom
npx supabase db reset
# Error: migration failed at line 42

# Diagnosis
# Check the specific migration file
cat supabase/migrations/20251013044316_core_eventos_schema.sql | head -50

# Solution 1: Fix SQL syntax error in migration file
# Edit the file, fix the error, save

# Solution 2: Skip problematic migration (not recommended)
npx supabase migration repair --status reverted 20251013044316

# Solution 3: Start fresh
rm supabase/migrations/*
npx supabase db pull
```

---

### Issue 4: Can't access Studio UI

```bash
# Symptom
# Browser shows "Can't connect" at http://localhost:54323

# Diagnosis
npx supabase status
# Check if Studio URL is shown

docker ps | grep studio
# Check if studio container is running

# Solution
# Restart Supabase services
npx supabase stop
npx supabase start

# If still failing, check Docker logs
docker logs supabase_studio_eventos
```

---

### Issue 5: Authentication issues in local dev

```bash
# Symptom
# React app shows "Invalid JWT" or auth errors

# Diagnosis
# Verify you're using the correct local keys
npx supabase status | grep "anon key"

# Solution
# Update your React app's .env file:
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<anon_key_from_status>

# NOT the production keys from Supabase Dashboard
```

---

## 🔐 Environment Configuration

### Local Development (.env.local)

Create `/home/sk/event-studio/.env.local`:

```bash
# Supabase local development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Get these values from:
# npx supabase status
```

### Production (.env.production)

Create `/home/sk/event-studio/.env.production`:

```bash
# Supabase production (eventos project)
VITE_SUPABASE_URL=https://asrzdtpyrdgyggqdfwwl.supabase.co
VITE_SUPABASE_ANON_KEY=<your_production_anon_key>

# Get from: https://supabase.com/dashboard/project/asrzdtpyrdgyggqdfwwl/settings/api
```

### Using Environment Files

```bash
# Local development
npm run dev
# Automatically uses .env.local

# Production build
npm run build
# Uses .env.production

# Preview production build locally
npm run preview
```

---

## 📊 Database Schema Management

### Your Current Schema

Located in: `supabase/migrations/20251013044316_core_eventos_schema.sql`

Key tables (622 lines):
- `profiles` - User profiles
- `events` - Event definitions
- `venues` - Event locations
- `orders` - Ticket orders
- `attendees` - Event attendees
- `tickets` - Ticket types

### Schema Development Best Practices

#### 1. Use Schema Files for Organization

Your setup uses `/supabase/schemas/`:
```
00_functions.sql      - Utility functions
01_profiles.sql       - User tables
02_events.sql         - Event tables
03_venues.sql         - Venue tables
04_orders.sql         - Order tables
05_attendees.sql      - Attendee tables
06_tickets.sql        - Ticket tables
07_foreign_keys.sql   - Relationships
08_rls_policies.sql   - Security policies
09_triggers.sql       - Database triggers
```

**Recommended workflow**:
1. Edit individual schema files
2. Generate migration: `npx supabase db diff -f descriptive_name`
3. Review generated SQL
4. Test locally: `npx supabase db reset`
5. Push to remote: `npx supabase db push`

#### 2. Test Schema Changes Locally

```bash
# 1. Make changes to schema files
vim supabase/schemas/02_events.sql

# 2. Generate diff
npx supabase db diff -f add_event_capacity

# 3. Review
cat supabase/migrations/*_add_event_capacity.sql

# 4. Test locally (this resets DB with new migration)
npx supabase db reset

# 5. Verify in Studio
open http://localhost:54323

# 6. If good, push to production
npx supabase db push
```

#### 3. Handle RLS Policies

**Critical**: Your `08_rls_policies.sql` defines security rules.

```sql
-- Example: Only event owners can update events
CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  USING (auth.uid() = user_id);
```

**Test RLS locally**:
```bash
# Connect as authenticated user
psql postgresql://postgres:postgres@localhost:54322/postgres

# Set role to simulate auth
SET request.jwt.claim.sub = '<user_uuid>';

# Try queries - should respect RLS
SELECT * FROM events;
UPDATE events SET title = 'Test';
```

---

## 🚀 Production Deployment Workflow

### Pre-Deployment Checklist

- [ ] All migrations tested locally
- [ ] RLS policies verified
- [ ] No schema diffs between local and remote
- [ ] Backup of production database taken
- [ ] Migrations reviewed by team

### Deploy to Production

```bash
# 1. Verify no uncommitted changes
git status

# 2. Create production migration
npx supabase db diff -f prod_release_$(date +%Y%m%d)

# 3. Review SQL carefully
cat supabase/migrations/*_prod_release_*.sql

# 4. Test migration locally first
npx supabase db reset

# 5. Commit migration to git
git add supabase/migrations/
git commit -m "feat: production schema update"
git push

# 6. Deploy to production (CAREFUL!)
npx supabase db push

# 7. Verify deployment
npx supabase db remote commit
npx supabase db diff  # Should show: No changes
```

### Rollback Plan

If deployment goes wrong:

```bash
# Option 1: Revert specific migration
npx supabase migration repair --status reverted <timestamp>

# Option 2: Restore from backup
# Via Supabase Dashboard → Database → Backups

# Option 3: Manual fix
# Write corrective migration and push
```

---

## 🧪 Testing with Local Supabase

### Seed Data for Development

Create `supabase/seed.sql`:

```sql
-- Insert test users
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'test@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'admin@example.com');

-- Insert test profiles
INSERT INTO public.profiles (id, email, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'test@example.com', 'Test User'),
  ('22222222-2222-2222-2222-222222222222', 'admin@example.com', 'Admin User');

-- Insert test events
INSERT INTO public.events (title, description, user_id) VALUES
  ('Test Conference', 'A test event', '11111111-1111-1111-1111-111111111111'),
  ('Workshop', 'Test workshop', '22222222-2222-2222-2222-222222222222');
```

**Apply seeds**:
```bash
# Automatically runs on: npx supabase db reset
npx supabase db reset

# Or manually:
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql
```

---

## 📚 CLI Command Reference

### Essential Commands

```bash
# Project management
npx supabase init                              # Initialize new project
npx supabase login                             # Authenticate CLI
npx supabase link --project-ref <ref>          # Link to remote project
npx supabase projects list                     # List your projects

# Local development
npx supabase start                             # Start local services
npx supabase stop                              # Stop local services
npx supabase stop --no-backup                  # Stop + delete volumes
npx supabase status                            # Show service status

# Database operations
npx supabase db pull                           # Pull schema from remote
npx supabase db push                           # Push migrations to remote
npx supabase db diff -f <name>                 # Generate migration
npx supabase db reset                          # Reset local DB (re-apply migrations)
npx supabase db dump -f <file>                 # Dump database to SQL file

# Migration management
npx supabase migration list                    # List migrations
npx supabase migration new <name>              # Create empty migration
npx supabase migration repair --status applied <timestamp>  # Mark migration as applied

# Functions (if using Edge Functions)
npx supabase functions new <name>              # Create new function
npx supabase functions serve                   # Run functions locally
npx supabase functions deploy <name>           # Deploy to production

# Testing
npx supabase test db                           # Run database tests
npx supabase db lint                           # Lint SQL files

# Debugging
npx supabase --debug <command>                 # Verbose output
docker logs supabase_db_<project>              # View container logs
```

---

## ✅ Production-Ready Checklist

Your local Supabase setup is **production-ready** when:

### Docker Layer
- [ ] Docker Desktop running (`systemctl --user status docker-desktop`)
- [ ] Docker daemon accessible (`docker ps` works)
- [ ] Sufficient resources allocated (4+ CPUs, 6+ GB RAM)
- [ ] No port conflicts

### Supabase CLI Layer
- [ ] CLI authenticated (`npx supabase login`)
- [ ] Project linked (`npx supabase projects list` shows ●)
- [ ] Config file exists (`supabase/config.toml`)
- [ ] Migrations directory present (`supabase/migrations/`)

### Local Environment
- [ ] Services start successfully (`npx supabase start`)
- [ ] All services healthy (`npx supabase status`)
- [ ] Studio UI accessible (`http://localhost:54323`)
- [ ] API endpoint responding (`curl http://localhost:54321`)

### Migration Management
- [ ] No migration history mismatches
- [ ] `npx supabase db diff` shows "No schema changes"
- [ ] Seed data applies without errors
- [ ] RLS policies tested

### Integration
- [ ] React app connects to local API
- [ ] Environment variables configured (`.env.local`)
- [ ] Authentication works locally
- [ ] Database queries execute successfully

---

## 🔗 Reference Links

- [Supabase CLI Documentation](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Local Development Overview](https://supabase.com/docs/guides/local-development)
- [Migration Management](https://supabase.com/docs/guides/local-development/cli/managing-migrations)
- [Self-Hosting with Docker](https://supabase.com/docs/guides/self-hosting/docker)

---

## 🎯 Next Steps

1. **Fix Docker** (if not done):
   - See `supabase/docs/02-docker.md`
   - Start Docker Desktop
   - Verify: `docker ps`

2. **Start Supabase**:
   ```bash
   cd /home/sk/event-studio
   npx supabase start
   ```

3. **Resolve Migration Mismatch**:
   ```bash
   npx supabase migration repair --status applied 20251013044316
   npx supabase db diff  # Verify: "No schema changes"
   ```

4. **Configure React App**:
   - Update `.env.local` with local Supabase credentials
   - Test authentication flow
   - Verify database queries

5. **Develop with Confidence**:
   - Schema changes → `db diff` → test locally → `db push`
   - Always test in local environment first
   - Use Studio UI for quick testing
   - Keep migrations in version control

**Current Blocker**: Start Docker Desktop, then run `npx supabase start`

