# 🚀 Qdrant MCP Server Setup & Usage Guide

> **Quick Start**: Get Qdrant MCP server running in 5 minutes for semantic search over your codebase and documentation.

---

## 🎯 What This Guide Covers

- **MCP Server Setup**: Install and configure Qdrant MCP server
- **Cursor Integration**: Connect to Cursor IDE for AI-powered code search
- **EventOS Integration**: Set up semantic search for event management knowledge base
- **Real Examples**: Working code snippets and configurations

---

## 📋 Prerequisites

- **Qdrant Cloud Account** (free tier available)
- **Python 3.8+** with `uv` or `pip`
- **Cursor IDE** (for MCP integration)
- **OpenAI API Key** (for embeddings)

---

## 🛠️ Step 1: Install Qdrant MCP Server

### Option A: Using UVX (Recommended)
```bash
# Install globally with UVX
uvx mcp-server-qdrant

# Or install in project
uv add mcp-server-qdrant
```

### Option B: Using Docker
```bash
# Pull the Docker image
docker pull mcp-server-qdrant

# Run with environment variables
docker run -p 8000:8000 \
  -e QDRANT_URL="https://your-cluster.qdrant.tech" \
  -e QDRANT_API_KEY="your-api-key" \
  -e COLLECTION_NAME="event-kb" \
  mcp-server-qdrant
```

### Option C: From Source
```bash
# Clone the repository
git clone https://github.com/qdrant/mcp-server-qdrant.git
cd mcp-server-qdrant

# Install dependencies
uv install

# Run in development mode
COLLECTION_NAME=event-kb fastmcp dev src/mcp_server_qdrant/server.py
```

---

## 🔧 Step 2: Configure Qdrant Cloud

