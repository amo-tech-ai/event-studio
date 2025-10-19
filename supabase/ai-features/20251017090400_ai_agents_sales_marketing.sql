-- =====================================================
-- migration: ai agents - sales and marketing
-- purpose: activity tracking for sales and marketing ai agents
-- affected tables: agent_sales_activities, agent_marketing_activities (new)
-- dependencies: events, sponsors, marketing_campaigns must exist
-- special considerations: tracks autonomous ai agent actions for accountability and learning
-- =====================================================

-- =============================================================================
-- 1. agent_sales_activities table
-- =============================================================================

-- create agent_sales_activities table
-- tracks all actions performed by the sales ai agent
create table public.agent_sales_activities (
  id uuid primary key default uuid_generate_v4(),

  -- agent identification
  agent_id text default 'sales_agent',
  agent_version text,
  -- track agent version for performance comparison

  -- activity details
  activity_type text not null check (activity_type in (
    'prospect_search',        -- searched for potential sponsors
    'lead_qualification',     -- scored/qualified a lead
    'proposal_generation',    -- generated sponsorship proposal
    'email_sent',             -- sent email to sponsor
    'follow_up_sent',         -- sent follow-up email
    'meeting_scheduled',      -- scheduled meeting
    'meeting_reminder',       -- sent meeting reminder
    'crm_update',             -- updated sponsor record
    'linkedin_search',        -- searched linkedin for contacts
    'engagement_analysis',    -- analyzed sponsor engagement
    'contract_sent',          -- sent contract
    'opportunity_identified', -- identified new opportunity
    'escalation'             -- escalated issue to human
  )),

  -- context
  event_id uuid references public.events(id) on delete set null,
  sponsor_id uuid references public.sponsors(id) on delete set null,
  proposal_id uuid references public.sponsor_proposals(id) on delete set null,

  -- activity data
  input_data jsonb,
  -- data that was passed to the agent action
  output_data jsonb,
  -- result produced by the agent action
  reasoning text,
  -- ai's explanation for why it took this action

  -- results
  status text default 'success' check (status in (
    'success',    -- action completed successfully
    'failed',     -- action failed
    'pending',    -- action queued, not yet executed
    'escalated'   -- required human intervention
  )),
  error_message text,
  error_details jsonb,

  -- autonomy tracking
  autonomous boolean default true,
  -- true if agent acted autonomously, false if human-initiated
  required_human_review boolean default false,
  -- true if agent determined human review was needed
  escalation_reason text,
  -- why agent escalated to human

  -- human interaction
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  human_feedback text,
  -- feedback from human review for agent learning

  -- performance tracking
  duration_ms integer,
  -- time to complete action in milliseconds
  llm_tokens_used integer,
  -- tokens consumed by llm calls
  api_calls_made integer default 0,
  -- number of external api calls

  -- metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "confidence_score": 0.85,
  --   "alternative_actions_considered": [...],
  --   "context_used": {...}
  -- }

  created_at timestamptz default now() not null
);

-- add comments
comment on table public.agent_sales_activities is 'tracks all actions by sales ai agent';
comment on column public.agent_sales_activities.reasoning is 'ai explanation for taking this action';
comment on column public.agent_sales_activities.autonomous is 'whether action was taken autonomously by ai';
comment on column public.agent_sales_activities.required_human_review is 'whether ai determined human review needed';

-- create indexes
create index idx_sales_activities_event on public.agent_sales_activities(event_id, created_at desc)
  where event_id is not null;
create index idx_sales_activities_sponsor on public.agent_sales_activities(sponsor_id, created_at desc)
  where sponsor_id is not null;
create index idx_sales_activities_proposal on public.agent_sales_activities(proposal_id)
  where proposal_id is not null;
create index idx_sales_activities_type on public.agent_sales_activities(activity_type);
create index idx_sales_activities_status on public.agent_sales_activities(status);
create index idx_sales_activities_created on public.agent_sales_activities(created_at desc);
create index idx_sales_activities_agent on public.agent_sales_activities(agent_id, agent_version);

-- index for finding activities requiring human review
create index idx_sales_activities_escalated on public.agent_sales_activities(required_human_review, reviewed_at)
  where required_human_review = true;

