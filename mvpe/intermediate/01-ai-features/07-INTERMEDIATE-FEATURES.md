# 🧠 Phase 2: Intermediate AI Features

**Timeline:** Months 4-6
**Goal:** Add intelligence layer - personalization, prediction, optimization
**Status:** Ready for implementation after Phase 1

---

## 📊 **Phase 2 Overview**

### **Why These Features Second:**
1. ✅ **Build on MVP** - Requires data from Phase 1 operations
2. ✅ **High Differentiation** - Features competitors lack
3. ✅ **Network Effects** - Value increases with usage
4. ✅ **Revenue Impact** - Direct sponsor and attendee value

### **Core Features:**
- **Recommendation Agent** - Personalized session and content suggestions
- **Networking Agent** - AI-powered matchmaking and introductions
- **Sponsorship AI Agent** - Sponsor matching and ROI optimization
- **Sales AI Agent** - Lead scoring and CRM integration

---

## 🎯 **Feature 1: Personalization & Recommendations**

### **What It Does:**
Provides intelligent, personalized recommendations to enhance attendee experience:
- Session recommendations based on interests and behavior
- Personalized agenda building
- Exhibitor and networking suggestions
- Content personalization across platform

### **Implementation:**
```
Technology Stack:
├── Collaborative Filtering (user-user, item-item)
├── Vector Embeddings (OpenAI ada-002 / sentence-transformers)
├── Supabase pgvector Extension (vector similarity search)
├── Real-time Recommendation Engine
└── A/B Testing Framework (for optimization)
```

### **Database Schema:**

#### **attendee_preferences table**
```sql
-- Store attendee interests and preferences
CREATE TABLE public.attendee_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Explicit preferences (user-provided)
  preferred_topics TEXT[] DEFAULT '{}',
  preferred_formats TEXT[] DEFAULT '{}', -- ['workshop', 'panel', 'keynote']
  industry_interests TEXT[] DEFAULT '{}',
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),

  -- Implicit preferences (derived from behavior)
  browsed_sessions UUID[] DEFAULT '{}',
  bookmarked_sessions UUID[] DEFAULT '{}',
  attended_sessions UUID[] DEFAULT '{}',
  interaction_history JSONB DEFAULT '{}'::jsonb,

  -- Recommendation settings
  recommendation_enabled BOOLEAN DEFAULT TRUE,
  notification_preferences JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(attendee_id, event_id)
);

-- Indexes for performance
CREATE INDEX idx_attendee_preferences_attendee ON public.attendee_preferences(attendee_id);
CREATE INDEX idx_attendee_preferences_event ON public.attendee_preferences(event_id);
CREATE INDEX idx_attendee_preferences_topics ON public.attendee_preferences USING GIN(preferred_topics);
CREATE INDEX idx_attendee_preferences_history ON public.attendee_preferences USING GIN(interaction_history);

-- RLS Policies
ALTER TABLE public.attendee_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendees can view their own preferences"
  ON public.attendee_preferences FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = attendee_id);

CREATE POLICY "Attendees can update their own preferences"
  ON public.attendee_preferences FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = attendee_id);

CREATE POLICY "Attendees can insert their own preferences"
  ON public.attendee_preferences FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = attendee_id);
```

#### **session_embeddings table**
```sql
-- Store vector embeddings for sessions (for similarity search)
CREATE TABLE public.session_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Vector embedding (1536 dimensions for OpenAI ada-002)
  embedding VECTOR(1536) NOT NULL,

  -- Source text used for embedding
  source_text TEXT NOT NULL,
  embedding_model TEXT DEFAULT 'text-embedding-ada-002',

  -- Metadata for filtering
  topics TEXT[] DEFAULT '{}',
  format TEXT,
  difficulty_level TEXT,

  -- Tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(session_id)
);

-- Vector similarity index (HNSW for fast approximate nearest neighbor search)
CREATE INDEX idx_session_embeddings_vector ON public.session_embeddings
USING hnsw (embedding vector_cosine_ops);

-- Standard indexes
CREATE INDEX idx_session_embeddings_session ON public.session_embeddings(session_id);
CREATE INDEX idx_session_embeddings_event ON public.session_embeddings(event_id);
CREATE INDEX idx_session_embeddings_topics ON public.session_embeddings USING GIN(topics);

-- RLS Policies
ALTER TABLE public.session_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view session embeddings for published events"
  ON public.session_embeddings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = session_embeddings.event_id
      AND status = 'published'
    )
  );

CREATE POLICY "Organizers can manage session embeddings"
  ON public.session_embeddings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = session_embeddings.event_id
      AND organizer_id = (SELECT auth.uid())
    )
  );
```

