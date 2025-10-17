# Supabase MCP Plugin Integration Plan for EventOS

## Overview

This plan integrates the Supabase MCP (Model Context Protocol) plugin with EventOS to streamline database operations, authentication workflows, and real-time features. The plugin provides 30+ tools for managing your Supabase project directly from Claude Code.

## Current Supabase Setup

**Project Details:**
- Project ID: `asrzdtpyrdgyggqdfwwl`
- Project URL: `https://asrzdtpyrdgyggqdfwwl.supabase.co`
- Region: `aws-1-us-east-1`
- Database: PostgreSQL with connection pooling
- Client: `@supabase/supabase-js` with auto-refresh tokens

**Existing Configuration:**
-  MCP already connected (`.mcp.json` configured)
-  Authentication enabled (localStorage persistence)
-  Environment variables configured
-  TypeScript types generated

## Supabase MCP Plugin Capabilities

### 1. Documentation & Search (3 tools)
- `search_docs` - Search Supabase documentation with GraphQL
- Get guides, API references, troubleshooting, error codes
- Essential for learning best practices

### 2. Project Management (7 tools)
- `list_organizations` - List all organizations
- `get_organization` - Get organization details
- `list_projects` - List all Supabase projects
- `get_project` - Get project details and status
- `create_project` - Create new projects
- `pause_project` - Pause project to save costs
- `restore_project` - Restore paused projects

### 3. Database Operations (9 tools)
- `list_tables` - List all tables in schemas
- `list_extensions` - List database extensions
- `list_migrations` - View migration history
- `apply_migration` - Apply DDL migrations safely
- `execute_sql` - Run SQL queries
- `get_advisors` - Security & performance recommendations
- `generate_typescript_types` - Auto-generate TypeScript types
- `get_project_url` - Get API URL
- `get_anon_key` - Get anonymous key

### 4. Edge Functions (4 tools)
- `list_edge_functions` - List all Edge Functions
- `get_edge_function` - Get function code
- `deploy_edge_function` - Deploy Deno functions
- Supports TypeScript, imports, and entrypoints

### 5. Development Branches (6 tools)
- `create_branch` - Create development branches
- `list_branches` - List all branches
- `delete_branch` - Remove branches
- `merge_branch` - Merge to production
- `reset_branch` - Reset branch state
- `rebase_branch` - Rebase on production

### 6. Storage (2 tools)
- `list_storage_buckets` - List storage buckets
- `get_storage_config` - Get storage configuration
- `update_storage_config` - Update storage settings

### 7. Monitoring & Logs (1 tool)
- `get_logs` - Get service logs (api, postgres, auth, storage, etc.)

### 8. Cost Management (2 tools)
- `get_cost` - Calculate project/branch costs
- `confirm_cost` - Confirm cost before creation

## Phase 1: Database Schema Implementation

### Use Supabase Plugin for Auth Schema

Based on the auth plan in `00-auth-plan.md`, use the plugin to implement:

#### Step 1: Apply Core Table Migrations

```typescript
// Use apply_migration tool for each table
// Migration 1: profiles table
await mcp__supabase__apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "create_profiles_table",
  query: `
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT,
      full_name TEXT,
      avatar_url TEXT,
      provider TEXT,
      provider_id TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
})

// Migration 2: user_sessions table
await mcp__supabase__apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "create_user_sessions_table",
  query: `
    CREATE TABLE public.user_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      ip_address INET,
      user_agent TEXT,
      session_started_at TIMESTAMPTZ DEFAULT NOW(),
      session_ended_at TIMESTAMPTZ,
      is_active BOOLEAN DEFAULT true
    );
  `
})

