# 🚀 Qdrant MCP Quick Reference

> **Essential commands and patterns for using Qdrant MCP server in Cursor**

---

## 🔧 MCP Server Configuration

### Basic Setup in `.cursor/mcp.json`
```json
{
  "mcpServers": {
    "qdrant": {
      "command": "uvx",
      "args": ["mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "https://your-cluster.qdrant.tech",
        "QDRANT_API_KEY": "your-api-key",
        "COLLECTION_NAME": "event-kb"
      }
    }
  }
}
```

### Docker Alternative
```json
{
  "mcpServers": {
    "qdrant": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "QDRANT_URL", "-e", "QDRANT_API_KEY", "-e", "COLLECTION_NAME", "mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "https://your-cluster.qdrant.tech",
        "QDRANT_API_KEY": "your-api-key",
        "COLLECTION_NAME": "event-kb"
      }
    }
  }
}
```

---

## 🎯 Available MCP Tools

### 1. **Search Knowledge Base**
```bash
# Basic semantic search
@qdrant search "how to handle ticket refunds"

# Search with filters
@qdrant search "sponsor ROI tracking" --phase="III.Sponsorships" --role="Finance"

# Advanced search with metadata
@qdrant search "WhatsApp automation" --tags="marketing,automation" --limit=10
```

### 2. **Store New Knowledge**
```bash
# Store single article
@qdrant store "Stripe Connect Setup" "Step-by-step guide for setting up Stripe Connect..." --tags="stripe,payments" --phase="V.Ticketing"

# Store with role targeting
@qdrant store "Sponsor ROI Calculator" "Excel template for tracking sponsor ROI..." --roles="Finance,Sales" --phase="III.Sponsorships"
```

### 3. **Collection Management**
```bash
# List all collections
@qdrant list-collections

# Get collection info
@qdrant collection-info event-kb

# Create new collection
@qdrant create-collection "marketing-kb" --vector-size=768
```

### 4. **Data Management**
```bash
# Delete specific points
@qdrant delete-points --ids="point1,point2"

# Update existing content
@qdrant update-point "point-id" --title="Updated Title" --content="New content..."

# Batch operations
@qdrant batch-upload --file="articles.json"
```

---

## 🔍 Search Patterns for EventOS

### **Code Search Patterns**
```bash
# React components
@qdrant search "React component for event registration form"

# API endpoints  
@qdrant search "Stripe webhook handler implementation"

# Database queries
@qdrant search "Supabase RLS policies for events table"

# Authentication
@qdrant search "user authentication with Supabase Auth"
```

### **Documentation Search**
```bash
# Technical documentation
@qdrant search "API documentation for event management"

# User guides
@qdrant search "how to create an event in the system"

# Troubleshooting
@qdrant search "common Stripe Connect issues and solutions"
```

### **Business Logic Search**
```bash
# Event management
@qdrant search "event lifecycle management workflow"

# Sponsor management
@qdrant search "sponsor tier management system"

# Marketing automation
@qdrant search "WhatsApp marketing campaign setup"

# Analytics
@qdrant search "event analytics and reporting dashboard"
```

---

## 🏷️ Metadata Tags for EventOS

### **Event Phases**
- `I.Inception` - Event ideas, feasibility, budgeting
- `II.Planning` - Venues, logistics, branding
- `III.Sponsorships` - ROI tracking, tiered packages
- `IV.Marketing` - Social media, WhatsApp automation
- `V.Ticketing` - Stripe Connect, refunds, CRM
- `VI.Pre-Event` - Staff, vendors, rehearsals
- `VII.Live-Event` - Entry management, safety
- `VIII.Post-Event` - Feedback, reporting, analytics

### **User Roles**
- `Organizer` - Event organizers and managers
- `Finance` - Financial operations and billing
- `Marketing` - Marketing and promotion teams
- `Sales` - Sales and sponsor relations
- `Operations` - Event operations and logistics
- `Attendee` - Event attendees and participants

