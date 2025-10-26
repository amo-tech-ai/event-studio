# MCP Setup Reference

Quick reference for connecting Claude Code to external tools via Model Context Protocol (MCP).

## Basic Commands

### Add MCP Servers

```bash
# HTTP server (recommended for cloud services)
claude mcp add --transport http <name> <url>

# SSE server (deprecated, use HTTP when available)
claude mcp add --transport sse <name> <url>

# Local stdio server
claude mcp add --transport stdio <name> --env KEY=value -- <command>
```

### Manage Servers

```bash
claude mcp list              # List all configured servers
claude mcp get <name>        # Get details for a server
claude mcp remove <name>     # Remove a server
/mcp                         # Check status within Claude Code
```

## Configuration Scopes

- `--scope local` (default): Only you, only this project
- `--scope project`: Everyone in project (shared via .mcp.json)
- `--scope user`: You, across all projects

## Common Examples

### Supabase (HTTP with OAuth)

```bash
# Add server
claude mcp add --transport http supabase https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF

# Authenticate (within Claude Code)
/mcp
# Select Supabase and follow OAuth flow
```

### GitHub

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Use within Claude Code
> "Review PR #456"
> "Create issue for bug XYZ"
```

### Vercel

```bash
claude mcp add --transport http vercel https://mcp.vercel.com/

# Use within Claude Code
> "Deploy to production"
> "Check deployment logs"
```

### Notion

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Use within Claude Code
> "Update project roadmap page"
```

### Local Servers with Environment Variables

```bash
# Airtable
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server

# Custom server
claude mcp add --transport stdio myserver \
  --env API_KEY=value \
  --env API_URL=https://api.example.com \
  -- python /path/to/server.py
```

## Authentication

Many cloud MCP servers use OAuth 2.0:

1. Add the server: `claude mcp add --transport http <name> <url>`
2. Within Claude Code: `/mcp`
3. Select server and authenticate in browser
4. Tokens are stored securely and auto-refreshed

## Project Configuration (.mcp.json)

Share servers with your team via `.mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=${PROJECT_REF}",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

Environment variables use `${VAR}` or `${VAR:-default}` syntax.

## Using MCP Features

### Resources (@ mentions)

```
> Analyze @github:issue://123
> Compare @postgres:schema://users with @docs:file://schema
```

### Prompts (slash commands)

```
> /mcp__github__list_prs
> /mcp__github__pr_review 456
```

## Troubleshooting

### Server not connecting?

1. Check logs: `claude --debug`
2. Verify environment variables are set
3. For OAuth servers, re-authenticate: `/mcp`

### Environment variables not loading?

```bash
# Load .env and start Claude
export $(grep -v '^#' .env | xargs) && claude
```

### Reset project approvals

```bash
claude mcp reset-project-choices
```

## Configuration Files

- User config: `~/.claude.json`
- Project config: `/path/to/project/.mcp.json`
- Logs: `~/.cache/claude-cli-nodejs/-path-to-project/mcp-logs-<server>`