// Migration 3: oauth_connections table
await mcp__supabase__apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "create_oauth_connections_table",
  query: `
    CREATE TABLE public.oauth_connections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      provider_user_id TEXT,
      access_token TEXT,
      refresh_token TEXT,
      token_expires_at TIMESTAMPTZ,
      scope TEXT[],
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, provider)
    );
  `
})
```

#### Step 2: Create Indexes

```typescript
await mcp__supabase__apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "create_auth_indexes",
  query: `
    -- Profile indexes
    CREATE INDEX idx_profiles_email ON public.profiles(email);
    CREATE INDEX idx_profiles_provider ON public.profiles(provider);
    CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

    -- Session indexes
    CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
    CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active) WHERE is_active = true;
    CREATE INDEX idx_user_sessions_started_at ON public.user_sessions(session_started_at DESC);

    -- OAuth indexes
    CREATE INDEX idx_oauth_connections_user_id ON public.oauth_connections(user_id);
    CREATE INDEX idx_oauth_connections_provider ON public.oauth_connections(provider);
    CREATE INDEX idx_oauth_connections_expires_at ON public.oauth_connections(token_expires_at);
  `
})
```

#### Step 3: Create Triggers

```typescript
await mcp__supabase__apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "create_auth_triggers",
  query: `
    -- Timestamp trigger function
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Profile triggers
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_oauth_connections_updated_at
      BEFORE UPDATE ON public.oauth_connections
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    -- Auto-create profile trigger
    CREATE OR REPLACE FUNCTION handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name, avatar_url, provider, metadata)
      VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_app_meta_data->>'provider',
        NEW.raw_user_meta_data
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user();

    -- Session tracking trigger
    CREATE OR REPLACE FUNCTION track_user_session()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE public.user_sessions
      SET is_active = false, session_ended_at = NOW()
      WHERE user_id = NEW.id AND is_active = true;

      INSERT INTO public.user_sessions (user_id, provider)
      VALUES (NEW.id, NEW.raw_app_meta_data->>'provider');

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_user_sign_in
      AFTER UPDATE ON auth.users
      FOR EACH ROW
      WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
      EXECUTE FUNCTION track_user_session();
  `
})
```

#### Step 4: Enable RLS Policies

```typescript
await mcp__supabase__apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "enable_rls_policies",
  query: `
    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;

    -- Profile policies
    CREATE POLICY "Users can view own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);

    CREATE POLICY "Users can insert own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);

    -- Session policies
    CREATE POLICY "Users can view own sessions"
      ON public.user_sessions FOR SELECT
      USING (auth.uid() = user_id);

    -- OAuth policies
    CREATE POLICY "Users can view own OAuth connections"
      ON public.oauth_connections FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own OAuth connections"
      ON public.oauth_connections FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own OAuth connections"
      ON public.oauth_connections FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own OAuth connections"
      ON public.oauth_connections FOR DELETE
      USING (auth.uid() = user_id);
  `
})
```

#### Step 5: Verify with Advisors

```typescript
// Check for security issues
const securityAdvisors = await mcp__supabase__get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "security"
})

// Check for performance issues
const performanceAdvisors = await mcp__supabase__get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "performance"
})
```

#### Step 6: Generate Updated TypeScript Types

```typescript
const types = await mcp__supabase__generate_typescript_types({
  project_id: "asrzdtpyrdgyggqdfwwl"
})

// Save to src/integrations/supabase/types.ts
```

## Phase 2: Edge Functions Deployment

### Deploy OAuth Helper Functions

```typescript
// Deploy handle-oauth-callback function
await mcp__supabase__deploy_edge_function({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "handle-oauth-callback",
  files: [
    {
      name: "index.ts",
      content: `
        import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
        import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

        serve(async (req) => {
          const { provider, access_token, refresh_token, expires_in, user_metadata } = await req.json()

          const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
          )

          const { data: { user } } = await supabase.auth.getUser()

          if (user) {
            await supabase.from('oauth_connections').upsert({
              user_id: user.id,
              provider,
              access_token,
              refresh_token,
              token_expires_at: new Date(Date.now() + expires_in * 1000),
              metadata: user_metadata
            })
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          })
        })
      `
    }
  ]
})

// Deploy refresh-oauth-token function
await mcp__supabase__deploy_edge_function({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "refresh-oauth-token",
  files: [
    {
      name: "index.ts",
      content: `
        import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
        import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

        serve(async (req) => {
          const { provider } = await req.json()

          const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
          )

          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
          }

          const { data: connection } = await supabase
            .from('oauth_connections')
            .select('*')
            .eq('user_id', user.id)
            .eq('provider', provider)
            .single()

          // Provider-specific refresh logic here

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          })
        })
      `
    }
  ]
})
```

## Phase 3: Development Workflow with Branches

### Use Branches for Safe Development

```typescript
// Create development branch for auth implementation
const authBranch = await mcp__supabase__create_branch({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "auth-implementation",
  confirm_cost_id: "<cost-confirmation-id>"
})

