#!/usr/bin/env python3
"""
Qdrant MCP Implementation Script for EventOS
============================================

This script sets up and populates a Qdrant knowledge base for event management,
integrating with the MCP server for semantic search capabilities.

Usage:
    python qdrant-setup.py --setup          # Initial setup
    python qdrant-setup.py --populate       # Populate with sample data
    python qdrant-setup.py --test          # Test search functionality
    python qdrant-setup.py --upload-docs   # Upload existing documentation
"""

import os
import json
import uuid
import argparse
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

import openai
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from qdrant_client.http import models


@dataclass
class Article:
    """Represents a knowledge base article"""
    title: str
    content: str
    phase: str
    tags: List[str]
    roles: List[str]
    source: str
    language: str = "en"


class QdrantMCPSetup:
    """Main class for Qdrant MCP setup and management"""
    
    def __init__(self, qdrant_url: str, api_key: str, collection_name: str = "event-kb"):
        self.client = QdrantClient(url=qdrant_url, api_key=api_key)
        self.collection_name = collection_name
        self.embedding_model = "text-embedding-3-small"
        
        # Event phases for categorization
        self.event_phases = {
            "I.Inception": "Event ideas, feasibility, budgeting",
            "II.Planning": "Venues, logistics, branding",
            "III.Sponsorships": "ROI tracking, tiered packages", 
            "IV.Marketing": "Social media, WhatsApp automation",
            "V.Ticketing": "Stripe Connect, refunds, CRM",
            "VI.Pre-Event": "Staff, vendors, rehearsals",
            "VII.Live-Event": "Entry management, safety",
            "VIII.Post-Event": "Feedback, reporting, analytics"
        }
        
        # User roles for targeting
        self.user_roles = [
            "Organizer", "Finance", "Marketing", 
            "Sales", "Operations", "Attendee"
        ]
        
        # Technical tags
        self.technical_tags = [
            "stripe", "whatsapp", "supabase", "react", 
            "api", "auth", "analytics", "automation"
        ]

    def setup_collection(self) -> bool:
        """Create and configure the Qdrant collection"""
        try:
            print(f"🔧 Setting up collection '{self.collection_name}'...")
            
            # Recreate collection with optimal settings
            self.client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=768,  # OpenAI text-embedding-3-small
                    distance=Distance.COSINE
                )
            )
            
            print(f"✅ Collection '{self.collection_name}' created successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error creating collection: {e}")
            return False

    def get_embedding(self, text: str) -> List[float]:
        """Generate OpenAI embedding for text"""
        try:
            response = openai.embeddings.create(
                model=self.embedding_model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"❌ Error generating embedding: {e}")
            return []

    def create_sample_articles(self) -> List[Article]:
        """Create sample event management articles"""
        return [
            Article(
                title="Stripe Connect Setup for Event Payments",
                content="""
                Setting up Stripe Connect for event payments involves several key steps:
                
                1. **Create Stripe Account**: Register for a Stripe account and complete verification
                2. **Enable Connect**: Navigate to Connect settings and enable the platform
                3. **Configure Webhooks**: Set up webhook endpoints for payment events
                4. **Test Integration**: Use Stripe's test mode to verify functionality
                5. **Go Live**: Switch to live mode after successful testing
                
                Best practices include implementing proper error handling, 
                setting up monitoring for failed payments, and maintaining 
                compliance with local regulations.
                """,
                phase="V.Ticketing",
                tags=["stripe", "payments", "integration"],
                roles=["Finance", "Organizer"],
                source="stripe-connect-guide"
            ),
            
            Article(
                title="WhatsApp Marketing Automation for Events",
                content="""
                Automate your event marketing with WhatsApp Business API:
                
                1. **Setup WhatsApp Business**: Register and verify your business account
                2. **Create Message Templates**: Design approved message templates
                3. **Build Contact Lists**: Organize contacts by event interest and demographics
                4. **Schedule Campaigns**: Plan and schedule marketing messages
                5. **Track Engagement**: Monitor open rates, clicks, and conversions
                
                Key features include broadcast messaging, automated responses,
                and integration with CRM systems for lead management.
                """,
                phase="IV.Marketing",
                tags=["whatsapp", "marketing", "automation"],
                roles=["Marketing", "Organizer"],
                source="whatsapp-marketing-guide"
            ),
            
            Article(
                title="Sponsor ROI Tracking and Analytics",
                content="""
                Track and measure sponsor return on investment effectively:
                
                1. **Define KPIs**: Establish clear metrics for sponsor value
                2. **Data Collection**: Gather attendee demographics and engagement data
                3. **Analytics Dashboard**: Create visual reports for sponsors
                4. **Regular Reporting**: Provide monthly updates to sponsors
                5. **Optimization**: Use data to improve future sponsor packages
                
                Essential metrics include brand exposure, lead generation,
                social media reach, and direct sales attribution.
                """,
                phase="III.Sponsorships",
                tags=["sponsors", "roi", "analytics", "reporting"],
                roles=["Sales", "Finance", "Organizer"],
                source="sponsor-roi-guide"
            ),
            
            Article(
                title="Event Registration Form Best Practices",
                content="""
                Create effective event registration forms that maximize conversions:
                
                1. **Keep It Simple**: Minimize required fields to reduce friction
                2. **Mobile Optimization**: Ensure forms work perfectly on mobile devices
                3. **Clear CTAs**: Use compelling call-to-action buttons
                4. **Progress Indicators**: Show completion progress for multi-step forms
                5. **Validation**: Implement real-time form validation
                
                Additional tips include A/B testing different form layouts,
                offering multiple payment options, and providing clear
                cancellation and refund policies.
                """,
                phase="V.Ticketing",
                tags=["registration", "forms", "conversion", "ux"],
                roles=["Organizer", "Marketing"],
                source="registration-forms-guide"
            ),
            
            Article(
                title="Event Day Operations Checklist",
                content="""
                Comprehensive checklist for smooth event day operations:
                
                1. **Pre-Event Setup**: Arrive early to set up registration, signage, and AV
                2. **Staff Briefing**: Conduct team meeting with clear role assignments
                3. **Registration Management**: Ensure smooth attendee check-in process
                4. **Vendor Coordination**: Manage food, security, and other vendors
                5. **Emergency Procedures**: Have backup plans for common issues
                
                Critical areas include crowd management, safety protocols,
                communication systems, and contingency planning for
                weather or technical difficulties.
                """,
                phase="VII.Live-Event",
                tags=["operations", "checklist", "logistics", "safety"],
                roles=["Operations", "Organizer"],
                source="event-day-checklist"
            )
        ]

    def upload_articles(self, articles: List[Article]) -> bool:
        """Upload articles to Qdrant collection"""
        try:
            print(f"📤 Uploading {len(articles)} articles to Qdrant...")
            
            points = []
            for article in articles:
                # Generate embedding
                embedding = self.get_embedding(article.content)
                if not embedding:
                    continue
                
                # Create point
                point = PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embedding,
                    payload={
                        "title": article.title,
                        "content": article.content,
                        "phase": article.phase,
                        "tags": article.tags,
                        "roles": article.roles,
                        "source": article.source,
                        "language": article.language,
                        "created_at": "2025-01-17T00:00:00Z"
                    }
                )
                points.append(point)
            
            # Upload to Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            
            print(f"✅ Successfully uploaded {len(points)} articles!")
            return True
            
        except Exception as e:
            print(f"❌ Error uploading articles: {e}")
            return False

    def search_knowledge_base(self, query: str, limit: int = 5, 
                            phase: Optional[str] = None, 
                            role: Optional[str] = None) -> List[Dict]:
        """Search the knowledge base with optional filters"""
        try:
            # Generate query embedding
            query_embedding = self.get_embedding(query)
            if not query_embedding:
                return []
            
            # Build filter if needed
            query_filter = None
            if phase or role:
                must_conditions = []
                
                if phase:
                    must_conditions.append(
                        FieldCondition(key="phase", match=MatchValue(value=phase))
                    )
                
                if role:
                    must_conditions.append(
                        FieldCondition(key="roles", match=MatchValue(value=role))
                    )
                
                if must_conditions:
                    query_filter = Filter(must=must_conditions)
            
            # Search Qdrant
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                query_filter=query_filter,
                limit=limit,
                with_payload=True
            )
            
            return [
                {
                    "id": result.id,
                    "title": result.payload["title"],
                    "content": result.payload["content"],
                    "phase": result.payload["phase"],
                    "tags": result.payload["tags"],
                    "roles": result.payload["roles"],
                    "score": result.score
                }
                for result in results
            ]
            
        except Exception as e:
            print(f"❌ Error searching knowledge base: {e}")
            return []

    def test_search_queries(self):
        """Test various search queries to validate functionality"""
        test_queries = [
            ("How do I handle ticket refunds?", None, None),
            ("What's the best way to track sponsor ROI?", "III.Sponsorships", "Finance"),
            ("How to automate WhatsApp marketing?", "IV.Marketing", "Marketing"),
            ("Event day operations checklist", "VII.Live-Event", "Operations"),
            ("Stripe payment integration", "V.Ticketing", "Finance")
        ]
        
        print("\n🔍 Testing search functionality...")
        print("=" * 50)
        
        for query, phase, role in test_queries:
            print(f"\n📝 Query: {query}")
            if phase:
                print(f"   Phase: {phase}")
            if role:
                print(f"   Role: {role}")
            
            results = self.search_knowledge_base(query, limit=3, phase=phase, role=role)
            
            if results:
                for i, result in enumerate(results, 1):
                    print(f"   {i}. {result['title']} (Score: {result['score']:.3f})")
                    print(f"      Phase: {result['phase']} | Tags: {', '.join(result['tags'])}")
            else:
                print("   No results found")
        
        print("\n✅ Search testing completed!")

    def process_markdown_docs(self, docs_path: str) -> List[Article]:
        """Process existing markdown documentation"""
        articles = []
        docs_dir = Path(docs_path)
        
        if not docs_dir.exists():
            print(f"❌ Documentation path not found: {docs_path}")
            return articles
        
        print(f"📚 Processing documentation from: {docs_path}")
        
        for md_file in docs_dir.rglob("*.md"):
            if md_file.name.startswith(".") or "node_modules" in str(md_file):
                continue
            
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Extract title from filename or content
                title = md_file.stem.replace("-", " ").replace("_", " ").title()
                
                # Determine phase from content
                phase = self._determine_phase(content)
                
                # Extract tags
                tags = self._extract_tags(content)
                
                # Split long content into chunks
                chunks = self._split_content(content, max_length=800)
                
                for i, chunk in enumerate(chunks):
                    chunk_title = f"{title} - Part {i+1}" if len(chunks) > 1 else title
                    
                    articles.append(Article(
                        title=chunk_title,
                        content=chunk,
                        phase=phase,
                        tags=tags,
                        roles=["Organizer"],  # Default role
                        source=str(md_file.relative_to(docs_dir))
                    ))
                
            except Exception as e:
                print(f"⚠️  Error processing {md_file}: {e}")
                continue
        
        print(f"✅ Processed {len(articles)} articles from documentation")
        return articles

    def _determine_phase(self, content: str) -> str:
        """Determine event phase from content"""
        content_lower = content.lower()
        
        phase_keywords = {
            "I.Inception": ["budget", "feasibility", "idea", "concept", "planning"],
            "II.Planning": ["venue", "logistics", "branding", "design", "setup"],
            "III.Sponsorships": ["sponsor", "roi", "tier", "package", "partnership"],
            "IV.Marketing": ["marketing", "whatsapp", "social", "promotion", "campaign"],
            "V.Ticketing": ["ticket", "stripe", "payment", "registration", "checkout"],
            "VI.Pre-Event": ["staff", "vendor", "rehearsal", "preparation", "setup"],
            "VII.Live-Event": ["event", "day", "live", "entry", "safety", "operations"],
            "VIII.Post-Event": ["feedback", "report", "analytics", "follow-up", "survey"]
        }
        
        for phase, keywords in phase_keywords.items():
            if any(keyword in content_lower for keyword in keywords):
                return phase
        
        return "I.Inception"  # Default

    def _extract_tags(self, content: str) -> List[str]:
        """Extract relevant tags from content"""
        content_lower = content.lower()
        tags = []
        
        for tag in self.technical_tags:
            if tag in content_lower:
                tags.append(tag)
        
        return tags

    def _split_content(self, content: str, max_length: int = 800) -> List[str]:
        """Split long content into smaller chunks"""
        if len(content) <= max_length:
            return [content]
        
        # Simple splitting by paragraphs
        paragraphs = content.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for paragraph in paragraphs:
            if len(current_chunk) + len(paragraph) <= max_length:
                current_chunk += paragraph + '\n\n'
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = paragraph + '\n\n'
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks

    def generate_cursor_config(self) -> str:
        """Generate Cursor MCP configuration"""
        return f'''{{
  "mcpServers": {{
    "qdrant": {{
      "command": "uvx",
      "args": ["mcp-server-qdrant"],
      "env": {{
        "QDRANT_URL": "{os.getenv('QDRANT_URL', 'https://your-cluster.qdrant.tech')}",
        "QDRANT_API_KEY": "{os.getenv('QDRANT_API_KEY', 'your-api-key')}",
        "COLLECTION_NAME": "{self.collection_name}"
      }}
    }}
  }}
}}'''


