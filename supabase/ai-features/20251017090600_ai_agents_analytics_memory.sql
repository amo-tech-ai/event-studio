-- =====================================================
-- migration: ai agents - analytics and shared memory
-- purpose: analytics agent activities and shared memory system for all agents
-- affected tables: agent_analytics_activities, agent_memory (new)
-- dependencies: events must exist
-- special considerations: shared memory enables cross-agent learning and context preservation
-- =====================================================

-- =============================================================================
-- 1. agent_analytics_activities table
-- =============================================================================

-- create agent_analytics_activities table
-- tracks all actions performed by the analytics ai agent
create table public.agent_analytics_activities (
  id uuid primary key default uuid_generate_v4(),

  -- agent identification
  agent_id text default 'analytics_agent',
  agent_version text,

  -- activity details
  analysis_type text not null check (analysis_type in (
    'attendance_prediction',   -- predicted final attendance
    'revenue_forecast',        -- forecasted revenue
    'campaign_analysis',       -- analyzed marketing campaign
    'sponsor_roi_analysis',    -- analyzed sponsor roi
    'anomaly_detection',       -- detected unusual pattern
    'trend_identification',    -- identified trend
    'recommendation_generated', -- generated actionable recommendation
    'report_generated',        -- generated executive report
    'segment_analysis',        -- analyzed audience segment
    'conversion_analysis'      -- analyzed conversion funnel
  )),

  -- context
  event_id uuid references public.events(id) on delete set null,

  -- analysis data
  input_data jsonb,
  -- data that was analyzed
  -- {"ticket_sales_data": [...], "time_period": "last_30_days"}

  -- insights generated
  insights jsonb not null,
  -- key insights found by analysis
  -- {
  --   "current_status": {...},
  --   "trends": [...],
  --   "opportunities": [...],
  --   "risks": [...],
  --   "anomalies": [...]
  -- }

  -- recommendations
  recommendations jsonb,
  -- actionable recommendations
  -- [
  --   {
  --     "action": "increase_marketing_budget",
  --     "priority": "high",
  --     "expected_impact": "15% more ticket sales",
  --     "reasoning": "...",
  --     "confidence": 0.85
  --   }
  -- ]

  -- predictions
  predictions jsonb,
  -- future predictions with confidence intervals
  -- {
  --   "final_attendance": {
  --     "value": 850,
  --     "confidence_interval": [780, 920],
  --     "confidence_level": 0.90
  --   }
  -- }

  -- model metadata
  model_type text,
  -- e.g., "linear_regression", "xgboost", "neural_network"
  model_version text,
  confidence_score numeric(5,2),
  -- 0-100 confidence in analysis

  -- results
  status text default 'success' check (status in (
    'success', 'failed', 'pending'
  )),
  error_message text,

  -- performance tracking
  duration_ms integer,
  data_points_analyzed integer,
  -- number of data points included in analysis

  -- metadata
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now() not null
);

-- add comments
comment on table public.agent_analytics_activities is 'tracks all analyses by analytics ai agent';
comment on column public.agent_analytics_activities.insights is 'key insights discovered by analysis';
comment on column public.agent_analytics_activities.recommendations is 'actionable recommendations with priority';
comment on column public.agent_analytics_activities.predictions is 'future predictions with confidence intervals';

-- create indexes
create index idx_analytics_activities_event on public.agent_analytics_activities(event_id, created_at desc)
  where event_id is not null;
create index idx_analytics_activities_type on public.agent_analytics_activities(analysis_type);
create index idx_analytics_activities_status on public.agent_analytics_activities(status);
create index idx_analytics_activities_created on public.agent_analytics_activities(created_at desc);
create index idx_analytics_activities_agent on public.agent_analytics_activities(agent_id, agent_version);

-- gin indexes for jsonb
create index idx_analytics_activities_insights on public.agent_analytics_activities using gin(insights);
create index idx_analytics_activities_recommendations on public.agent_analytics_activities using gin(recommendations);
create index idx_analytics_activities_predictions on public.agent_analytics_activities using gin(predictions);

-- enable rls
alter table public.agent_analytics_activities enable row level security;