// Develop and test on branch
// Apply migrations to branch, test thoroughly

// List branches to check status
const branches = await mcp__supabase__list_branches({
  project_id: "asrzdtpyrdgyggqdfwwl"
})

// When ready, merge to production
await mcp__supabase__merge_branch({
  branch_id: authBranch.id
})

// Clean up
await mcp__supabase__delete_branch({
  branch_id: authBranch.id
})
```

## Phase 4: Monitoring & Maintenance

### Regular Health Checks

```typescript
// Check for security advisors weekly
const checkSecurity = async () => {
  const advisors = await mcp__supabase__get_advisors({
    project_id: "asrzdtpyrdgyggqdfwwl",
    type: "security"
  })

  if (advisors.length > 0) {
    console.log("Security issues found:", advisors)
    // Take action on each advisor
  }
}

// Check logs for errors
const checkLogs = async () => {
  const authLogs = await mcp__supabase__get_logs({
    project_id: "asrzdtpyrdgyggqdfwwl",
    service: "auth"
  })

  const apiLogs = await mcp__supabase__get_logs({
    project_id: "asrzdtpyrdgyggqdfwwl",
    service: "api"
  })

  // Analyze for errors or patterns
}

// Monitor database performance
const checkPerformance = async () => {
  const advisors = await mcp__supabase__get_advisors({
    project_id: "asrzdtpyrdgyggqdfwwl",
    type: "performance"
  })

  // Review and optimize based on recommendations
}
```

## Phase 5: Integration with Claude Code Workflows

### Combine with Existing Plugins

The Supabase MCP plugin works seamlessly with your existing plugins:

#### Database Operations Plugin
```bash
# Use slash command for migrations
/database-operations:sql-migrations

# Combines with Supabase MCP:
# - Use database-operations for planning migrations
# - Use Supabase MCP apply_migration for execution
# - Use get_advisors for validation
```

#### Full-Stack Development Plugin
```bash
# When implementing features:
# 1. Use backend-architect to design API
# 2. Use database-architect to design schema
# 3. Use Supabase MCP apply_migration to create schema
# 4. Use frontend-developer to build UI
# 5. Use Supabase MCP deploy_edge_function for serverless logic
```

### Task Master Integration

```bash
# Get next task
task-master next
# ’ Task 3.1: Implement OAuth authentication

# Use Supabase MCP for implementation
# Apply migrations, deploy functions, check advisors

# Update task with results
task-master update-subtask --id=3.1 --prompt="
Auth schema implemented:
- Applied 4 migrations via Supabase MCP
- Deployed 3 Edge Functions
- Security advisors: 0 issues
- Performance advisors: 2 suggestions addressed
- TypeScript types regenerated
"

# Complete task
task-master set-status --id=3.1 --status=done
```

## Workflow Patterns

### Pattern 1: Schema Changes
```
1. Design schema with database-architect agent
2. Create migration SQL
3. Test on development branch (create_branch)
4. Apply migration (apply_migration)
5. Check advisors (get_advisors)
6. Generate types (generate_typescript_types)
7. Merge to production (merge_branch)
```

### Pattern 2: Edge Function Development
```
1. Write function locally in TypeScript
2. Test with Deno locally
3. Deploy to branch (deploy_edge_function)
4. Test on branch URL
5. Check logs (get_logs)
6. Merge to production
```

### Pattern 3: Security Audit
```
1. Run security advisor (get_advisors type="security")
2. Review each issue
3. Use security-auditor agent to fix
4. Apply fixes via migrations
5. Re-run advisor to verify
6. Document in Task Master
```

## Best Practices

### 1. Always Use Migrations for Schema Changes
```typescript
//  Good: Use apply_migration
await mcp__supabase__apply_migration({
  project_id: "...",
  name: "descriptive_migration_name",
  query: "..."
})

// L Bad: Direct execute_sql for DDL
await mcp__supabase__execute_sql({
  project_id: "...",
  query: "CREATE TABLE ..." // Don't do this
})
```

### 2. Check Advisors After Changes
```typescript
// After any schema change
const advisors = await mcp__supabase__get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "security"
})