### **Technical Tags**
- `stripe` - Payment processing
- `whatsapp` - WhatsApp integration
- `supabase` - Database and backend
- `react` - Frontend components
- `api` - API endpoints and services
- `auth` - Authentication and security
- `analytics` - Data analysis and reporting
- `automation` - Automated workflows

---

## 🎯 Usage Examples

### **For Developers**
```bash
# Find implementation examples
@qdrant search "React hook for event data fetching" --tags="react,hooks"

# Search for error solutions
@qdrant search "Stripe webhook signature verification error" --tags="stripe,debugging"

# Find best practices
@qdrant search "Supabase RLS policy examples for multi-tenant apps" --tags="supabase,security"
```

### **For Business Users**
```bash
# Find business processes
@qdrant search "how to calculate sponsor ROI" --phase="III.Sponsorships" --role="Finance"

# Marketing strategies
@qdrant search "WhatsApp marketing campaign best practices" --phase="IV.Marketing" --role="Marketing"

# Operational procedures
@qdrant search "event day operations checklist" --phase="VII.Live-Event" --role="Operations"
```

### **For Content Management**
```bash
# Store new documentation
@qdrant store "API Rate Limiting Guide" "Comprehensive guide to API rate limiting..." --tags="api,security" --phase="V.Ticketing"

# Update existing content
@qdrant update-point "stripe-setup-guide" --content="Updated Stripe Connect setup with new features..."

# Organize by categories
@qdrant search "all marketing content" --phase="IV.Marketing" --limit=20
```

---

## ⚡ Performance Tips

### **Optimize Search Queries**
```bash
# Use specific filters to narrow results
@qdrant search "payment processing" --phase="V.Ticketing" --tags="stripe"

# Limit results for faster responses
@qdrant search "React components" --limit=5

# Use role-based filtering
@qdrant search "financial reports" --role="Finance"
```

### **Batch Operations**
```bash
# Upload multiple articles at once
@qdrant batch-upload --file="event-articles.json" --batch-size=10

# Update multiple points
@qdrant batch-update --filter="phase:IV.Marketing" --updates="tags:marketing,automation"
```

---

## 🚨 Common Issues & Solutions

| Issue | Quick Fix |
|-------|-----------|
| **No search results** | Check collection name and data exists |
| **Low relevance scores** | Improve content quality and metadata |
| **Slow searches** | Use filters to narrow search space |
| **MCP connection failed** | Restart Cursor and check `.cursor/mcp.json` |
| **Empty collections** | Upload sample data first |

---

## 📊 Monitoring & Analytics

### **Check Collection Status**
```bash
# Get collection statistics
@qdrant collection-stats event-kb

# Check search performance
@qdrant search-performance --query="test query" --limit=5

# Monitor usage
@qdrant usage-stats --period="last-7-days"
```

---

## 🔄 Integration Patterns

### **With CopilotKit**
```typescript
// Use Qdrant search in CopilotKit actions
const searchKnowledge = async (query: string) => {
  // This would call the MCP server
  return await mcpClient.callTool('qdrant-search', { query });
};
```

### **With CrewAI**
```python
# Qdrant search tool for AI agents
def qdrant_search_tool(query: str) -> str:
    """Search knowledge base using Qdrant"""
    # Implementation would use MCP server
    pass
```

---

## 🎯 Best Practices

### **Content Organization**
- ✅ Use consistent phase tags
- ✅ Include relevant role targeting
- ✅ Add descriptive technical tags
- ✅ Keep content chunks under 800 words
- ✅ Include practical examples

### **Search Optimization**
- ✅ Use specific, descriptive queries
- ✅ Leverage filters for better results
- ✅ Test search quality regularly
- ✅ Update content based on search patterns
- ✅ Monitor performance metrics

### **Maintenance**
- ✅ Regular content updates
- ✅ Metadata consistency checks
- ✅ Search quality monitoring
- ✅ Performance optimization
- ✅ User feedback integration

---

**💡 Pro Tip**: Start with basic searches and gradually add more sophisticated filters and metadata as your knowledge base grows!