def main():
    """Main function to run the setup script"""
    parser = argparse.ArgumentParser(description="Qdrant MCP Setup for EventOS")
    parser.add_argument("--setup", action="store_true", help="Initial setup")
    parser.add_argument("--populate", action="store_true", help="Populate with sample data")
    parser.add_argument("--test", action="store_true", help="Test search functionality")
    parser.add_argument("--upload-docs", type=str, help="Upload documentation from path")
    parser.add_argument("--qdrant-url", default=os.getenv("QDRANT_URL"), help="Qdrant URL")
    parser.add_argument("--api-key", default=os.getenv("QDRANT_API_KEY"), help="Qdrant API Key")
    parser.add_argument("--collection", default="event-kb", help="Collection name")
    
    args = parser.parse_args()
    
    # Validate required environment variables
    if not args.qdrant_url or not args.api_key:
        print("❌ Please set QDRANT_URL and QDRANT_API_KEY environment variables")
        print("   or use --qdrant-url and --api-key arguments")
        return
    
    # Initialize setup
    setup = QdrantMCPSetup(args.qdrant_url, args.api_key, args.collection)
    
    if args.setup:
        print("🚀 Setting up Qdrant MCP...")
        if setup.setup_collection():
            print("\n📋 Cursor MCP Configuration:")
            print(setup.generate_cursor_config())
            print("\n💡 Add this configuration to your .cursor/mcp.json file")
    
    if args.populate:
        print("📚 Populating with sample data...")
        articles = setup.create_sample_articles()
        setup.upload_articles(articles)
    
    if args.upload_docs:
        print(f"📁 Uploading documentation from: {args.upload_docs}")
        articles = setup.process_markdown_docs(args.upload_docs)
        setup.upload_articles(articles)
    
    if args.test:
        print("🧪 Testing search functionality...")
        setup.test_search_queries()
    
    if not any([args.setup, args.populate, args.test, args.upload_docs]):
        parser.print_help()


if __name__ == "__main__":
    main()