// Act on recommendations immediately
```

### 3. Use Branches for Major Changes
```typescript
// For risky or large changes
const branch = await mcp__supabase__create_branch({
  project_id: "...",
  name: "feature-xyz"
})

// Test thoroughly on branch before merging
```

### 4. Monitor Logs Regularly
```typescript
// Check logs for all services
const services = ['api', 'auth', 'postgres', 'storage', 'edge-function']

for (const service of services) {
  const logs = await mcp__supabase__get_logs({
    project_id: "...",
    service
  })
  // Review for errors
}
```

### 5. Keep Types Updated
```typescript
// After any schema change
const types = await mcp__supabase__generate_typescript_types({
  project_id: "asrzdtpyrdgyggqdfwwl"
})

// Update src/integrations/supabase/types.ts
```

## Implementation Checklist

### Initial Setup
- [x] MCP connection established
- [x] Environment variables configured
- [x] Client initialized with auth persistence
- [ ] Test basic MCP tool calls

### Phase 1: Database Schema
- [ ] Apply profiles table migration
- [ ] Apply user_sessions table migration
- [ ] Apply oauth_connections table migration
- [ ] Create all indexes
- [ ] Create trigger functions
- [ ] Enable RLS policies
- [ ] Run security advisor
- [ ] Run performance advisor
- [ ] Generate TypeScript types

### Phase 2: Edge Functions
- [ ] Deploy handle-oauth-callback function
- [ ] Deploy refresh-oauth-token function
- [ ] Deploy sync-user-profile function
- [ ] Test all functions with logs
- [ ] Configure function secrets

### Phase 3: Development Workflow
- [ ] Create first development branch
- [ ] Test branch workflow
- [ ] Document branch naming conventions
- [ ] Set up merge process

### Phase 4: Monitoring
- [ ] Set up weekly security checks
- [ ] Configure log monitoring
- [ ] Document incident response
- [ ] Create performance baseline

### Phase 5: Integration
- [ ] Test with database-operations plugin
- [ ] Test with full-stack-development plugin
- [ ] Update Task Master workflows
- [ ] Create custom slash commands

## Expected Benefits

### Development Speed
- **5x faster migrations**: Apply SQL directly via MCP
- **Instant type generation**: Auto-sync TypeScript types
- **Quick debugging**: Access logs immediately
- **Rapid deployment**: Deploy Edge Functions in seconds

### Code Quality
- **Zero RLS gaps**: Advisors catch missing policies
- **Performance optimization**: Automatic indexing recommendations
- **Security compliance**: Real-time vulnerability detection
- **Type safety**: Always up-to-date TypeScript definitions

### Team Collaboration
- **Safe testing**: Development branches isolate changes
- **Clear audit trail**: Migration history tracked
- **Shared knowledge**: Advisors teach best practices
- **Consistent patterns**: MCP enforces standards

## Troubleshooting

### Common Issues

**Issue: Migration fails**
```typescript
// Check logs
const logs = await mcp__supabase__get_logs({
  project_id: "...",
  service: "postgres"
})

// Review migration history
const migrations = await mcp__supabase__list_migrations({
  project_id: "..."
})
```

**Issue: RLS policy not working**
```typescript
// Check advisors
const advisors = await mcp__supabase__get_advisors({
  project_id: "...",
  type: "security"
})

// Look for RLS warnings
```

**Issue: Types out of sync**
```typescript
// Regenerate types
const types = await mcp__supabase__generate_typescript_types({
  project_id: "..."
})

// Update src/integrations/supabase/types.ts immediately
```

## Next Steps

1. **Start with Schema**: Implement auth schema from Phase 1
2. **Deploy Functions**: Set up Edge Functions from Phase 2
3. **Test Workflow**: Create a development branch and test
4. **Monitor**: Set up regular advisor checks
5. **Integrate**: Combine with other plugins and Task Master

## References

- [Supabase Auth Plan](./00-auth-plan.md)
- [Plugin Marketplace Plan](../plugins/plan-plugins.md)
- [Database Operations Slash Commands](/database-operations:sql-migrations)
- [MCP Configuration](../../.mcp.json)
- [Supabase Documentation](https://supabase.com/docs)