#### **recommendation_history table**
```sql
-- Track recommendations shown and user responses
CREATE TABLE public.recommendation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Recommendation details
  recommended_item_type TEXT NOT NULL CHECK (recommended_item_type IN (
    'session', 'exhibitor', 'networking_match', 'content'
  )),
  recommended_item_id UUID NOT NULL,
  recommendation_algorithm TEXT NOT NULL, -- 'collaborative_filtering', 'content_based', 'hybrid'
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),

  -- User response
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  bookmarked BOOLEAN DEFAULT FALSE,
  attended BOOLEAN DEFAULT FALSE,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),

  -- Context
  recommendation_context JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_recommendation_history_attendee ON public.recommendation_history(attendee_id);
CREATE INDEX idx_recommendation_history_event ON public.recommendation_history(event_id);
CREATE INDEX idx_recommendation_history_shown_at ON public.recommendation_history(shown_at DESC);
CREATE INDEX idx_recommendation_history_context ON public.recommendation_history USING GIN(recommendation_context);

-- RLS Policies
ALTER TABLE public.recommendation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendees can view their own recommendation history"
  ON public.recommendation_history FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = attendee_id);

CREATE POLICY "System can insert recommendations"
  ON public.recommendation_history FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Attendees can update their recommendation responses"
  ON public.recommendation_history FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = attendee_id);
```

### **Recommendation Functions:**

```sql
-- Generate session recommendations for an attendee
CREATE OR REPLACE FUNCTION public.get_session_recommendations(
  p_attendee_id UUID,
  p_event_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  session_id UUID,
  session_title TEXT,
  similarity_score NUMERIC,
  recommendation_reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_preference_embedding VECTOR(1536);
BEGIN
  -- Get attendee's preference vector (simplified - in production, combine multiple signals)
  SELECT embedding INTO v_preference_embedding
  FROM public.attendee_preferences ap
  JOIN public.session_embeddings se ON se.session_id = ANY(ap.bookmarked_sessions)
  WHERE ap.attendee_id = p_attendee_id
  AND ap.event_id = p_event_id
  LIMIT 1;

  -- If no preferences yet, return popular sessions
  IF v_preference_embedding IS NULL THEN
    RETURN QUERY
    SELECT
      s.id AS session_id,
      s.title AS session_title,
      0.5::NUMERIC AS similarity_score,
      'Popular session' AS recommendation_reason
    FROM public.sessions s
    WHERE s.event_id = p_event_id
    ORDER BY s.registration_count DESC NULLS LAST
    LIMIT p_limit;
    RETURN;
  END IF;

  -- Return sessions with highest vector similarity
  RETURN QUERY
  SELECT
    s.id AS session_id,
    s.title AS session_title,
    (1 - (se.embedding <=> v_preference_embedding))::NUMERIC AS similarity_score,
    'Based on your interests' AS recommendation_reason
  FROM public.sessions s
  JOIN public.session_embeddings se ON se.session_id = s.id
  WHERE s.event_id = p_event_id
  AND s.id NOT IN (
    -- Exclude already attended/bookmarked sessions
    SELECT UNNEST(ap.attended_sessions || ap.bookmarked_sessions)
    FROM public.attendee_preferences ap
    WHERE ap.attendee_id = p_attendee_id AND ap.event_id = p_event_id
  )
  ORDER BY similarity_score DESC
  LIMIT p_limit;
END;
$$;
```

### **API Endpoints:**
- `GET /api/recommendations/sessions/{event_id}` - Get personalized session recommendations
- `GET /api/recommendations/agenda/{event_id}` - Get AI-generated agenda
- `POST /api/preferences/{attendee_id}` - Update attendee preferences
- `POST /api/recommendations/feedback` - Submit recommendation feedback
- `GET /api/recommendations/similar/{session_id}` - Find similar sessions

