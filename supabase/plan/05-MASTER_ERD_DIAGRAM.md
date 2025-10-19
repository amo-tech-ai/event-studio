# 🗺️ EventOS Master Entity Relationship Diagram

**Database Evolution:** Phase 0 → Phase 3
**Total Tables:** 48 (13 existing + 35 new)
**Version:** 1.0
**Last Updated:** 2025-01-17

---

## 📊 Complete Database Architecture

This document provides the complete entity relationship diagram for EventOS across all implementation phases, showing how tables relate to each other and evolve from MVP to advanced AI-powered platform.

---

## 🎨 ERD Legend

### Table Categories by Phase

| **Phase** | **Color Code** | **Table Count** | **Features** |
|-----------|---------------|----------------|--------------|
| **Phase 0 (Current)** | 🟦 Blue | 13 tables | Core MVP + Event Wizard |
| **Phase 1 (Months 1-3)** | 🟩 Green | 9 tables | Content AI, Marketing, Analytics, Chatbot |
| **Phase 2 (Months 4-6)** | 🟨 Yellow | 12 tables | Personalization, Networking, Sponsors |
| **Phase 3 (Months 7-12)** | 🟥 Red | 14 tables | Computer Vision, Voice AI, Predictive, Orchestration |

### Relationship Types
- **One-to-Many:** →
- **Many-to-Many:** ↔
- **One-to-One:** ═

---

## 📐 High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Phase 0: Core Platform"
        Events[🟦 Events]
        Users[🟦 Users/Auth]
        Orders[🟦 Orders]
        Attendees[🟦 Attendees]
        Tickets[🟦 Tickets]
        Payments[🟦 Payments]
        Venues[🟦 Venues]
        TicketTiers[🟦 Ticket Tiers]
        Sessions[🟦 Event Sessions]
        Bookings[🟦 Venue Bookings]
        Marketing[🟦 Marketing Campaigns]
        EmailTemplates[🟦 Email Templates]
        Dashboards[🟦 Event Dashboards]
    end

    subgraph "Phase 1: Core AI"
        AIContent[🟩 AI Generated Content]
        Templates[🟩 Content Templates]
        GenHistory[🟩 Generation History]
        Engagements[🟩 Attendee Engagements]
        DashboardSnapshots[🟩 Dashboard Metrics Snapshots]
        ChatLogs[🟩 Chatbot Logs]
        FAQ[🟩 FAQ Library]
        Knowledge[🟩 Knowledge Base Articles]
        PredictiveModels[🟩 Predictive Models]
    end

    subgraph "Phase 2: Personalization & Networking"
        AttendeePrefs[🟨 Attendee Preferences]
        SessionEmbeddings[🟨 Session Embeddings]
        AttendeeEmbeddings[🟨 Attendee Embeddings]
        RecommendHistory[🟨 Recommendation History]
        InteractionEvents[🟨 Interaction Events]
        NetworkingPrefs[🟨 Networking Preferences]
        Matches[🟨 Matches]
        Meetings[🟨 Meetings]
        ConnectionGoals[🟨 Connection Goals]
        Sponsors[🟨 Sponsors]
        Proposals[🟨 Sponsor Proposals]
        LeadScores[🟨 Sponsor Lead Scores]
    end

    subgraph "Phase 3: Advanced AI"
        FacialData[🟥 Facial Recognition Data]
        CheckInLogs[🟥 Check-in Logs]
        CrowdAnalytics[🟥 Crowd Analytics]
        Transcripts[🟥 Session Transcripts]
        TranslationCache[🟥 Translation Cache]
        SentimentScores[🟥 Sentiment Scores]
        Predictions[🟥 Predictions]
        Insights[🟥 Automated Insights]
        AgentMemory[🟥 Agent Memory]
        AgentTasks[🟥 Agent Tasks]
    end

    Events --> Orders
    Events --> Attendees
    Events --> Tickets
    Events --> Sessions
    Events --> AIContent
    Events --> Engagements
    Events --> Matches
    Events --> Sponsors
    Events --> CrowdAnalytics
    Events --> Transcripts

    Attendees --> AttendeePrefs
    Attendees --> AttendeeEmbeddings
    Attendees --> NetworkingPrefs
    Attendees --> FacialData
    Attendees --> SentimentScores

    Sessions --> SessionEmbeddings
    Sessions --> Transcripts

    Users -.-> Events
    Users -.-> Orders
    Users -.-> Attendees