### Get Your Credentials
1. **Sign up** at [Qdrant Cloud](https://cloud.qdrant.io/)
2. **Create a cluster** (free tier: 1GB storage)
3. **Copy your credentials**:
   - Cluster URL: `https://your-cluster-id.qdrant.tech`
   - API Key: `your-api-key-here`

### Create Your First Collection
```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# Connect to Qdrant Cloud
client = QdrantClient(
    url="https://your-cluster-id.qdrant.tech",
    api_key="your-api-key-here"
)

# Create collection for event management KB
client.recreate_collection(
    collection_name="event-kb",
    vectors_config=VectorParams(
        size=768,  # OpenAI text-embedding-3-small
        distance=Distance.COSINE
    )
)

print("✅ Collection 'event-kb' created successfully!")
```

---

## 🎯 Step 3: Configure Cursor IDE

### Add to `.cursor/mcp.json`
```json
{
  "mcpServers": {
    "qdrant": {
      "command": "uvx",
      "args": ["mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "https://your-cluster-id.qdrant.tech",
        "QDRANT_API_KEY": "your-api-key-here",
        "COLLECTION_NAME": "event-kb",
        "EMBEDDING_MODEL": "text-embedding-3-small"
      }
    }
  }
}
```

### Alternative: Docker Configuration
```json
{
  "mcpServers": {
    "qdrant": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "QDRANT_URL",
        "-e", "QDRANT_API_KEY", 
        "-e", "COLLECTION_NAME",
        "mcp-server-qdrant"
      ],
      "env": {
        "QDRANT_URL": "https://your-cluster-id.qdrant.tech",
        "QDRANT_API_KEY": "your-api-key-here",
        "COLLECTION_NAME": "event-kb"
      }
    }
  }
}
```

---

## 📚 Step 4: Populate Your Knowledge Base

### Create Event Management Articles
```python
import json
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
import uuid
import openai

# Initialize clients
qdrant = QdrantClient(
    url="https://your-cluster-id.qdrant.tech",
    api_key="your-api-key-here"
)
openai.api_key = "your-openai-key"

def get_embedding(text):
    """Generate OpenAI embedding for text"""
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Sample event management articles
articles = [
    {
        "title": "How to Set Up Stripe Connect for Event Payments",
        "content": "Stripe Connect allows event organizers to receive payments directly...",
        "phase": "V.Ticketing",
        "tags": ["stripe", "payments", "finance"],
        "roles": ["Organizer", "Finance"]
    },
    {
        "title": "WhatsApp Marketing Automation for Events",
        "content": "Automate your event marketing with WhatsApp Business API...",
        "phase": "IV.Marketing", 
        "tags": ["whatsapp", "marketing", "automation"],
        "roles": ["Marketing", "Organizer"]
    },
    {
        "title": "Sponsor ROI Tracking Best Practices",
        "content": "Track and measure sponsor return on investment...",
        "phase": "III.Sponsorships",
        "tags": ["sponsors", "roi", "analytics"],
        "roles": ["Organizer", "Sales"]
    }
]

# Upload articles to Qdrant
points = []
for article in articles:
    # Generate embedding
    embedding = get_embedding(article["content"])
    
    # Create point
    point = PointStruct(
        id=str(uuid.uuid4()),
        vector=embedding,
        payload={
            "title": article["title"],
            "content": article["content"],
            "phase": article["phase"],
            "tags": article["tags"],
            "roles": article["roles"],
            "source": "event-management-kb"
        }
    )
    points.append(point)

# Upload to Qdrant
qdrant.upsert(
    collection_name="event-kb",
    points=points
)

print(f"✅ Uploaded {len(points)} articles to Qdrant!")
```

---

## 🔍 Step 5: Test Semantic Search

### Basic Search Test
```python
def search_knowledge_base(query, limit=5):
    """Search the knowledge base using natural language"""
    
    # Generate embedding for query
    query_embedding = get_embedding(query)
    
    # Search Qdrant
    results = qdrant.search(
        collection_name="event-kb",
        query_vector=query_embedding,
        limit=limit,
        with_payload=True
    )
    
    return results

# Test searches
queries = [
    "How do I handle ticket refunds?",
    "What's the best way to track sponsor ROI?",
    "How to automate WhatsApp marketing?"
]

for query in queries:
    print(f"\n🔍 Query: {query}")
    results = search_knowledge_base(query)
    
    for i, result in enumerate(results, 1):
        print(f"{i}. {result.payload['title']} (Score: {result.score:.3f})")
        print(f"   Phase: {result.payload['phase']}")
        print(f"   Tags: {', '.join(result.payload['tags'])}")
```

### Expected Output
```
🔍 Query: How do I handle ticket refunds?
1. How to Set Up Stripe Connect for Event Payments (Score: 0.847)
   Phase: V.Ticketing
   Tags: stripe, payments, finance

🔍 Query: What's the best way to track sponsor ROI?
1. Sponsor ROI Tracking Best Practices (Score: 0.923)
   Phase: III.Sponsorships
   Tags: sponsors, roi, analytics
```

---

## 🤖 Step 6: Integrate with AI Assistant

### Cursor Rules for Qdrant Usage
Create `.cursor/rules/qdrant.mdc`:

```markdown
# Qdrant MCP Integration Rules

## Core Principles
- **Semantic Search First**: Use Qdrant for code and documentation search
- **Context-Aware**: Always include relevant metadata in searches
- **Revenue-Focused**: Prioritize event management and business logic

## MCP Server Commands (Always Use First)
```bash
# Search for relevant code/documentation
@qdrant search "query" --limit=5

# Store new knowledge
@qdrant store "title" "content" --tags="tag1,tag2"

# List available collections
@qdrant list-collections
```

## Search Patterns
- **Code Search**: "React component for event registration"
- **Documentation**: "How to handle Stripe webhooks"
- **Business Logic**: "Sponsor tier management system"
- **Troubleshooting**: "Common Stripe Connect issues"

## Metadata Usage
- **Phase Filtering**: Use phase tags (I.Inception, V.Ticketing, etc.)
- **Role-Based**: Filter by user roles (Organizer, Finance, Marketing)
- **Language Support**: Support both English and Spanish content
```

---

## 🎯 Step 7: EventOS-Specific Setup

### Event Management Knowledge Base Structure
```python
# Event phases for your knowledge base
EVENT_PHASES = {
    "I.Inception": "Event ideas, feasibility, budgeting",
    "II.Planning": "Venues, logistics, branding", 
    "III.Sponsorships": "ROI tracking, tiered packages",
    "IV.Marketing": "Social media, WhatsApp automation",
    "V.Ticketing": "Stripe Connect, refunds, CRM",
    "VI.Pre-Event": "Staff, vendors, rehearsals",
    "VII.Live-Event": "Entry management, safety",
    "VIII.Post-Event": "Feedback, reporting, analytics"
}

# User roles for filtering
USER_ROLES = [
    "Organizer", "Finance", "Marketing", 
    "Sales", "Operations", "Attendee"
]

# Content tags for categorization
CONTENT_TAGS = [
    "stripe", "whatsapp", "sponsors", "ticketing",
    "marketing", "analytics", "automation", "roi"
]
```

### Populate from Existing Documentation
```python
import os
import markdown
from pathlib import Path

def process_markdown_docs(docs_path="mvpe/"):
    """Process existing markdown documentation"""
    
    articles = []
    for md_file in Path(docs_path).rglob("*.md"):
        if md_file.name.startswith("."):
            continue
            
        # Read markdown content
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract metadata from frontmatter
        title = md_file.stem.replace("-", " ").title()
        phase = determine_phase(content)
        tags = extract_tags(content)
        
        # Split long documents into chunks
        chunks = split_content(content, max_length=800)
        
        for i, chunk in enumerate(chunks):
            articles.append({
                "title": f"{title} - Part {i+1}",
                "content": chunk,
                "phase": phase,
                "tags": tags,
                "source": str(md_file),
                "roles": ["Organizer"]  # Default role
            })
    
    return articles

def determine_phase(content):
    """Determine event phase from content"""
    content_lower = content.lower()
    
    if any(word in content_lower for word in ["budget", "feasibility", "idea"]):
        return "I.Inception"
    elif any(word in content_lower for word in ["venue", "logistics", "planning"]):
        return "II.Planning"
    elif any(word in content_lower for word in ["sponsor", "roi", "tier"]):
        return "III.Sponsorships"
    elif any(word in content_lower for word in ["marketing", "whatsapp", "social"]):
        return "IV.Marketing"
    elif any(word in content_lower for word in ["ticket", "stripe", "payment"]):
        return "V.Ticketing"
    else:
        return "I.Inception"  # Default
```

---

## 🚀 Step 8: Advanced Usage Patterns

### Hybrid Search (Vector + Keyword)
```python
def hybrid_search(query, limit=5):
    """Combine semantic and keyword search"""
    
    # Semantic search
    semantic_results = qdrant.search(
        collection_name="event-kb",
        query_vector=get_embedding(query),
        limit=limit,
        with_payload=True
    )
    
    # Keyword search (if supported)
    keyword_results = qdrant.search(
        collection_name="event-kb", 
        query_vector=get_embedding(query),
        query_filter={
            "must": [
                {"key": "content", "match": {"text": query}}
            ]
        },
        limit=limit,
        with_payload=True
    )
    
    # Combine and deduplicate results
    all_results = semantic_results + keyword_results
    unique_results = {r.id: r for r in all_results}.values()
    
    return sorted(unique_results, key=lambda x: x.score, reverse=True)[:limit]
```

### Role-Based Filtering
```python
def search_for_role(query, user_role, limit=5):
    """Search content relevant to specific user role"""
    
    results = qdrant.search(
        collection_name="event-kb",
        query_vector=get_embedding(query),
        query_filter={
            "should": [
                {"key": "roles", "match": {"value": user_role}},
                {"key": "roles", "match": {"value": "Organizer"}}  # Always include organizer content
            ]
        },
        limit=limit,
        with_payload=True
    )
    
    return results
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **MCP server not connecting** | Check `.cursor/mcp.json` syntax and restart Cursor |
| **Empty search results** | Verify collection exists and has data |
| **Low search quality** | Improve content chunking and metadata |
| **Slow searches** | Optimize vector size and use filters |
| **API rate limits** | Implement exponential backoff |

### Debug Commands
```bash
# Test MCP server connection
curl -X POST http://localhost:8000/health

# Check Qdrant collection status
python -c "
from qdrant_client import QdrantClient
client = QdrantClient(url='YOUR_URL', api_key='YOUR_KEY')
print(client.get_collection('event-kb'))
"

# Test embeddings
python -c "
import openai
response = openai.embeddings.create(
    model='text-embedding-3-small',
    input='test query'
)
print(f'Embedding dimension: {len(response.data[0].embedding)}')
"
```

---

## 📊 Performance Optimization

### Collection Configuration
```python
# Optimize for your use case
client.recreate_collection(
    collection_name="event-kb",
    vectors_config=VectorParams(
        size=768,  # Match your embedding model
        distance=Distance.COSINE,  # Best for text similarity
        on_disk_payload=True  # Store metadata on disk for large collections
    ),
    optimizers_config=OptimizersConfig(
        default_segment_number=2,  # Parallel processing
        memmap_threshold=20000,    # Memory optimization
        indexing_threshold=20000   # Indexing optimization
    )
)
```

### Search Optimization
```python
# Use filters to reduce search space
def optimized_search(query, phase=None, role=None, limit=5):
    """Optimized search with filters"""
    
    query_filter = None
    if phase or role:
        query_filter = {"must": []}
        
        if phase:
            query_filter["must"].append({
                "key": "phase", 
                "match": {"value": phase}
            })
            
        if role:
            query_filter["must"].append({
                "key": "roles",
                "match": {"value": role}
            })
    
    return qdrant.search(
        collection_name="event-kb",
        query_vector=get_embedding(query),
        query_filter=query_filter,
        limit=limit,
        with_payload=True
    )
```

---

## ✅ Success Checklist

- [ ] **Qdrant Cloud account** created and cluster running
- [ ] **MCP server** installed and configured in Cursor
- [ ] **Collection created** with proper vector configuration
- [ ] **Sample data** uploaded and searchable
- [ ] **Cursor rules** configured for Qdrant usage
- [ ] **Test searches** returning relevant results
- [ ] **Performance optimized** for your use case

---

## 🎯 Next Steps

1. **Populate Knowledge Base**: Upload your existing documentation
2. **Create Search Interface**: Build user-friendly search UI
3. **Integrate with AI**: Connect to CopilotKit or CrewAI
4. **Monitor Performance**: Track search quality and speed
5. **Expand Content**: Add more articles and improve metadata

---

## 📚 Additional Resources

- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [MCP Server Repository](https://github.com/qdrant/mcp-server-qdrant)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Cursor MCP Documentation](https://cursor.sh/docs)

---

**Ready to build your semantic search system? Start with the basic setup and gradually add more sophisticated features!** 🚀