### **Example Usage:**
```typescript
// Get personalized recommendations
const response = await fetch(`/api/recommendations/sessions/${eventId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { recommendations } = await response.json();
/*
[
  {
    session_id: "uuid",
    title: "Advanced AI in Event Tech",
    similarity_score: 0.92,
    reason: "Based on your interests in AI and automation",
    time_slot: "2025-11-15T14:00:00Z"
  },
  ...
]
*/
```

### **Success Metrics:**
- ✅ 70%+ attendees engage with recommendations
- ✅ 40% increase in session attendance
- ✅ 30% improvement in attendee satisfaction
- ✅ 50% reduction in "I wish I knew about this" feedback

---

## 🤝 **Feature 2: AI Networking & Matchmaking**

### **What It Does:**
Intelligently connects attendees based on shared interests, goals, and compatibility:
- AI-powered attendee matching
- Smart introduction suggestions
- Automated meeting scheduling
- Networking quality scoring

### **Implementation:**
```
Technology Stack:
├── Graph Algorithms (for network analysis)
├── ML Compatibility Models (similarity + complementarity scoring)
├── Real-time Matching Engine
├── Meeting Scheduler (with conflict detection)
└── WebSocket (for real-time match notifications)
```

### **Database Schema:**

#### **networking_preferences table**
```sql
-- Store attendee networking goals and preferences
CREATE TABLE public.networking_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Networking goals
  looking_for TEXT[] DEFAULT '{}', -- ['investors', 'partners', 'customers', 'mentors', 'talent']
  can_offer TEXT[] DEFAULT '{}', -- ['investment', 'expertise', 'connections', 'opportunities']

  -- Professional details
  industry TEXT,
  company_stage TEXT CHECK (company_stage IN ('idea', 'startup', 'growth', 'enterprise')),
  role_category TEXT CHECK (role_category IN ('founder', 'executive', 'manager', 'individual_contributor', 'investor', 'other')),
  years_experience INTEGER,

  -- Matching preferences
  prefer_same_industry BOOLEAN DEFAULT FALSE,
  prefer_complementary_skills BOOLEAN DEFAULT TRUE,
  meeting_duration_preference INTEGER DEFAULT 15, -- minutes
  max_meetings_per_day INTEGER DEFAULT 5,

  -- Availability
  availability_slots JSONB DEFAULT '[]'::jsonb, -- [{start: "14:00", end: "15:00", date: "2025-11-15"}]

  -- Settings
  networking_enabled BOOLEAN DEFAULT TRUE,
  auto_accept_matches BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(attendee_id, event_id)
);

-- Indexes
CREATE INDEX idx_networking_preferences_attendee ON public.networking_preferences(attendee_id);
CREATE INDEX idx_networking_preferences_event ON public.networking_preferences(event_id);
CREATE INDEX idx_networking_preferences_looking_for ON public.networking_preferences USING GIN(looking_for);
CREATE INDEX idx_networking_preferences_can_offer ON public.networking_preferences USING GIN(can_offer);

-- RLS Policies
ALTER TABLE public.networking_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendees can view their own networking preferences"
  ON public.networking_preferences FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = attendee_id);

CREATE POLICY "Attendees can update their own networking preferences"
  ON public.networking_preferences FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = attendee_id);

CREATE POLICY "Attendees can insert their own networking preferences"
  ON public.networking_preferences FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = attendee_id);
```

#### **matches table**
```sql
-- Store AI-generated matches between attendees
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Match participants
  attendee_1_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  attendee_2_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,

  -- Match quality
  compatibility_score NUMERIC(3,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  matching_algorithm TEXT NOT NULL, -- 'interest_based', 'goal_based', 'graph_based', 'hybrid'
  match_reasons JSONB DEFAULT '[]'::jsonb, -- ["Both interested in AI", "Complementary skills"]

  -- Match status
  status TEXT DEFAULT 'suggested' CHECK (status IN (
    'suggested', 'accepted_by_1', 'accepted_by_2', 'mutual_accepted', 'declined', 'expired'
  )),
  suggested_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),

  -- Meeting details (if scheduled)
  meeting_scheduled BOOLEAN DEFAULT FALSE,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL,

  -- Feedback
  feedback_1 JSONB DEFAULT '{}'::jsonb, -- Rating and comments from attendee_1
  feedback_2 JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate matches
  UNIQUE(event_id, attendee_1_id, attendee_2_id),
  CHECK (attendee_1_id < attendee_2_id) -- Enforce ordering to prevent duplicates
);

