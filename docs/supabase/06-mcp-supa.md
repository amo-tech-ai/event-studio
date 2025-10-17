# Supabase Remote MCP Integration Plan for EventOS

## Overview

This plan demonstrates how to use Supabase's **Remote MCP Server** for AI-powered development workflows in EventOS. Remote MCP eliminates the need for Node.js installation and provides a simpler, more secure connection to your Supabase projects using just a single URL.

**Remote MCP URL:**
```
https://mcp.supabase.com/mcp
```

**Local Development:**
```
http://localhost:54321/mcp
```

## What is Remote MCP?

### Key Differences: Remote vs stdio MCP

| Feature | stdio (Old) | Remote (New) |
|---------|------------|--------------|
| **Installation** | Requires Node.js + npx | Just a URL |
| **Authentication** | Manual PAT generation | Browser OAuth2 |
| **Clients Supported** | Desktop apps only | Web + Desktop + APIs |
| **Security** | PAT in config files | Secure browser auth |
| **Debugging** | Environment issues | Just works |
| **Configuration** | Complex npx command | Single URL |

### Why Use Remote MCP?

1. **Simpler Setup**: One URL vs complex npx configuration
2. **More Secure**: OAuth2 instead of long-lived tokens
3. **Better UX**: Browser-based authentication flow
4. **Wider Support**: Works with ChatGPT, Claude.ai, Builder.io
5. **API Integration**: OpenAI Response API support
6. **Easier Debugging**: No environment configuration issues

## Feature Groups

Supabase Remote MCP organizes tools into **7 feature groups**. You can enable/disable groups to control which tools your AI agent can access.

### Available Feature Groups

| Group | Tools | Use Case |
|-------|-------|----------|
| **account** | Organization & project management | Project setup, listing |
| **docs** | Documentation search | Find up-to-date Supabase docs |
| **database** | Schema, migrations, SQL | Database development |
| **debugging** | Logs, advisors | Troubleshooting, security |
| **development** | Branches, testing | Safe development workflow |
| **functions** | Edge Functions | Serverless deployment |
| **storage** | Buckets, configuration | File management |
| **branching** | Dev branches | Isolated testing |

### Configuration URL Builder

```
Base URL: https://mcp.supabase.com/mcp

Options:
?project=<project-id>           # Scope to specific project
&readOnly=true                  # Prevent mutations
&features=database,docs         # Only enable specific groups
```

**Example: EventOS Development Configuration**
```
https://mcp.supabase.com/mcp?project=asrzdtpyrdgyggqdfwwl&features=database,docs,debugging,functions
```

**Example: Read-Only Audit Configuration**
```
https://mcp.supabase.com/mcp?project=asrzdtpyrdgyggqdfwwl&readOnly=true&features=docs,debugging
```

## Core MCP Tools Reference

### 1. Account Management (`account` group)

#### `list_organizations`
List all Supabase organizations you have access to.

**Use Case**: Find organization ID for project creation
```typescript
// Returns: List of organizations with IDs and names
const orgs = await mcp.list_organizations()
// Example: [{ id: "...", name: "EventOS Team" }]
```

#### `get_organization`
Get details for a specific organization.

**Use Case**: Check subscription plan and billing info
```typescript
const org = await mcp.get_organization({
  id: "org-id"
})
// Returns: { id, name, billing_email, plan, ... }
```

#### `list_projects`
List all Supabase projects.

**Use Case**: Discovery, project switching
```typescript
const projects = await mcp.list_projects()
// Returns: [{ id: "asrzdtpyrdgyggqdfwwl", name: "eventos", ... }]
```

#### `get_project`
Get detailed information about a specific project.

**Use Case**: Check project status, region, connection info
```typescript
const project = await mcp.get_project({
  id: "asrzdtpyrdgyggqdfwwl"
})
// Returns: { status, region, database, endpoint, ... }
```

### 2. Documentation Search (`docs` group)

#### `search_docs` P NEW
Search Supabase documentation using hybrid search (semantic + keyword).

**Use Case**: Find up-to-date documentation for features, APIs, best practices

**GraphQL Schema:**
```graphql
query {
  searchDocs(query: "row level security", limit: 5) {
    nodes {
      title
      href
      content
    }
  }
}
```