-- gin indexes for jsonb
create index idx_sales_activities_input on public.agent_sales_activities using gin(input_data);
create index idx_sales_activities_output on public.agent_sales_activities using gin(output_data);
create index idx_sales_activities_metadata on public.agent_sales_activities using gin(metadata);

-- enable rls
alter table public.agent_sales_activities enable row level security;

-- rls policy: organizers can view sales activities for their events
create policy "organizers view sales activities for their events"
  on public.agent_sales_activities
  for select
  to authenticated
  using (
    event_id is null or exists (
      select 1 from public.events
      where events.id = agent_sales_activities.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can review activities for their events
create policy "organizers review activities for their events"
  on public.agent_sales_activities
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = agent_sales_activities.event_id
      and events.organizer_id = auth.uid()
    )
  )
  with check (
    -- can only update review fields
    reviewed_by = auth.uid()
  );

-- =============================================================================
-- 2. agent_marketing_activities table
-- =============================================================================

-- create agent_marketing_activities table
-- tracks all actions performed by the marketing ai agent
create table public.agent_marketing_activities (
  id uuid primary key default uuid_generate_v4(),

  -- agent identification
  agent_id text default 'marketing_agent',
  agent_version text,

  -- activity details
  activity_type text not null check (activity_type in (
    'content_generation',      -- generated marketing content
    'post_scheduled',          -- scheduled social media post
    'campaign_analyzed',       -- analyzed campaign performance
    'email_sent',              -- sent email campaign
    'ab_test_started',         -- started a/b test
    'ab_test_result',          -- a/b test completed with winner
    'timing_optimized',        -- optimized send timing
    'audience_segmented',      -- segmented audience
    'metrics_monitored',       -- monitored campaign metrics
    'campaign_optimized',      -- made optimization to campaign
    'budget_adjusted',         -- adjusted campaign budget
    'content_revised'          -- revised content based on performance
  )),

  -- context
  event_id uuid references public.events(id) on delete set null,
  campaign_id uuid references public.marketing_campaigns(id) on delete set null,

  -- activity data
  input_data jsonb,
  output_data jsonb,
  optimization_reasoning text,
  -- why agent made this optimization

  -- performance impact
  metrics_before jsonb,
  -- metrics before agent action
  -- {"open_rate": 0.25, "click_rate": 0.03, "conversion_rate": 0.01}
  metrics_after jsonb,
  -- metrics after agent action
  performance_improvement numeric(5,2),
  -- percentage improvement (positive or negative)

  -- results
  status text default 'success' check (status in (
    'success', 'failed', 'pending'
  )),
  error_message text,

  -- autonomy tracking
  autonomous boolean default true,
  confidence_score numeric(5,2),
  -- 0-100 confidence in action taken

  -- performance tracking
  duration_ms integer,
  llm_tokens_used integer,
  api_calls_made integer default 0,

  -- metadata
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now() not null
);

-- add comments
comment on table public.agent_marketing_activities is 'tracks all actions by marketing ai agent';
comment on column public.agent_marketing_activities.optimization_reasoning is 'why agent made this optimization';
comment on column public.agent_marketing_activities.metrics_before is 'campaign metrics before agent action';
comment on column public.agent_marketing_activities.metrics_after is 'campaign metrics after agent action';
comment on column public.agent_marketing_activities.performance_improvement is 'percentage improvement from action';

-- create indexes
create index idx_marketing_activities_event on public.agent_marketing_activities(event_id, created_at desc)
  where event_id is not null;
create index idx_marketing_activities_campaign on public.agent_marketing_activities(campaign_id, created_at desc)
  where campaign_id is not null;
create index idx_marketing_activities_type on public.agent_marketing_activities(activity_type);
create index idx_marketing_activities_status on public.agent_marketing_activities(status);
create index idx_marketing_activities_created on public.agent_marketing_activities(created_at desc);
create index idx_marketing_activities_agent on public.agent_marketing_activities(agent_id, agent_version);
create index idx_marketing_activities_improvement on public.agent_marketing_activities(performance_improvement desc nulls last);