-- Indexes
CREATE INDEX idx_matches_event ON public.matches(event_id);
CREATE INDEX idx_matches_attendee_1 ON public.matches(attendee_1_id);
CREATE INDEX idx_matches_attendee_2 ON public.matches(attendee_2_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_score ON public.matches(compatibility_score DESC);
CREATE INDEX idx_matches_suggested_at ON public.matches(suggested_at DESC);

-- RLS Policies
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendees can view their own matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = attendee_1_id
    OR (SELECT auth.uid()) = attendee_2_id
  );

CREATE POLICY "Attendees can update their own match status"
  ON public.matches FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = attendee_1_id
    OR (SELECT auth.uid()) = attendee_2_id
  );

CREATE POLICY "System can create matches"
  ON public.matches FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);
```

#### **meetings table**
```sql
-- Store scheduled networking meetings
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,

  -- Participants
  attendee_1_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  attendee_2_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,

  -- Meeting details
  title TEXT NOT NULL,
  meeting_type TEXT DEFAULT 'networking' CHECK (meeting_type IN ('networking', 'business', 'mentorship', 'casual')),

  -- Schedule
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (scheduled_end - scheduled_start))/60
  ) STORED,

  -- Location
  location_type TEXT DEFAULT 'virtual' CHECK (location_type IN ('virtual', 'onsite', 'hybrid')),
  location_details JSONB DEFAULT '{}'::jsonb, -- {room: "Hall A", table: "5"} or {zoom_link: "..."}

  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
  )),

  -- Reminders
  reminder_sent_1 BOOLEAN DEFAULT FALSE,
  reminder_sent_2 BOOLEAN DEFAULT FALSE,

  -- Post-meeting
  completed_at TIMESTAMPTZ,
  feedback_1 JSONB DEFAULT '{}'::jsonb,
  feedback_2 JSONB DEFAULT '{}'::jsonb,
  follow_up_requested_1 BOOLEAN DEFAULT FALSE,
  follow_up_requested_2 BOOLEAN DEFAULT FALSE,

  -- Notes (private to each participant)
  notes_1 TEXT,
  notes_2 TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CHECK (scheduled_end > scheduled_start),
  CHECK (attendee_1_id != attendee_2_id)
);

-- Indexes
CREATE INDEX idx_meetings_event ON public.meetings(event_id);
CREATE INDEX idx_meetings_attendee_1 ON public.meetings(attendee_1_id);
CREATE INDEX idx_meetings_attendee_2 ON public.meetings(attendee_2_id);
CREATE INDEX idx_meetings_scheduled_start ON public.meetings(scheduled_start);
CREATE INDEX idx_meetings_status ON public.meetings(status);

-- RLS Policies
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendees can view their own meetings"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = attendee_1_id
    OR (SELECT auth.uid()) = attendee_2_id
  );

CREATE POLICY "Attendees can update their own meetings"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = attendee_1_id
    OR (SELECT auth.uid()) = attendee_2_id
  );

CREATE POLICY "Attendees can insert meetings"
  ON public.meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = attendee_1_id
    OR (SELECT auth.uid()) = attendee_2_id
  );