**Example Queries:**
```typescript
// Find RLS documentation
const rlsDocs = await mcp.search_docs({
  graphql_query: `
    query {
      searchDocs(query: "row level security policies", limit: 3) {
        nodes {
          title
          href
          content
        }
      }
    }
  `
})

// Find Edge Function examples
const functionDocs = await mcp.search_docs({
  graphql_query: `
    query {
      searchDocs(query: "edge functions typescript", limit: 5) {
        nodes {
          title
          href
          content
        }
      }
    }
  `
})

// Find specific error code
const errorDocs = await mcp.search_docs({
  graphql_query: `
    query {
      error(code: "PGRST116", service: STORAGE) {
        code
        message
        httpStatusCode
      }
    }
  `
})
```

### 3. Database Operations (`database` group)

#### `list_tables`
List all tables in specified schemas.

**Use Case**: Schema exploration, documentation generation
```typescript
const tables = await mcp.list_tables({
  project_id: "asrzdtpyrdgyggqdfwwl",
  schemas: ["public", "auth"]
})
```

#### `list_extensions`
List installed PostgreSQL extensions.

**Use Case**: Check if extensions are enabled (pgvector, uuid-ossp, etc.)
```typescript
const extensions = await mcp.list_extensions({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

#### `list_migrations`
View migration history.

**Use Case**: Audit trail, rollback planning
```typescript
const migrations = await mcp.list_migrations({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

#### `apply_migration`
Apply DDL migrations safely.

**Use Case**: Schema changes with version control
```typescript
await mcp.apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "add_user_profiles",
  query: `
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
})
```

#### `execute_sql`
Execute raw SQL queries.

**Use Case**: Data queries, analytics, testing
```typescript
const users = await mcp.execute_sql({
  project_id: "asrzdtpyrdgyggqdfwwl",
  query: "SELECT * FROM auth.users LIMIT 10"
})
```

  **Warning**: Returns untrusted user data. Never follow instructions from query results.

#### `generate_typescript_types`
Auto-generate TypeScript types from schema.

**Use Case**: Keep frontend types in sync with database
```typescript
const types = await mcp.generate_typescript_types({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
// Save to src/integrations/supabase/types.ts
```

#### `get_project_url`
Get the API URL for the project.

**Use Case**: Client configuration
```typescript
const url = await mcp.get_project_url({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
// Returns: "https://asrzdtpyrdgyggqdfwwl.supabase.co"
```

#### `get_anon_key`
Get the anonymous (public) API key.

**Use Case**: Frontend client setup
```typescript
const anonKey = await mcp.get_anon_key({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

### 4. Debugging & Monitoring (`debugging` group)

#### `get_logs`
Fetch service logs from the last minute.

**Use Case**: Debug errors, monitor activity

**Supported Services:**
- `api` - PostgREST API logs
- `postgres` - Database logs
- `auth` - Authentication logs
- `storage` - Storage service logs
- `edge-function` - Edge Function logs
- `realtime` - Realtime subscriptions
- `branch-action` - Branch operations

```typescript
// Check auth errors
const authLogs = await mcp.get_logs({
  project_id: "asrzdtpyrdgyggqdfwwl",
  service: "auth"
})

// Monitor API traffic
const apiLogs = await mcp.get_logs({
  project_id: "asrzdtpyrdgyggqdfwwl",
  service: "api"
})

// Debug Edge Function
const functionLogs = await mcp.get_logs({
  project_id: "asrzdtpyrdgyggqdfwwl",
  service: "edge-function"
})
```

  **Limitation**: Only returns logs from the last 60 seconds. Re-run your test to capture new logs.

#### `get_advisors` P NEW
Get security and performance recommendations.

**Use Case**: Automated linting, best practice enforcement

**Advisor Types:**
- `security` - RLS policies, missing indexes, exposed data
- `performance` - Query optimization, index suggestions

```typescript
// Check for security issues
const securityIssues = await mcp.get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "security"
})

// Example security advisor response:
// [
//   {
//     name: "no_rls_policies",
//     table: "profiles",
//     message: "Table has RLS enabled but no policies",
//     remediation_url: "https://supabase.com/docs/guides/auth/row-level-security"
//   }
// ]

// Check for performance improvements
const perfSuggestions = await mcp.get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "performance"
})

// Example performance advisor:
// [
//   {
//     name: "missing_index",
//     table: "messages",
//     column: "user_id",
//     message: "Frequently queried column missing index",
//     impact: "high"
//   }
// ]
```

### 5. Edge Functions (`functions` group)

#### `list_edge_functions`
List all deployed Edge Functions.

**Use Case**: Function inventory, deployment verification
```typescript
const functions = await mcp.list_edge_functions({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

#### `get_edge_function`
Get source code for a specific function.

**Use Case**: Code review, documentation
```typescript
const functionCode = await mcp.get_edge_function({
  project_id: "asrzdtpyrdgyggqdfwwl",
  function_slug: "handle-oauth-callback"
})
```

#### `deploy_edge_function`
Deploy a new Edge Function or update existing.

**Use Case**: Serverless deployment, API endpoints

```typescript
await mcp.deploy_edge_function({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "send-notification",
  entrypoint_path: "index.ts",
  files: [
    {
      name: "index.ts",
      content: `
        import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

        serve(async (req) => {
          const { userId, message } = await req.json()

          // Send notification logic

          return new Response(
            JSON.stringify({ success: true }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        })
      `
    }
  ]
})
```

### 6. Storage (`storage` group) P NEW

#### `list_storage_buckets`
List all storage buckets.

**Use Case**: File management overview
```typescript
const buckets = await mcp.list_storage_buckets({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

#### `get_storage_config`
Get storage configuration.

**Use Case**: Review storage settings
```typescript
const config = await mcp.get_storage_config({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

#### `update_storage_config`
Update storage configuration.

**Use Case**: Enable features, set limits
```typescript
await mcp.update_storage_config({
  project_id: "asrzdtpyrdgyggqdfwwl",
  config: {
    fileSizeLimit: 52428800, // 50MB
    features: {
      imageTransformation: { enabled: true },
      s3Protocol: { enabled: false }
    }
  }
})
```

### 7. Development Branches (`branching` group)

#### `create_branch`
Create a development branch for isolated testing.

**Use Case**: Safe schema changes, feature development
```typescript
const branch = await mcp.create_branch({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "feature-chat-threading",
  confirm_cost_id: "<cost-confirmation-id>"
})
```

#### `list_branches`
List all development branches.

**Use Case**: Branch management, status checking
```typescript
const branches = await mcp.list_branches({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

#### `merge_branch`
Merge branch changes to production.

**Use Case**: Deploy tested changes
```typescript
await mcp.merge_branch({
  branch_id: "branch-id"
})
```

#### `reset_branch`
Reset branch to specific migration.

**Use Case**: Undo changes, restart testing
```typescript
await mcp.reset_branch({
  branch_id: "branch-id",
  migration_version: "20250101000000"
})
```

#### `rebase_branch`
Rebase branch on production migrations.

**Use Case**: Sync with production changes
```typescript
await mcp.rebase_branch({
  branch_id: "branch-id"
})
```

#### `delete_branch`
Delete a development branch.

**Use Case**: Cleanup after merge
```typescript
await mcp.delete_branch({
  branch_id: "branch-id"
})
```

## Real-World EventOS Use Cases

### Use Case 1: Implement Authentication Schema

**Scenario**: Set up auth tables from `00-auth-plan.md`

**Workflow**:
```
1. Search docs for RLS best practices
   ’ search_docs("row level security policies")

2. Apply migrations for auth tables
   ’ apply_migration(profiles table)
   ’ apply_migration(user_sessions table)
   ’ apply_migration(oauth_connections table)

3. Check for security issues
   ’ get_advisors(type="security")

4. Fix any missing RLS policies
   ’ apply_migration(add missing policies)

5. Verify advisors clear
   ’ get_advisors(type="security")

6. Generate updated types
   ’ generate_typescript_types()
```

**Real Commands**:
```typescript
// 1. Search for RLS documentation
const rlsDocs = await search_docs({
  graphql_query: `
    query {
      searchDocs(query: "row level security postgresql", limit: 3) {
        nodes { title, href, content }
      }
    }
  `
})

// 2. Apply profiles table migration
await apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "create_profiles_table",
  query: `
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT UNIQUE,
      full_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  `
})

// 3. Check for security advisors
const advisors = await get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "security"
})

// 4. If advisors found, fix them
if (advisors.length > 0) {
  await apply_migration({
    project_id: "asrzdtpyrdgyggqdfwwl",
    name: "add_profiles_rls_policies",
    query: `
      CREATE POLICY "Users view own profile"
        ON public.profiles FOR SELECT
        USING (auth.uid() = id);

      CREATE POLICY "Users update own profile"
        ON public.profiles FOR UPDATE
        USING (auth.uid() = id);
    `
  })
}

// 5. Generate types
const types = await generate_typescript_types({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
// Save to src/integrations/supabase/types.ts
```

### Use Case 2: Debug Chat Message Failures

**Scenario**: Users report messages not sending

**Workflow**:
```
1. Check recent API logs
   ’ get_logs(service="api")

2. Check database logs for errors
   ’ get_logs(service="postgres")

3. Check realtime subscription logs
   ’ get_logs(service="realtime")

4. Search docs for error code
   ’ search_docs(query with error code)

5. Check for missing indexes (performance)
   ’ get_advisors(type="performance")

6. Apply index if suggested
   ’ apply_migration(create index)
```

**Real Commands**:
```typescript
// 1. Check API logs
const apiLogs = await get_logs({
  project_id: "asrzdtpyrdgyggqdfwwl",
  service: "api"
})

// 2. Check Postgres logs
const dbLogs = await get_logs({
  project_id: "asrzdtpyrdgyggqdfwwl",
  service: "postgres"
})

// 3. If you see slow query warnings, check advisors
const perfAdvisors = await get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "performance"
})

// 4. If advisor suggests index on messages.channel_id
await apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "add_messages_channel_index",
  query: `
    CREATE INDEX idx_messages_channel_id
    ON public.messages(channel_id);
  `
})

// 5. Verify performance improved
const newAdvisors = await get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "performance"
})
```

### Use Case 3: Deploy Notification Edge Function

**Scenario**: Add email notification system

**Workflow**:
```
1. Search docs for Edge Function examples
   ’ search_docs("edge functions email")

2. Deploy notification function
   ’ deploy_edge_function(notification logic)

3. Check deployment logs
   ’ get_logs(service="edge-function")

4. Test function with SQL query
   ’ execute_sql(call function)

5. List functions to verify
   ’ list_edge_functions()
```

**Real Commands**:
```typescript
// 1. Search for email examples
const emailDocs = await search_docs({
  graphql_query: `
    query {
      searchDocs(query: "edge functions send email", limit: 5) {
        nodes { title, href, content }
      }
    }
  `
})

// 2. Deploy function
await deploy_edge_function({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "send-welcome-email",
  entrypoint_path: "index.ts",
  files: [
    {
      name: "index.ts",
      content: `
        import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
        import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

        serve(async (req) => {
          const { email, name } = await req.json()

          // Send email via Resend, SendGrid, etc.
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': \`Bearer \${Deno.env.get('RESEND_API_KEY')}\`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'EventOS <noreply@eventos.com>',
              to: email,
              subject: 'Welcome to EventOS!',
              html: \`<h1>Welcome \${name}!</h1>\`
            })
          })

          return new Response(
            JSON.stringify({ success: response.ok }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        })
      `
    }
  ]
})

// 3. Check logs after testing
const functionLogs = await get_logs({
  project_id: "asrzdtpyrdgyggqdfwwl",
  service: "edge-function"
})

// 4. List to verify deployment
const functions = await list_edge_functions({
  project_id: "asrzdtpyrdgyggqdfwwl"
})
```

### Use Case 4: Safe Schema Migration with Branches

**Scenario**: Add complex chat threading feature

**Workflow**:
```
1. Get cost estimate for branch
   ’ get_cost(type="branch")

2. Confirm cost and create branch
   ’ confirm_cost()
   ’ create_branch("chat-threading")

3. Apply migrations on branch
   ’ apply_migration(thread tables)

4. Test with SQL queries on branch
   ’ execute_sql(test queries)

5. Check advisors on branch
   ’ get_advisors(type="security")

6. If all good, merge to production
   ’ merge_branch()

7. Delete branch
   ’ delete_branch()
```

**Real Commands**:
```typescript
// 1. Get branch cost
const cost = await get_cost({
  organization_id: "org-id",
  type: "branch"
})
// Example: { amount: 0.32, recurrence: "hourly" }

// 2. Confirm and create
const costConfirmation = await confirm_cost({
  type: "branch",
  recurrence: "hourly",
  amount: 0.32
})

const branch = await create_branch({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "chat-threading",
  confirm_cost_id: costConfirmation.id
})

// 3. Apply migrations to branch project_id (branch has its own ID)
await apply_migration({
  project_id: branch.project_id, // Use branch project ID
  name: "add_message_threads",
  query: `
    CREATE TABLE public.message_threads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      parent_message_id UUID REFERENCES public.messages(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
})

// 4. Test on branch
const testResults = await execute_sql({
  project_id: branch.project_id,
  query: "SELECT * FROM public.message_threads LIMIT 1"
})

// 5. Check advisors
const branchAdvisors = await get_advisors({
  project_id: branch.project_id,
  type: "security"
})

// 6. Merge if clean
if (branchAdvisors.length === 0) {
  await merge_branch({
    branch_id: branch.id
  })
}

// 7. Cleanup
await delete_branch({
  branch_id: branch.id
})
```

### Use Case 5: Automated Security Audit

**Scenario**: Weekly security check

**Workflow**:
```
1. Get all security advisors
   ’ get_advisors(type="security")

2. For each advisor, search docs for solution
   ’ search_docs(advisor.name)

3. Apply fixes via migrations
   ’ apply_migration(fix)

4. Verify advisors clear
   ’ get_advisors(type="security")

5. Log results to Task Master
   ’ task-master update-subtask
```

**Real Commands**:
```typescript
// 1. Get security advisors
const advisors = await get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "security"
})

// 2. Process each advisor
for (const advisor of advisors) {
  // Search for solution
  const docs = await search_docs({
    graphql_query: `
      query {
        searchDocs(query: "${advisor.name}", limit: 3) {
          nodes { title, href, content }
        }
      }
    `
  })

  // Log to console or Task Master
  console.log(`Issue: ${advisor.message}`)
  console.log(`Fix: ${advisor.remediation_url}`)
  console.log(`Docs:`, docs)
}

// 3. Example fix for missing RLS
await apply_migration({
  project_id: "asrzdtpyrdgyggqdfwwl",
  name: "fix_missing_rls_policies",
  query: `
    CREATE POLICY "authenticated_read_messages"
      ON public.messages FOR SELECT
      TO authenticated
      USING (true);
  `
})

// 4. Verify cleared
const newAdvisors = await get_advisors({
  project_id: "asrzdtpyrdgyggqdfwwl",
  type: "security"
})

console.log(`Issues fixed: ${advisors.length - newAdvisors.length}`)
console.log(`Remaining issues: ${newAdvisors.length}`)
```

## Client Configuration

### EventOS `.mcp.json`

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project=asrzdtpyrdgyggqdfwwl&features=database,docs,debugging,functions"
    }
  }
}
```

### Read-Only Audit Configuration

```json
{
  "mcpServers": {
    "supabase-readonly": {
      "url": "https://mcp.supabase.com/mcp?project=asrzdtpyrdgyggqdfwwl&readOnly=true&features=docs,debugging"
    }
  }
}
```

### Local Development

```json
{
  "mcpServers": {
    "supabase-local": {
      "url": "http://localhost:54321/mcp"
    }
  }
}
```

## Security Best Practices

1. **Never Connect to Production**: Always use development/staging projects
2. **Use Read-Only Mode**: For audits and exploration
3. **Limit Feature Groups**: Only enable what you need
4. **Project-Scoped**: Prevent access to other projects
5. **Manual Approval**: Require approval for mutations
6. **Validate Inputs**: Never trust user-provided SQL

## Summary

### Remote MCP Advantages
-  Simple setup (just one URL)
-  Secure OAuth2 authentication
-  Works with web-based AI agents
-  No Node.js or environment issues

### Most Useful Tools
1. **search_docs** - Up-to-date documentation
2. **get_advisors** - Automated security/performance linting
3. **apply_migration** - Safe schema changes
4. **get_logs** - Real-time debugging
5. **deploy_edge_function** - Serverless deployment

### EventOS Integration
- Apply auth schema from `00-auth-plan.md`
- Combine with database-operations plugin
- Integrate with Task Master workflow
- Enable self-healing patterns

## References

- [Supabase MCP Blog Post](https://supabase.com/blog/remote-mcp-server)
- [MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [Auth Plan](./00-auth-plan.md)
- [Plugin Plan](./05-plugin-supa.md)
