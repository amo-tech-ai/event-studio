# 🧠 Qdrant MCP Integration for EventOS

> **Semantic search and knowledge management for event management platform**

This directory contains everything you need to set up and use Qdrant MCP server for semantic search over your event management knowledge base.

---

## 📁 File Structure

```
mvpe/qdrant/
├── README.md                           # This file
├── 01-Build a 500-Article Event Management.md  # Knowledge base strategy
├── 02-Qdrant-MCP-Setup-Guide.md        # Complete setup guide
├── 03-Qdrant-MCP-Quick-Reference.md   # Command reference
└── 04-Implementation-Script.py         # Automated setup script
```

---

## 🚀 Quick Start

### 1. **Prerequisites**
- Qdrant Cloud account (free tier available)
- Python 3.8+ with `uv` or `pip`
- OpenAI API key for embeddings
- Cursor IDE for MCP integration

### 2. **Environment Setup**
```bash
# Set your credentials
export QDRANT_URL="https://your-cluster.qdrant.tech"
export QDRANT_API_KEY="your-api-key"
export OPENAI_API_KEY="your-openai-key"

# Install dependencies
pip install qdrant-client openai
```

### 3. **Automated Setup**
```bash
# Run the setup script
python mvpe/qdrant/04-Implementation-Script.py --setup --populate --test

# Upload your existing documentation
python mvpe/qdrant/04-Implementation-Script.py --upload-docs mvpe/
```

### 4. **Configure Cursor IDE**
Add to `.cursor/mcp.json`:
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

---

## 📚 Documentation Guide

### **For Complete Setup**
👉 **[02-Qdrant-MCP-Setup-Guide.md](02-Qdrant-MCP-Setup-Guide.md)**
- Step-by-step installation
- Configuration examples
- Integration patterns
- Troubleshooting guide

### **For Quick Reference**
👉 **[03-Qdrant-MCP-Quick-Reference.md](03-Qdrant-MCP-Quick-Reference.md)**
- MCP commands
- Search patterns
- Usage examples
- Performance tips

### **For Knowledge Base Strategy**
👉 **[01-Build a 500-Article Event Management.md](01-Build%20a%20500-Article%20Event%20Management.md)**
- Content organization
- Metadata structure
- Best practices
- Real-world examples

---

## 🎯 Use Cases for EventOS

### **1. Code Search & Documentation**
```bash
# Find React components
@qdrant search "React component for event registration form"

# Search API documentation
@qdrant search "Stripe webhook handler implementation"

# Find troubleshooting guides
@qdrant search "common Supabase RLS issues"
```

### **2. Business Process Knowledge**
```bash
# Event management workflows
@qdrant search "event lifecycle management" --phase="II.Planning"

# Sponsor management
@qdrant search "sponsor ROI tracking" --role="Finance"

# Marketing automation
@qdrant search "WhatsApp campaign setup" --phase="IV.Marketing"
```

### **3. Content Management**
```bash
# Store new knowledge
@qdrant store "API Rate Limiting Guide" "Comprehensive guide..." --tags="api,security"

# Update existing content
@qdrant update-point "stripe-guide" --content="Updated with new features..."

# Organize by categories
@qdrant search "all marketing content" --phase="IV.Marketing"
```

---

## 🏷️ Content Organization

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

## 🔧 Implementation Script

The `04-Implementation-Script.py` provides automated setup:

```bash
# Basic setup
python 04-Implementation-Script.py --setup

# Populate with sample data
python 04-Implementation-Script.py --populate

# Test search functionality
python 04-Implementation-Script.py --test

# Upload existing documentation
python 04-Implementation-Script.py --upload-docs mvpe/

# All at once
python 04-Implementation-Script.py --setup --populate --test
```

### **Script Features**
- ✅ Automated collection setup
- ✅ Sample data generation
- ✅ Documentation processing
- ✅ Search testing
- ✅ Cursor configuration generation
- ✅ Error handling and validation

---

## 🎯 Integration Patterns

### **With CopilotKit**
```typescript
// Use Qdrant search in CopilotKit actions
const searchKnowledge = async (query: string) => {
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

### **With Supabase Edge Functions**
```typescript
// Edge function for knowledge search
export default async function handler(req: Request) {
  const { query } = await req.json();
  
  // Call Qdrant MCP server
  const results = await searchKnowledgeBase(query);
  
  return new Response(JSON.stringify(results));
}
```

---

## 📊 Performance & Monitoring

### **Search Optimization**
- Use specific filters to narrow results
- Limit results for faster responses
- Leverage role-based filtering
- Implement caching for frequent queries

### **Content Quality**
- Regular content updates
- Metadata consistency checks
- Search quality monitoring
- User feedback integration

### **Monitoring Commands**
```bash
# Check collection status
@qdrant collection-stats event-kb

# Test search performance
@qdrant search-performance --query="test query"

# Monitor usage
@qdrant usage-stats --period="last-7-days"
```

---

## 🚨 Troubleshooting

### **Common Issues**

| Issue | Solution |
|-------|----------|
| **MCP server not connecting** | Check `.cursor/mcp.json` syntax and restart Cursor |
| **Empty search results** | Verify collection exists and has data |
| **Low search quality** | Improve content chunking and metadata |
| **Slow searches** | Optimize vector size and use filters |
| **API rate limits** | Implement exponential backoff |

### **Debug Commands**
```bash
# Test MCP server connection
curl -X POST http://localhost:8000/health

# Check Qdrant collection status
python -c "
from qdrant_client import QdrantClient
client = QdrantClient(url='YOUR_URL', api_key='YOUR_KEY')
print(client.get_collection('event-kb'))
"
```

---

## 🎯 Success Metrics

### **Technical Metrics**
- ✅ Search response time < 500ms
- ✅ Search relevance score > 0.8
- ✅ Collection uptime > 99.9%
- ✅ API rate limit compliance

### **Business Metrics**
- ✅ Knowledge base growth (articles/month)
- ✅ Search usage patterns
- ✅ Content update frequency
- ✅ User satisfaction scores

---

## 📚 Additional Resources

- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [MCP Server Repository](https://github.com/qdrant/mcp-server-qdrant)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Cursor MCP Documentation](https://cursor.sh/docs)

---

## 🤝 Contributing

1. **Add new content**: Use the implementation script to upload new articles
2. **Improve search**: Update metadata and tags for better results
3. **Test functionality**: Run search tests regularly
4. **Monitor performance**: Track metrics and optimize as needed

---

**Ready to build your semantic search system? Start with the setup guide and gradually add more sophisticated features!** 🚀