```

### **Matching Functions:**

```sql
-- Generate AI matches for an attendee
CREATE OR REPLACE FUNCTION public.generate_networking_matches(
  p_attendee_id UUID,
  p_event_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  match_id UUID,
  other_attendee_id UUID,
  other_attendee_name TEXT,
  compatibility_score NUMERIC,
  match_reasons JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_looking_for TEXT[];
  v_can_offer TEXT[];
BEGIN
  -- Get attendee's networking goals
  SELECT looking_for, can_offer
  INTO v_looking_for, v_can_offer
  FROM public.networking_preferences
  WHERE attendee_id = p_attendee_id AND event_id = p_event_id;

  -- Find complementary matches
  RETURN QUERY
  SELECT
    gen_random_uuid() AS match_id,
    a.id AS other_attendee_id,
    a.full_name AS other_attendee_name,
    (
      -- Compatibility calculation (simplified)
      GREATEST(
        (SELECT COUNT(*) FROM UNNEST(v_looking_for) looking WHERE looking = ANY(np.can_offer))::NUMERIC / NULLIF(array_length(v_looking_for, 1), 0),
        (SELECT COUNT(*) FROM UNNEST(v_can_offer) offering WHERE offering = ANY(np.looking_for))::NUMERIC / NULLIF(array_length(v_can_offer, 1), 0)
      )
    )::NUMERIC(3,2) AS compatibility_score,
    jsonb_build_array(
      CASE
        WHEN v_looking_for && np.can_offer THEN 'They can offer what you''re looking for'
        WHEN v_can_offer && np.looking_for THEN 'You can offer what they''re looking for'
        ELSE 'Shared interests'
      END
    ) AS match_reasons
  FROM public.attendees a
  JOIN public.networking_preferences np ON np.attendee_id = a.id
  WHERE a.event_id = p_event_id
  AND a.id != p_attendee_id
  AND np.networking_enabled = TRUE
  AND a.id NOT IN (
    -- Exclude existing matches
    SELECT CASE
      WHEN attendee_1_id = p_attendee_id THEN attendee_2_id
      ELSE attendee_1_id
    END
    FROM public.matches
    WHERE event_id = p_event_id
    AND (attendee_1_id = p_attendee_id OR attendee_2_id = p_attendee_id)
    AND status NOT IN ('declined', 'expired')
  )
  ORDER BY compatibility_score DESC
  LIMIT p_limit;
END;
$$;

-- Check meeting availability for scheduling
CREATE OR REPLACE FUNCTION public.check_meeting_availability(
  p_attendee_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_conflict_count
  FROM public.meetings
  WHERE (attendee_1_id = p_attendee_id OR attendee_2_id = p_attendee_id)
  AND status IN ('scheduled', 'confirmed', 'in_progress')
  AND (
    (scheduled_start, scheduled_end) OVERLAPS (p_start_time, p_end_time)
  );

  RETURN v_conflict_count = 0;
END;
$$;
```

### **API Endpoints:**
- `GET /api/networking/matches/{event_id}` - Get AI-generated matches
- `POST /api/networking/match/{match_id}/accept` - Accept a match
- `POST /api/networking/match/{match_id}/decline` - Decline a match
- `POST /api/networking/meeting/schedule` - Schedule a meeting
- `GET /api/networking/meetings/{attendee_id}` - Get upcoming meetings
- `POST /api/networking/meeting/{meeting_id}/feedback` - Submit meeting feedback

### **Example Usage:**
```typescript
// Get networking matches
const response = await fetch(`/api/networking/matches/${eventId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { matches } = await response.json();
/*
[
  {
    match_id: "uuid",
    other_attendee: {
      name: "Jane Smith",
      title: "VP of Engineering",
      company: "Tech Corp"
    },
    compatibility_score: 0.87,
    reasons: [
      "Looking for: investors - They can offer: investment",
      "Shared interest in AI/ML"
    ]
  },
  ...
]
*/

// Accept match and schedule meeting
await fetch(`/api/networking/match/${matchId}/accept`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    schedule_meeting: true,
    preferred_time: "2025-11-15T14:00:00Z",
    duration_minutes: 15
  })
});
```

### **Success Metrics:**
- ✅ 60%+ attendees engage with matchmaking
- ✅ 3× more qualified meetings than manual networking
- ✅ 85%+ match acceptance rate
- ✅ 75%+ attendees rate meetings as valuable

---

## 💰 **Feature 3: Sponsor Management & Lead Scoring**

### **What It Does:**
Optimizes sponsor relationships and maximizes revenue through AI:
- Intelligent lead scoring and prioritization
- Sponsor-attendee matching
- ROI prediction and tracking
- Automated renewal sequences
- CRM integration and sync

### **Implementation:**
```
Technology Stack:
├── Predictive ML Models (lead scoring)
├── CRM APIs (Salesforce, HubSpot, Pipedrive)
├── Real-time Engagement Tracking
├── Automated Workflow Engine (n8n)
└── Revenue Analytics Dashboard
```

### **Database Schema:**

#### **sponsors table**
```sql
-- Core sponsor information
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Company details
  company_name TEXT NOT NULL,
  company_website TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),

  -- Contact information
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,

  -- Sponsorship details
  sponsorship_tier TEXT NOT NULL CHECK (sponsorship_tier IN (
    'title', 'platinum', 'gold', 'silver', 'bronze', 'community'
  )),
  package_id UUID REFERENCES public.sponsorship_packages(id),
  contract_value NUMERIC(12,2) NOT NULL,
  contract_signed_date DATE,

  -- Status
  status TEXT DEFAULT 'prospecting' CHECK (status IN (
    'prospecting', 'negotiating', 'contracted', 'active', 'fulfilled', 'churned'
  )),

  -- Engagement tracking
  total_leads_collected INTEGER DEFAULT 0,
  total_booth_visits INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),

  -- ROI tracking
  projected_roi NUMERIC(5,2), -- 250 = 250% ROI
  actual_roi NUMERIC(5,2),
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 10),

  -- Renewal
  renewal_likely BOOLEAN,
  renewal_probability NUMERIC(3,2), -- ML-predicted probability
  renewal_contacted_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, company_name)
);

-- Indexes
CREATE INDEX idx_sponsors_event ON public.sponsors(event_id);
CREATE INDEX idx_sponsors_tier ON public.sponsors(sponsorship_tier);
CREATE INDEX idx_sponsors_status ON public.sponsors(status);
CREATE INDEX idx_sponsors_engagement ON public.sponsors(engagement_score DESC);
CREATE INDEX idx_sponsors_renewal_probability ON public.sponsors(renewal_probability DESC) WHERE renewal_probability IS NOT NULL;

-- RLS Policies
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can manage sponsors for their events"
  ON public.sponsors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = sponsors.event_id
      AND organizer_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Sponsors can view their own records"
  ON public.sponsors FOR SELECT
  TO authenticated
  USING (primary_contact_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
```

#### **sponsorship_packages table**
```sql
-- Predefined sponsorship packages
CREATE TABLE public.sponsorship_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Package details
  package_name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('title', 'platinum', 'gold', 'silver', 'bronze', 'community')),
  price NUMERIC(12,2) NOT NULL,

  -- Benefits included
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["Booth space", "Logo on website", "Email blast"]
  deliverables JSONB DEFAULT '[]'::jsonb,

  -- Capacity
  total_available INTEGER NOT NULL CHECK (total_available > 0),
  sold INTEGER DEFAULT 0 CHECK (sold >= 0),
  available INTEGER GENERATED ALWAYS AS (total_available - sold) STORED,

  -- Sales tracking
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'limited', 'sold_out', 'archived')),
  priority INTEGER DEFAULT 0, -- Display order

  -- Marketing
  description TEXT,
  highlights TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, package_name)
);

-- Indexes
CREATE INDEX idx_sponsorship_packages_event ON public.sponsorship_packages(event_id);
CREATE INDEX idx_sponsorship_packages_tier ON public.sponsorship_packages(tier);
CREATE INDEX idx_sponsorship_packages_priority ON public.sponsorship_packages(priority);

-- RLS Policies
ALTER TABLE public.sponsorship_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published sponsorship packages"
  ON public.sponsorship_packages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = sponsorship_packages.event_id
      AND status = 'published'
    )
  );

CREATE POLICY "Organizers can manage sponsorship packages"
  ON public.sponsorship_packages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = sponsorship_packages.event_id
      AND organizer_id = (SELECT auth.uid())
    )
  );
```

#### **lead_scoring table**
```sql
-- AI-powered lead scoring for sponsors
CREATE TABLE public.lead_scoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,

  -- Lead quality
  lead_score INTEGER NOT NULL CHECK (lead_score >= 0 AND lead_score <= 100),
  lead_grade TEXT GENERATED ALWAYS AS (
    CASE
      WHEN lead_score >= 80 THEN 'A'
      WHEN lead_score >= 60 THEN 'B'
      WHEN lead_score >= 40 THEN 'C'
      ELSE 'D'
    END
  ) STORED,

  -- Scoring factors
  engagement_score INTEGER DEFAULT 0,
  fit_score INTEGER DEFAULT 0, -- How well attendee matches sponsor's ICP
  intent_score INTEGER DEFAULT 0, -- Signals of purchase intent

  -- Interaction history
  booth_visits INTEGER DEFAULT 0,
  content_downloads INTEGER DEFAULT 0,
  session_attendance INTEGER DEFAULT 0,
  messages_exchanged INTEGER DEFAULT 0,
  meeting_requested BOOLEAN DEFAULT FALSE,

  -- Engagement details
  first_interaction_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
  interaction_count INTEGER DEFAULT 0,

  -- Lead status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new', 'contacted', 'qualified', 'opportunity', 'closed_won', 'closed_lost', 'nurturing'
  )),
  assigned_to TEXT, -- Sales rep email
  crm_sync_status TEXT DEFAULT 'pending' CHECK (crm_sync_status IN ('pending', 'synced', 'failed')),
  crm_lead_id TEXT, -- External CRM ID

  -- Metadata
  notes TEXT,
  tags TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(sponsor_id, attendee_id)
);

-- Indexes
CREATE INDEX idx_lead_scoring_event ON public.lead_scoring(event_id);
CREATE INDEX idx_lead_scoring_sponsor ON public.lead_scoring(sponsor_id);
CREATE INDEX idx_lead_scoring_attendee ON public.lead_scoring(attendee_id);
CREATE INDEX idx_lead_scoring_score ON public.lead_scoring(lead_score DESC);
CREATE INDEX idx_lead_scoring_grade ON public.lead_scoring(lead_grade);
CREATE INDEX idx_lead_scoring_status ON public.lead_scoring(status);
CREATE INDEX idx_lead_scoring_last_interaction ON public.lead_scoring(last_interaction_at DESC);

-- RLS Policies
ALTER TABLE public.lead_scoring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors can view their own leads"
  ON public.lead_scoring FOR SELECT
  TO authenticated
  USING (
    sponsor_id IN (
      SELECT id FROM public.sponsors
      WHERE primary_contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Organizers can view all leads for their events"
  ON public.lead_scoring FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = lead_scoring.event_id
      AND organizer_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "System can manage lead scores"
  ON public.lead_scoring FOR ALL
  TO authenticated
  WITH CHECK (TRUE);
```

### **Lead Scoring Functions:**

```sql
-- Calculate and update lead score
CREATE OR REPLACE FUNCTION public.calculate_lead_score(
  p_lead_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_engagement_score INTEGER;
  v_fit_score INTEGER;
  v_intent_score INTEGER;
  v_final_score INTEGER;
BEGIN
  -- Get current lead data
  SELECT
    -- Engagement scoring (0-40 points)
    LEAST(40, (
      (booth_visits * 10) +
      (content_downloads * 5) +
      (session_attendance * 3) +
      (messages_exchanged * 2) +
      (CASE WHEN meeting_requested THEN 10 ELSE 0 END)
    )),
    -- Fit score (0-30 points) - simplified, would use ML in production
    30,
    -- Intent score (0-30 points)
    LEAST(30, interaction_count * 3)
  INTO v_engagement_score, v_fit_score, v_intent_score
  FROM public.lead_scoring
  WHERE id = p_lead_id;

  -- Calculate final score (0-100)
  v_final_score := v_engagement_score + v_fit_score + v_intent_score;

  -- Update the lead
  UPDATE public.lead_scoring
  SET
    engagement_score = v_engagement_score,
    fit_score = v_fit_score,
    intent_score = v_intent_score,
    lead_score = v_final_score,
    updated_at = NOW()
  WHERE id = p_lead_id;

  RETURN v_final_score;
END;
$$;

-- Predict sponsor renewal likelihood
CREATE OR REPLACE FUNCTION public.predict_sponsor_renewal(
  p_sponsor_id UUID
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_renewal_probability NUMERIC(3,2);
  v_engagement_score INTEGER;
  v_satisfaction_score INTEGER;
  v_actual_roi NUMERIC;
BEGIN
  -- Get sponsor metrics
  SELECT engagement_score, satisfaction_score, actual_roi
  INTO v_engagement_score, v_satisfaction_score, v_actual_roi
  FROM public.sponsors
  WHERE id = p_sponsor_id;

  -- Simple renewal prediction (in production, use trained ML model)
  v_renewal_probability := (
    (COALESCE(v_engagement_score, 50) / 100.0 * 0.3) +
    (COALESCE(v_satisfaction_score, 5) / 10.0 * 0.4) +
    (LEAST(COALESCE(v_actual_roi, 0), 500) / 500.0 * 0.3)
  );

  -- Update sponsor record
  UPDATE public.sponsors
  SET
    renewal_probability = v_renewal_probability,
    renewal_likely = (v_renewal_probability >= 0.70),
    updated_at = NOW()
  WHERE id = p_sponsor_id;

  RETURN v_renewal_probability;
END;
$$;
```

### **API Endpoints:**
- `GET /api/sponsors/{event_id}` - List all sponsors
- `POST /api/sponsors` - Add new sponsor
- `GET /api/sponsors/{sponsor_id}/leads` - Get scored leads
- `POST /api/sponsors/{sponsor_id}/leads/score` - Trigger lead scoring
- `GET /api/sponsors/{sponsor_id}/analytics` - Sponsor ROI dashboard
- `POST /api/sponsors/{sponsor_id}/crm-sync` - Sync to CRM
- `GET /api/sponsors/renewal-predictions/{event_id}` - Get renewal predictions

### **Example Usage:**
```typescript
// Get high-quality leads for sponsor
const response = await fetch(`/api/sponsors/${sponsorId}/leads?min_score=60`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { leads } = await response.json();
/*
[
  {
    attendee: {
      name: "John Doe",
      title: "Director of Marketing",
      company: "Enterprise Co"
    },
    lead_score: 87,
    lead_grade: "A",
    engagement: {
      booth_visits: 3,
      content_downloads: 2,
      meeting_requested: true
    },
    last_interaction: "2025-11-15T16:30:00Z",
    status: "qualified"
  },
  ...
]
*/

// Sync leads to CRM
await fetch(`/api/sponsors/${sponsorId}/crm-sync`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    crm_type: 'salesforce',
    min_lead_score: 60,
    sync_fields: ['contact_info', 'engagement_history', 'lead_score']
  })
});
```

### **Success Metrics:**
- ✅ 2× increase in qualified leads
- ✅ 40% improvement in lead conversion
- ✅ 25% increase in sponsor renewal rate
- ✅ 30% reduction in sales cycle time
- ✅ 90%+ sponsor satisfaction with lead quality

---

## 📋 **Phase 2 Implementation Checklist**

### **Month 4: Personalization & Recommendations**
- [ ] Set up vector database (pgvector extension)
- [ ] Create attendee preferences and embeddings tables
- [ ] Build recommendation engine algorithms
- [ ] Implement recommendation API endpoints
- [ ] Create UI for preference collection
- [ ] Generate session embeddings for existing content
- [ ] A/B test recommendation algorithms
- [ ] Deploy recommendation system

### **Month 5: AI Networking & Matchmaking**
- [ ] Create networking and matching tables
- [ ] Build compatibility scoring algorithms
- [ ] Implement real-time matching engine
- [ ] Create meeting scheduler with conflict detection
- [ ] Build networking UI and WebSocket notifications
- [ ] Test matching quality with pilot group
- [ ] Deploy matchmaking system
- [ ] Monitor match acceptance rates

### **Month 6: Sponsor Management & Lead Scoring**
- [ ] Create sponsor and lead scoring tables
- [ ] Build lead scoring ML model
- [ ] Implement CRM integration (Salesforce, HubSpot)
- [ ] Create sponsor analytics dashboard
- [ ] Build renewal prediction model
- [ ] Set up automated lead sync workflows
- [ ] Test with sponsor pilot program
- [ ] Deploy sponsor management system

### **Integration & Testing (Week 25-26)**
- [ ] End-to-end testing across all Phase 2 features
- [ ] Performance optimization and load testing
- [ ] Security audit and penetration testing
- [ ] User acceptance testing with real event
- [ ] Bug fixes and refinements
- [ ] Documentation and training materials
- [ ] Production deployment
- [ ] Post-launch monitoring

---

## 💰 **Phase 2 Budget Estimate**

### **Development Costs:**
- 2 Full-stack developers × 3 months = $45K-60K
- 1 ML/AI engineer × 3 months = $25K-35K
- 1 UI/UX designer × 1 month = $8K-12K

### **Infrastructure Costs:**
- OpenAI API (embeddings): ~$300-600/month
- Vector database (pgvector): Included in Supabase
- CRM API costs: ~$200-400/month
- Additional compute: ~$200-400/month

### **Total Phase 2 Cost:** ~$80K-110K

### **Expected ROI:**
- 2× increase in attendee engagement value
- 30% improvement in sponsor renewals = ~$75K-150K/year
- 2× lead conversion = ~$50K-100K/year additional sponsor revenue
- **ROI: 5-6× within 9 months**

---

## 🎯 **Phase 2 Success Criteria**

Before moving to Phase 3, validate:
- ✅ Recommendation engine achieves 70%+ engagement rate
- ✅ Matching algorithm produces 85%+ acceptance rate
- ✅ Lead scoring increases conversion by 40%+
- ✅ Sponsor satisfaction NPS >70
- ✅ System handles 10,000+ concurrent users
- ✅ All features integrated and stable
- ✅ Positive ROI demonstrated with pilot events

---

**Next:** [Phase 3: Advanced Features](../03-advanced/README.md)