-- gin indexes for jsonb
create index idx_marketing_activities_input on public.agent_marketing_activities using gin(input_data);
create index idx_marketing_activities_output on public.agent_marketing_activities using gin(output_data);
create index idx_marketing_activities_metrics_before on public.agent_marketing_activities using gin(metrics_before);
create index idx_marketing_activities_metrics_after on public.agent_marketing_activities using gin(metrics_after);

-- enable rls
alter table public.agent_marketing_activities enable row level security;

-- rls policy: organizers can view marketing activities for their events
create policy "organizers view marketing activities for their events"
  on public.agent_marketing_activities
  for select
  to authenticated
  using (
    event_id is null or exists (
      select 1 from public.events
      where events.id = agent_marketing_activities.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- functions
-- =============================================================================

-- function: calculate agent performance metrics
-- summarizes agent performance over time period
create or replace function public.calculate_agent_performance(
  p_agent_id text,
  p_start_date timestamptz default now() - interval '30 days',
  p_end_date timestamptz default now()
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_result jsonb;
  v_total_activities integer;
  v_successful integer;
  v_failed integer;
  v_escalated integer;
  v_avg_duration numeric;
  v_total_tokens integer;
begin
  -- aggregate metrics based on agent type
  if p_agent_id = 'sales_agent' then
    select
      count(*),
      count(*) filter (where status = 'success'),
      count(*) filter (where status = 'failed'),
      count(*) filter (where status = 'escalated'),
      avg(duration_ms),
      sum(llm_tokens_used)
    into
      v_total_activities,
      v_successful,
      v_failed,
      v_escalated,
      v_avg_duration,
      v_total_tokens
    from public.agent_sales_activities
    where agent_id = p_agent_id
      and created_at between p_start_date and p_end_date;

  elsif p_agent_id = 'marketing_agent' then
    select
      count(*),
      count(*) filter (where status = 'success'),
      count(*) filter (where status = 'failed'),
      0, -- no escalations for marketing agent
      avg(duration_ms),
      sum(llm_tokens_used)
    into
      v_total_activities,
      v_successful,
      v_failed,
      v_escalated,
      v_avg_duration,
      v_total_tokens
    from public.agent_marketing_activities
    where agent_id = p_agent_id
      and created_at between p_start_date and p_end_date;
  end if;

  -- build result json
  v_result := jsonb_build_object(
    'agent_id', p_agent_id,
    'period', jsonb_build_object(
      'start', p_start_date,
      'end', p_end_date
    ),
    'total_activities', v_total_activities,
    'successful', v_successful,
    'failed', v_failed,
    'escalated', v_escalated,
    'success_rate', case
      when v_total_activities > 0 then round((v_successful::numeric / v_total_activities) * 100, 2)
      else 0
    end,
    'avg_duration_ms', round(v_avg_duration, 0),
    'total_tokens_used', v_total_tokens
  );

  return v_result;
end;
$$;

comment on function public.calculate_agent_performance is 'calculates performance metrics for ai agents';

-- function: get activities requiring review
-- finds agent activities that need human review
create or replace function public.get_activities_requiring_review(
  p_event_id uuid default null
)
returns table(
  activity_id uuid,
  agent_id text,
  activity_type text,
  reasoning text,
  escalation_reason text,
  created_at timestamptz
)
language plpgsql
security definer
as $$
begin
  return query
  select
    s.id,
    s.agent_id,
    s.activity_type,
    s.reasoning,
    s.escalation_reason,
    s.created_at
  from public.agent_sales_activities s
  where s.required_human_review = true
    and s.reviewed_at is null
    and (p_event_id is null or s.event_id = p_event_id)
  order by s.created_at desc;
end;
$$;

comment on function public.get_activities_requiring_review is 'finds agent activities needing human review';

-- =============================================================================
-- grant permissions
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select on public.agent_sales_activities to authenticated;
grant update(reviewed_by, reviewed_at, human_feedback) on public.agent_sales_activities to authenticated;
grant select on public.agent_marketing_activities to authenticated;
grant execute on function public.calculate_agent_performance to authenticated;
grant execute on function public.get_activities_requiring_review to authenticated;