-- rls policy: organizers can view analytics for their events
create policy "organizers view analytics for their events"
  on public.agent_analytics_activities
  for select
  to authenticated
  using (
    event_id is null or exists (
      select 1 from public.events
      where events.id = agent_analytics_activities.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- 2. agent_memory table
-- =============================================================================

-- create agent_memory table
-- shared memory system enabling agents to learn and share context
create table public.agent_memory (
  id uuid primary key default uuid_generate_v4(),

  -- agent identification (which agent created this memory)
  agent_id text not null,

  -- memory classification
  memory_type text not null check (memory_type in (
    'short_term',    -- recent interactions (expires in 7 days)
    'long_term',     -- important learnings (permanent)
    'episodic',      -- specific task/conversation memory
    'semantic'       -- general knowledge extracted from experiences
  )),

  -- memory content
  content jsonb not null,
  -- {
  --   "key": "sponsor_preferences_tech_industry",
  --   "value": {...},
  --   "context": "learned from 15 successful deals",
  --   "confidence": 0.85,
  --   "related_entities": ["sponsor_id_1", "sponsor_id_2"]
  -- }

  -- importance scoring
  importance_score integer default 50 check (importance_score >= 0 and importance_score <= 100),
  -- 0-100 importance score (determines retention)
  -- >80: critical, keep forever
  -- 50-80: important, keep for months
  -- <50: routine, expire after days/weeks

  -- access tracking
  access_count integer default 0,
  -- how many times this memory was accessed
  last_accessed_at timestamptz,
  last_accessed_by text,
  -- which agent last accessed

  -- expiration
  expires_at timestamptz,
  -- null means never expires (long-term memory)

  -- relationships
  related_memory_ids uuid[],
  -- array of related memory ids for graph traversal

  -- tags for categorization
  tags text[] default '{}',
  -- e.g., ["sponsors", "tech_industry", "pricing", "negotiation"]

  -- metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "source": "agent_sales_activities",
  --   "source_id": "uuid",
  --   "created_from_event": "uuid"
  -- }

  -- timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments
comment on table public.agent_memory is 'shared memory system for ai agent learning and context';
comment on column public.agent_memory.memory_type is 'classification: short_term, long_term, episodic, semantic';
comment on column public.agent_memory.importance_score is 'importance 0-100 determines retention policy';
comment on column public.agent_memory.content is 'flexible jsonb storage for memory content';
comment on column public.agent_memory.tags is 'tags for categorization and retrieval';

-- create indexes
create index idx_agent_memory_agent on public.agent_memory(agent_id);
create index idx_agent_memory_type on public.agent_memory(memory_type);
create index idx_agent_memory_importance on public.agent_memory(importance_score desc);
create index idx_agent_memory_access_count on public.agent_memory(access_count desc);
create index idx_agent_memory_created on public.agent_memory(created_at desc);

-- index for finding expired memories to clean up
create index idx_agent_memory_expired on public.agent_memory(expires_at)
  where expires_at is not null and expires_at < now();

-- gin indexes for jsonb and arrays
create index idx_agent_memory_content on public.agent_memory using gin(content);
create index idx_agent_memory_tags on public.agent_memory using gin(tags);
create index idx_agent_memory_related_ids on public.agent_memory using gin(related_memory_ids);

-- full text search on memory content
create index idx_agent_memory_search on public.agent_memory
  using gin(to_tsvector('english', content::text));

-- enable rls
alter table public.agent_memory enable row level security;

-- rls policy: authenticated users can read shared agent memory
-- memory is shared across platform to enable learning
create policy "authenticated users can read agent memory"
  on public.agent_memory
  for select
  to authenticated
  using (true);

-- rls policy: only system can write agent memory
-- prevents users from tampering with agent learning
create policy "system can write agent memory"
  on public.agent_memory
  for all
  to authenticated
  using (false) -- no direct access
  with check (false); -- no direct writes

-- =============================================================================
-- functions
-- =============================================================================

-- function: access agent memory (with tracking)
-- retrieves memory and updates access tracking
create or replace function public.access_agent_memory(
  p_memory_id uuid,
  p_accessing_agent text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_content jsonb;
begin
  -- get memory content and update access tracking
  update public.agent_memory
  set
    access_count = access_count + 1,
    last_accessed_at = now(),
    last_accessed_by = p_accessing_agent
  where id = p_memory_id
  returning content into v_content;

  return v_content;
end;
$$;

comment on function public.access_agent_memory is 'retrieves memory content and tracks access';

-- function: search agent memory
-- semantic search across agent memory
create or replace function public.search_agent_memory(
  p_agent_id text,
  p_query text,
  p_limit integer default 10
)
returns table(
  memory_id uuid,
  content jsonb,
  importance_score integer,
  relevance_rank real
)
language plpgsql
security definer
as $$
begin
  return query
  select
    m.id,
    m.content,
    m.importance_score,
    ts_rank(to_tsvector('english', m.content::text), plainto_tsquery('english', p_query)) as relevance
  from public.agent_memory m
  where m.agent_id = p_agent_id
    and to_tsvector('english', m.content::text) @@ plainto_tsquery('english', p_query)
    and (m.expires_at is null or m.expires_at > now())
  order by
    relevance desc,
    m.importance_score desc
  limit p_limit;
end;
$$;

comment on function public.search_agent_memory is 'semantic search across agent memory';

-- function: store agent memory
-- creates new memory with automatic scoring
create or replace function public.store_agent_memory(
  p_agent_id text,
  p_memory_type text,
  p_content jsonb,
  p_tags text[] default '{}'::text[]
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_memory_id uuid;
  v_importance_score integer;
  v_expires_at timestamptz;
begin
  -- calculate importance score based on memory type
  case p_memory_type
    when 'long_term' then
      v_importance_score := 80;
      v_expires_at := null; -- never expires
    when 'semantic' then
      v_importance_score := 70;
      v_expires_at := null;
    when 'episodic' then
      v_importance_score := 60;
      v_expires_at := now() + interval '30 days';
    when 'short_term' then
      v_importance_score := 40;
      v_expires_at := now() + interval '7 days';
  end case;

  -- insert memory
  insert into public.agent_memory (
    agent_id,
    memory_type,
    content,
    importance_score,
    expires_at,
    tags
  ) values (
    p_agent_id,
    p_memory_type,
    p_content,
    v_importance_score,
    v_expires_at,
    p_tags
  )
  returning id into v_memory_id;

  return v_memory_id;
end;
$$;

comment on function public.store_agent_memory is 'stores new memory with automatic importance scoring';

-- function: cleanup expired memories
-- called by cron job to remove expired short-term memories
create or replace function public.cleanup_expired_memories()
returns integer
language plpgsql
security definer
as $$
declare
  v_deleted_count integer;
begin
  delete from public.agent_memory
  where expires_at is not null
    and expires_at < now()
    and importance_score < 60; -- only delete non-important memories

  get diagnostics v_deleted_count = row_count;
  return v_deleted_count;
end;
$$;

comment on function public.cleanup_expired_memories is 'removes expired short-term memories';

-- function: get latest analytics insights
-- retrieves most recent analytics insights for an event
create or replace function public.get_latest_analytics_insights(
  p_event_id uuid,
  p_analysis_types text[] default null,
  p_limit integer default 5
)
returns table(
  analysis_id uuid,
  analysis_type text,
  insights jsonb,
  recommendations jsonb,
  predictions jsonb,
  confidence_score numeric,
  created_at timestamptz
)
language plpgsql
security definer
as $$
begin
  return query
  select
    a.id,
    a.analysis_type,
    a.insights,
    a.recommendations,
    a.predictions,
    a.confidence_score,
    a.created_at
  from public.agent_analytics_activities a
  where a.event_id = p_event_id
    and a.status = 'success'
    and (p_analysis_types is null or a.analysis_type = any(p_analysis_types))
  order by a.created_at desc
  limit p_limit;
end;
$$;

comment on function public.get_latest_analytics_insights is 'retrieves latest analytics insights for event';

-- =============================================================================
-- grant permissions
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select on public.agent_analytics_activities to authenticated;
grant select on public.agent_memory to authenticated;
grant execute on function public.access_agent_memory to authenticated;
grant execute on function public.search_agent_memory to authenticated;
grant execute on function public.get_latest_analytics_insights to authenticated;
-- note: store_agent_memory and cleanup_expired_memories are for system use only