```

---

## 🔷 Phase 0: Core Platform (13 Tables)

### Core Tables

```mermaid
erDiagram
    USERS ||--o{ EVENTS : "organizes"
    USERS ||--o{ ORDERS : "places"
    EVENTS ||--o{ ORDERS : "receives"
    EVENTS ||--o{ ATTENDEES : "has"
    EVENTS ||--o{ TICKETS : "includes"
    EVENTS ||--o{ PAYMENTS : "receives"
    EVENTS ||--o{ VENUES : "located_at"
    ORDERS ||--o{ TICKETS : "contains"
    ORDERS ||--|| PAYMENTS : "has"
    ATTENDEES ||--o{ TICKETS : "owns"

    USERS {
        uuid id PK
        string email
        string full_name
        enum role
        jsonb metadata
        timestamp created_at
    }

    EVENTS {
        uuid id PK
        uuid organizer_id FK
        string name
        text description
        timestamp start_at
        timestamp end_at
        uuid venue_id FK
        enum status
        enum visibility
        jsonb settings
    }

    ORDERS {
        uuid id PK
        string order_number
        uuid event_id FK
        uuid customer_id FK
        decimal total_amount
        enum status
        timestamp created_at
    }

    ATTENDEES {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        string email
        string full_name
        enum status
        jsonb profile_data
    }

    TICKETS {
        uuid id PK
        uuid order_id FK
        uuid event_id FK
        uuid attendee_id FK
        uuid tier_id FK
        string ticket_number
        enum status
    }

    PAYMENTS {
        uuid id PK
        uuid order_id FK
        decimal amount
        enum status
        string payment_method
        jsonb metadata
        timestamp paid_at
    }

    VENUES {
        uuid id PK
        string name
        text address
        point location
        integer capacity
        jsonb amenities
    }
```

### Event Wizard Tables

```mermaid
erDiagram
    EVENTS ||--o{ EVENT_SESSIONS : "includes"
    EVENTS ||--o{ TICKET_TIERS : "offers"
    EVENTS ||--o{ MARKETING_CAMPAIGNS : "runs"
    EVENTS ||--o{ WHATSAPP_CAMPAIGNS : "runs"
    EVENTS ||--o{ VENUE_BOOKINGS : "has"
    EVENTS ||--o{ EVENT_DASHBOARDS : "displays"
    MARKETING_CAMPAIGNS ||--o{ EMAIL_TEMPLATES : "uses"

    EVENT_SESSIONS {
        uuid id PK
        uuid event_id FK
        string title
        text description
        timestamp start_time
        timestamp end_time
        string location
        integer capacity
        jsonb speakers
    }

    TICKET_TIERS {
        uuid id PK
        uuid event_id FK
        string name
        text description
        decimal price
        integer quantity
        integer sold_count
        jsonb benefits
    }

    MARKETING_CAMPAIGNS {
        uuid id PK
        uuid event_id FK
        string name
        enum campaign_type
        enum status
        timestamp scheduled_for
        jsonb targeting
        jsonb metrics
    }

    EMAIL_TEMPLATES {
        uuid id PK
        string name
        text subject_line
        text body_html
        jsonb variables
    }

    WHATSAPP_CAMPAIGNS {
        uuid id PK
        uuid event_id FK
        string name
        text message_template
        enum status
        jsonb metrics
    }

    VENUE_BOOKINGS {
        uuid id PK
        uuid event_id FK
        uuid venue_id FK
        timestamp start_time
        timestamp end_time
        enum status
        decimal cost
    }

    EVENT_DASHBOARDS {
        uuid id PK
        uuid event_id FK
        jsonb metrics
        timestamp last_updated
    }
```

---

## 🟩 Phase 1: Core AI Features (9 Tables)

### Content AI & Marketing

```mermaid
erDiagram
    EVENTS ||--o{ AI_GENERATED_CONTENT : "has"
    CONTENT_TEMPLATES ||--o{ AI_GENERATED_CONTENT : "generates"
    USERS ||--o{ GENERATION_HISTORY : "creates"

    AI_GENERATED_CONTENT {
        uuid id PK
        uuid event_id FK
        uuid template_id FK
        enum content_type
        text prompt
        text generated_text
        string model_used
        integer tokens_used
        decimal quality_score
        timestamp created_at
    }

    CONTENT_TEMPLATES {
        uuid id PK
        string template_name
        enum category
        text system_prompt
        text user_prompt_template
        jsonb variables
        boolean active
    }

    GENERATION_HISTORY {
        uuid id PK
        uuid user_id FK
        uuid content_id FK
        timestamp request_timestamp
        boolean success
        text error_message
        integer user_feedback
        jsonb metadata
    }
```

### Analytics & Engagement

```mermaid
erDiagram
    EVENTS ||--o{ ATTENDEE_ENGAGEMENTS : "tracks"
    EVENTS ||--o{ DASHBOARD_METRICS_SNAPSHOTS : "monitors"
    ATTENDEES ||--o{ ATTENDEE_ENGAGEMENTS : "performs"
    EVENT_DASHBOARDS ||--o{ DASHBOARD_METRICS_SNAPSHOTS : "snapshots"
    EVENTS ||--o{ PREDICTIVE_MODELS : "predicts"

    ATTENDEE_ENGAGEMENTS {
        uuid id PK
        uuid event_id FK
        uuid attendee_id FK
        enum action_type
        timestamp timestamp
        jsonb metadata
        string ip_address
        string user_agent
    }

    DASHBOARD_METRICS_SNAPSHOTS {
        uuid id PK
        uuid event_id FK
        uuid dashboard_id FK
        timestamp snapshot_time
        jsonb metrics_json
        decimal engagement_score
        integer attendee_count
    }

    PREDICTIVE_MODELS {
        uuid id PK
        uuid event_id FK
        enum model_type
        string version
        jsonb parameters_json
        jsonb accuracy_metrics
        timestamp trained_at
    }
```

### Chatbot & Support

```mermaid
erDiagram
    EVENTS ||--o{ CHATBOT_LOGS : "supports"
    EVENTS ||--o{ FAQ_LIBRARY : "documents"
    ATTENDEES ||--o{ CHATBOT_LOGS : "chats"
    FAQ_LIBRARY ||--o{ KNOWLEDGE_BASE_ARTICLES : "expands"

    CHATBOT_LOGS {
        uuid id PK
        string conversation_id
        uuid attendee_id FK
        uuid event_id FK
        jsonb messages_json
        boolean resolved
        boolean escalated
        integer satisfaction_rating
        timestamp created_at
    }

    FAQ_LIBRARY {
        uuid id PK
        uuid event_id FK
        string question
        text answer
        enum category
        integer usage_count
        decimal relevance_score
    }

    KNOWLEDGE_BASE_ARTICLES {
        uuid id PK
        string title
        text content
        text[] keywords
        uuid[] related_faq_ids
        integer view_count
        timestamp updated_at
    }
```

---

## 🟨 Phase 2: Personalization & Networking (12 Tables)

### Personalization Engine

```mermaid
erDiagram
    ATTENDEES ||--o{ ATTENDEE_PREFERENCES : "has"
    ATTENDEES ||--o{ ATTENDEE_EMBEDDINGS : "represents"
    EVENT_SESSIONS ||--o{ SESSION_EMBEDDINGS : "represents"
    ATTENDEES ||--o{ RECOMMENDATION_HISTORY : "receives"
    ATTENDEES ||--o{ INTERACTION_EVENTS : "performs"

    ATTENDEE_PREFERENCES {
        uuid id PK
        uuid attendee_id FK
        enum preference_type
        text value
        decimal confidence_score
        timestamp last_updated
    }

    SESSION_EMBEDDINGS {
        uuid id PK
        uuid session_id FK
        vector embedding_vector
        timestamp generated_at
        string model_version
    }

    ATTENDEE_EMBEDDINGS {
        uuid id PK
        uuid attendee_id FK
        vector embedding_vector
        timestamp generated_at
        string model_version
    }

    RECOMMENDATION_HISTORY {
        uuid id PK
        uuid attendee_id FK
        enum item_type
        uuid item_id
        timestamp shown_at
        boolean clicked
        decimal relevance_score
    }

    INTERACTION_EVENTS {
        uuid id PK
        uuid attendee_id FK
        enum event_type
        uuid target_id
        timestamp timestamp
        jsonb context_data
    }
```

### Networking & Matchmaking

```mermaid
erDiagram
    ATTENDEES ||--o{ NETWORKING_PREFERENCES : "sets"
    ATTENDEES ||--o{ MATCHES : "matched_with"
    MATCHES ||--o{ MEETINGS : "leads_to"
    ATTENDEES ||--o{ CONNECTION_GOALS : "has"
    ATTENDEES ||--o{ NETWORKING_EVENTS : "participates"

    NETWORKING_PREFERENCES {
        uuid id PK
        uuid attendee_id FK
        text[] goals
        text[] industries_of_interest
        text[] roles_seeking
        jsonb availability
        boolean public_profile
    }

    MATCHES {
        uuid id PK
        uuid match_id
        uuid attendee_1_id FK
        uuid attendee_2_id FK
        decimal match_score
        text reason
        enum status
        timestamp created_at
    }

    MEETINGS {
        uuid id PK
        uuid match_id FK
        uuid organizer_id FK
        uuid invitee_id FK
        timestamp time_slot
        string location
        enum status
        text notes
    }

    CONNECTION_GOALS {
        uuid id PK
        uuid attendee_id FK
        enum goal_type
        text description
        integer priority
        boolean achieved
    }

    NETWORKING_EVENTS {
        uuid id PK
        uuid event_id FK
        enum activity_type
        timestamp start_time
        integer max_participants
        string matching_algorithm
    }
```

### Sponsor Management

```mermaid
erDiagram
    EVENTS ||--o{ SPONSORS : "attracts"
    SPONSORS ||--o{ SPONSOR_PROPOSALS : "receives"
    SPONSORS ||--o{ SPONSORSHIPS : "signs"
    SPONSORS ||--o{ FOLLOW_UP_SEQUENCES : "triggers"
    SPONSORSHIPS ||--o{ SPONSOR_DELIVERABLES : "includes"
    ATTENDEES ||--o{ SPONSOR_LEAD_SCORES : "scored_for"
    SPONSORS ||--o{ SPONSOR_LEAD_SCORES : "receives"

    SPONSORS {
        uuid id PK
        string company_name
        text industry
        text[] products
        text[] goals
        enum budget_tier
        jsonb contact_info
    }

    SPONSOR_PROPOSALS {
        uuid id PK
        uuid sponsor_id FK
        uuid event_id FK
        jsonb package_details
        decimal pricing
        enum status
        timestamp sent_at
    }

    SPONSOR_LEAD_SCORES {
        uuid id PK
        uuid attendee_id FK
        uuid sponsor_id FK
        decimal score
        jsonb scoring_factors
        enum temperature
        timestamp calculated_at
    }

    FOLLOW_UP_SEQUENCES {
        uuid id PK
        uuid sponsor_id FK
        string trigger_condition
        jsonb messages_array
        enum status
        integer active_leads
    }

    SPONSORSHIPS {
        uuid id PK
        uuid sponsor_id FK
        uuid event_id FK
        enum package_type
        decimal amount
        jsonb deliverables
        timestamp signed_at
    }

    SPONSOR_DELIVERABLES {
        uuid id PK
        uuid sponsorship_id FK
        enum type
        timestamp due_date
        enum status
        text proof_url
    }
```

---

## 🟥 Phase 3: Advanced AI (14 Tables)

### Computer Vision & Onsite Intelligence

```mermaid
erDiagram
    ATTENDEES ||--o{ FACIAL_RECOGNITION_DATA : "enrolled"
    ATTENDEES ||--o{ CHECK_IN_LOGS : "checks_in"
    EVENTS ||--o{ CHECK_IN_LOGS : "tracks"
    EVENTS ||--o{ CROWD_ANALYTICS : "monitors"
    EVENTS ||--o{ HEAT_MAP_DATA : "visualizes"
    EVENTS ||--o{ SECURITY_ALERTS : "flags"

    FACIAL_RECOGNITION_DATA {
        uuid id PK
        uuid attendee_id FK
        vector embedding_vector
        timestamp enrollment_date
        boolean consent_given
        timestamp consent_date
        timestamp expires_at
    }

    CHECK_IN_LOGS {
        uuid id PK
        uuid attendee_id FK
        uuid event_id FK
        timestamp timestamp
        string location
        enum method
        decimal confidence_score
        jsonb metadata
    }

    CROWD_ANALYTICS {
        uuid id PK
        uuid event_id FK
        string location
        timestamp timestamp
        integer people_count
        enum density_level
        decimal flow_rate
    }

    HEAT_MAP_DATA {
        uuid id PK
        uuid event_id FK
        string location_grid
        timestamp timestamp
        integer traffic_intensity
        jsonb heatmap_values
    }

    SECURITY_ALERTS {
        uuid id PK
        uuid event_id FK
        timestamp timestamp
        enum alert_type
        enum severity
        text description
        boolean resolved
    }
```

### Voice AI & Translation

```mermaid
erDiagram
    EVENT_SESSIONS ||--o{ SESSION_TRANSCRIPTS : "transcribed"
    SESSION_TRANSCRIPTS ||--o{ TRANSCRIPT_KEYWORDS : "extracted"
    SESSION_TRANSCRIPTS ||--o{ AUDIO_PROCESSING_JOBS : "processed"
    TRANSLATION_CACHE {
        uuid id PK
        text source_text
        string source_lang
        string target_lang
        text translated_text
        timestamp cached_at
        integer reuse_count
    }

    SESSION_TRANSCRIPTS {
        uuid id PK
        uuid session_id FK
        string language
        jsonb transcript_segments_json
        jsonb speaker_labels
        decimal accuracy_score
        timestamp generated_at
    }

    TRANSCRIPT_KEYWORDS {
        uuid id PK
        uuid session_id FK
        string keyword
        decimal relevance_score
        integer[] timestamp_mentions
    }

    AUDIO_PROCESSING_JOBS {
        uuid id PK
        uuid session_id FK
        enum status
        timestamp started_at
        timestamp completed_at
        text error_message
        jsonb metadata
    }
```

### Sentiment & Emotion Analysis

```mermaid
erDiagram
    ATTENDEES ||--o{ SENTIMENT_SCORES : "expresses"
    EVENT_SESSIONS ||--o{ SENTIMENT_SCORES : "measures"
    EVENT_SESSIONS ||--o{ ENGAGEMENT_SNAPSHOTS : "tracks"
    ATTENDEES ||--o{ FEEDBACK_ANALYSIS : "provides"

    SENTIMENT_SCORES {
        uuid id PK
        uuid attendee_id FK
        uuid session_id FK
        timestamp timestamp
        enum emotion_type
        decimal confidence
        enum source
        jsonb context
    }

    ENGAGEMENT_SNAPSHOTS {
        uuid id PK
        uuid session_id FK
        timestamp snapshot_time
        decimal avg_sentiment
        enum engagement_level
        integer attendee_count
        jsonb emotion_distribution
    }

    FEEDBACK_ANALYSIS {
        uuid id PK
        uuid attendee_id FK
        text feedback_text
        decimal sentiment_score
        text[] key_topics
        enum urgency
        timestamp analyzed_at
    }
```

### Predictive Analytics & AI Orchestration

```mermaid
erDiagram
    PREDICTIVE_MODELS ||--o{ PREDICTIONS : "generates"
    EVENTS ||--o{ PREDICTIONS : "forecasts"
    EVENTS ||--o{ AUTOMATED_INSIGHTS : "discovers"
    EVENTS ||--o{ SCENARIO_SIMULATIONS : "simulates"
    AGENT_MEMORY ||--o{ AGENT_TASKS : "informs"
    AGENT_TASKS ||--o{ AGENT_COMMUNICATIONS : "coordinates"
    AGENT_TASKS ||--o{ COORDINATION_SESSIONS : "participates"

    PREDICTIONS {
        uuid id PK
        uuid model_id FK
        uuid event_id FK
        enum prediction_type
        jsonb value
        decimal confidence
        timestamp created_at
        timestamp valid_until
    }

    AUTOMATED_INSIGHTS {
        uuid id PK
        uuid event_id FK
        enum insight_type
        text description
        decimal impact_score
        text action_recommended
        timestamp discovered_at
    }

    SCENARIO_SIMULATIONS {
        uuid id PK
        uuid event_id FK
        jsonb parameters_changed
        jsonb predicted_outcome
        decimal confidence
        timestamp simulated_at
    }

    AGENT_MEMORY {
        uuid id PK
        string agent_id
        enum memory_type
        jsonb content
        integer importance
        timestamp created_at
        timestamp expires_at
    }

    AGENT_TASKS {
        uuid id PK
        string agent_id
        uuid parent_task_id FK
        text description
        enum status
        integer priority
        jsonb result
        timestamp created_at
    }

    AGENT_COMMUNICATIONS {
        uuid id PK
        string from_agent
        string to_agent
        enum message_type
        jsonb content
        timestamp timestamp
    }

    COORDINATION_SESSIONS {
        uuid id PK
        text goal
        text[] participating_agents
        enum status
        jsonb outcome
        timestamp started_at
    }
```

---

## 🔗 Cross-Phase Relationships

### Key Integration Points

```mermaid
graph LR
    subgraph "Core Data"
        Events[Events]
        Attendees[Attendees]
        Sessions[Event Sessions]
    end

    subgraph "Phase 1: AI Content"
        AIContent[AI Generated Content]
        Engagements[Attendee Engagements]
        Chatbot[Chatbot Logs]
    end

    subgraph "Phase 2: Personalization"
        Prefs[Attendee Preferences]
        Matches[Matches]
        LeadScores[Sponsor Lead Scores]
    end

    subgraph "Phase 3: Advanced AI"
        Facial[Facial Recognition]
        Transcripts[Session Transcripts]
        Sentiment[Sentiment Scores]
        Predictions[Predictions]
    end

    Events --> AIContent
    Events --> Engagements
    Events --> Prefs
    Events --> LeadScores
    Events --> Facial
    Events --> Transcripts
    Events --> Predictions

    Attendees --> Engagements
    Attendees --> Chatbot
    Attendees --> Prefs
    Attendees --> Matches
    Attendees --> Facial
    Attendees --> Sentiment

    Sessions --> Transcripts
    Sessions --> Sentiment
```

---

## 📊 Database Statistics

### Table Count by Phase

| **Phase** | **Tables** | **Cumulative** | **% of Total** |
|-----------|-----------|---------------|----------------|
| Phase 0 (Current) | 13 | 13 | 27% |
| Phase 1 (AI Core) | +9 | 22 | 46% |
| Phase 2 (Personalization) | +12 | 34 | 71% |
| Phase 3 (Advanced AI) | +14 | 48 | 100% |

### Estimated Database Size

| **Metric** | **Phase 0** | **Phase 1** | **Phase 2** | **Phase 3** |
|------------|------------|------------|------------|------------|
| **Tables** | 13 | 22 | 34 | 48 |
| **Indexes** | 84 | ~130 | ~200 | ~250 |
| **Functions** | 20 | ~35 | ~50 | ~60 |
| **Triggers** | 21 | ~30 | ~40 | ~50 |
| **RLS Policies** | 54 | ~79 | ~114 | ~159 |
| **Rows/Month** | 100K | 250K | 500K | 1M+ |
| **Storage Growth** | 500 MB | 1.2 GB | 2.5 GB | 5+ GB |

---

## 🔐 Security Architecture

### RLS Policy Coverage

Every table has Row Level Security policies ensuring:

1. **Multi-tenant Isolation:** Users only see their own events
2. **Role-based Access:** Different permissions for organizers, attendees, admins
3. **Data Privacy:** Personal data only accessible to authorized users
4. **Biometric Protection:** Facial recognition data heavily restricted
5. **Audit Trail:** All sensitive access logged

### Sensitive Data Tables

| **Table** | **Sensitivity** | **Protection** |
|-----------|----------------|----------------|
| **facial_recognition_data** | CRITICAL | Encrypted, consent required, auto-expire |
| **sponsor_lead_scores** | HIGH | Sponsor-only access, attendee anonymized |
| **attendee_embeddings** | HIGH | Never exposed to frontend, server-only |
| **agent_memory** | MEDIUM | System access only, no user exposure |
| **sentiment_scores** | MEDIUM | Aggregated only, no individual tracking |

---

## 📈 Performance Optimization Strategy

### Indexing Strategy

| **Table Type** | **Index Type** | **Purpose** |
|---------------|---------------|------------|
| **Core Tables** | B-tree on foreign keys | Fast joins |
| **Embedding Tables** | IVFFlat vector indexes | Fast similarity search |
| **Time-series Tables** | BRIN on timestamps | Efficient range queries |
| **JSON Tables** | GIN on JSONB columns | Fast JSON queries |
| **Text Search** | GIN on tsvector | Full-text search |

### Partitioning Strategy (Future)

Tables that will benefit from partitioning:

- **check_in_logs:** Partition by event_id
- **attendee_engagements:** Partition by timestamp (monthly)
- **chatbot_logs:** Partition by timestamp (monthly)
- **sentiment_scores:** Partition by timestamp (weekly during events)

---

## 🎯 Migration Path

### Phase 0 → Phase 1

**New Tables:** 9
**Modified Tables:** 3 (marketing_campaigns, email_templates, event_dashboards)
**New Indexes:** ~46
**Estimated Downtime:** 0 minutes (all additive)

### Phase 1 → Phase 2

**New Tables:** 12
**Modified Tables:** 2 (attendees, orders)
**New Indexes:** ~70
**New Extensions:** pgvector
**Estimated Downtime:** 5 minutes (for pgvector installation)

### Phase 2 → Phase 3

**New Tables:** 14
**Modified Tables:** 0
**New Indexes:** ~50
**Estimated Downtime:** 0 minutes (all additive)

---

## 📝 Database Maintenance

### Recommended Practices

| **Task** | **Frequency** | **Purpose** |
|----------|--------------|------------|
| **VACUUM ANALYZE** | Daily | Reclaim space, update statistics |
| **Reindex** | Weekly | Maintain index performance |
| **Backup** | Hourly incremental, Daily full | Disaster recovery |
| **Monitor Query Performance** | Continuous | Identify slow queries |
| **Update Statistics** | After bulk operations | Query planner accuracy |
| **Archive Old Data** | Monthly | Keep database size manageable |

---

## 🎉 Conclusion

This master ERD represents the complete evolution of EventOS from a solid MVP platform to a comprehensive AI-powered event ecosystem. The database architecture is designed for:

✅ **Scalability:** Handles millions of rows efficiently
✅ **Security:** Multi-layer RLS and encryption
✅ **Performance:** Optimized indexes and queries
✅ **Flexibility:** JSONB for evolving requirements
✅ **AI-Ready:** Vector embeddings and ML integration
✅ **Compliance:** Privacy-first design with consent management

**The foundation is rock-solid. The future is intelligent. The architecture is ready.**

---

**Document Version:** 1.0
**Last Updated:** 2025-01-17
**Status:** ✅ Complete
**Previous:** [04-ADVANCED_IMPLEMENTATION_STRATEGY.md](./04-ADVANCED_IMPLEMENTATION_STRATEGY.md)
**Next:** [06-FLOW_DIAGRAMS.md](./06-FLOW_DIAGRAMS.md)
