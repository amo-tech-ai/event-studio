-- =====================================================
-- migration: ai agents - operations and support
-- purpose: activity tracking for operations and support ai agents
-- affected tables: agent_operations_activities, agent_support_activities (new)
-- dependencies: events, auth.users must exist
-- special considerations: tracks 24/7 automated operations monitoring and support
-- =====================================================

-- =============================================================================
-- 1. agent_operations_activities table
-- =============================================================================

-- create agent_operations_activities table
-- tracks all actions performed by the operations ai agent
create table public.agent_operations_activities (
  id uuid primary key default uuid_generate_v4(),

  -- agent identification
  agent_id text default 'operations_agent',
  agent_version text,

  -- activity details
  activity_type text not null check (activity_type in (
    'deliverable_check',      -- checked deliverable status
    'reminder_sent',          -- sent reminder for overdue item
    'escalation',             -- escalated urgent issue
    'ticket_sales_monitored', -- monitored ticket sales velocity
    'budget_tracked',         -- tracked budget vs spending
    'status_report_generated', -- generated status report
    'deadline_alert',         -- alerted about approaching deadline
    'resource_allocated',     -- allocated resources
    'timeline_adjusted',      -- adjusted project timeline
    'risk_identified',        -- identified potential risk
    'issue_resolved'          -- resolved operational issue automatically
  )),

  -- context
  event_id uuid references public.events(id) on delete set null,

  -- activity data
  input_data jsonb,
  -- what the agent was monitoring/checking
  output_data jsonb,
  -- what the agent found/did
  action_taken jsonb,
  -- specific actions taken by agent
  -- {
  --   "action": "sent_reminder",
  --   "recipient": "sponsor@example.com",
  --   "urgency": "high",
  --   "next_action": "escalate_if_no_response_24h"
  -- }

  -- severity assessment
  severity text check (severity in (
    'low',      -- informational, no action needed
    'medium',   -- worth monitoring
    'high',     -- action needed soon
    'critical'  -- immediate action required
  )),

  -- results
  status text default 'success' check (status in (
    'success',     -- action completed successfully
    'failed',      -- action failed
    'pending',     -- action queued
    'escalated'    -- escalated to human
  )),
  error_message text,

  -- resolution tracking
  resolved boolean default false,
  resolved_at timestamptz,
  resolution_notes text,

  -- autonomy tracking
  autonomous boolean default true,
  required_human_intervention boolean default false,
  escalation_reason text,

  -- performance tracking
  duration_ms integer,
  api_calls_made integer default 0,

  -- metadata
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now() not null
);

-- add comments
comment on table public.agent_operations_activities is 'tracks all actions by operations ai agent';
comment on column public.agent_operations_activities.severity is 'severity of issue identified: low, medium, high, critical';
comment on column public.agent_operations_activities.action_taken is 'specific actions taken by agent';

-- create indexes
create index idx_operations_activities_event on public.agent_operations_activities(event_id, created_at desc)
  where event_id is not null;
create index idx_operations_activities_type on public.agent_operations_activities(activity_type);
create index idx_operations_activities_severity on public.agent_operations_activities(severity);
create index idx_operations_activities_status on public.agent_operations_activities(status);
create index idx_operations_activities_created on public.agent_operations_activities(created_at desc);
create index idx_operations_activities_agent on public.agent_operations_activities(agent_id, agent_version);

-- index for finding unresolved issues
create index idx_operations_activities_unresolved on public.agent_operations_activities(resolved, severity)
  where resolved = false;

-- index for escalations
create index idx_operations_activities_escalated on public.agent_operations_activities(required_human_intervention)
  where required_human_intervention = true;

-- gin indexes for jsonb
create index idx_operations_activities_input on public.agent_operations_activities using gin(input_data);
create index idx_operations_activities_output on public.agent_operations_activities using gin(output_data);
create index idx_operations_activities_action on public.agent_operations_activities using gin(action_taken);

-- enable rls
alter table public.agent_operations_activities enable row level security;

-- rls policy: organizers can view operations activities for their events
create policy "organizers view operations activities for their events"
  on public.agent_operations_activities
  for select
  to authenticated
  using (
    event_id is null or exists (
      select 1 from public.events
      where events.id = agent_operations_activities.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can update resolution status
create policy "organizers update resolution status"
  on public.agent_operations_activities
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = agent_operations_activities.event_id
      and events.organizer_id = auth.uid()
    )
  )
  with check (
    -- can only update resolution fields
    resolved = true and resolved_at is not null
  );

-- =============================================================================
-- 2. agent_support_activities table
-- =============================================================================

-- create agent_support_activities table
-- tracks all interactions handled by the support ai agent
create table public.agent_support_activities (
  id uuid primary key default uuid_generate_v4(),

  -- agent identification
  agent_id text default 'support_agent',
  agent_version text,

  -- activity details
  activity_type text not null check (activity_type in (
    'question_answered',      -- answered user question
    'ticket_lookup',          -- looked up ticket information
    'ticket_resent',          -- resent ticket confirmation
    'ticket_transferred',     -- transferred ticket to different attendee
    'refund_processed',       -- processed refund request
    'issue_resolved',         -- resolved support issue
    'escalated_to_human',     -- escalated to human agent
    'feedback_collected',     -- collected user feedback
    'faq_suggested',          -- suggested faq article
    'knowledge_base_search'   -- searched knowledge base
  )),

  -- context
  event_id uuid references public.events(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  -- null if anonymous user

  -- interaction details
  user_question text not null,
  -- original question from user
  user_email text,
  -- user's email (for anonymous users)
  ai_response text not null,
  -- agent's response

  -- knowledge base context
  knowledge_base_articles_used text[],
  -- array of article ids/slugs used to answer
  confidence_score numeric(5,2),
  -- 0-100 confidence in response

  -- resolution tracking
  auto_resolved boolean default true,
  -- true if agent resolved without human
  user_satisfied boolean,
  -- did user mark response as helpful?
  user_feedback text,
  -- optional feedback from user

  -- escalation tracking
  escalated boolean default false,
  escalation_reason text,
  escalated_to uuid references auth.users(id) on delete set null,
  escalated_at timestamptz,

  -- conversation tracking
  conversation_id uuid,
  -- groups related messages in same conversation
  message_sequence integer default 1,
  -- order of messages in conversation

  -- performance tracking
  response_time_ms integer,
  -- time to generate response
  llm_tokens_used integer,

  -- metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "channel": "chat",
  --   "sentiment": "neutral",
  --   "category": "ticketing",
  --   "priority": "normal"
  -- }

  created_at timestamptz default now() not null
);

-- add comments
comment on table public.agent_support_activities is 'tracks all interactions by support ai agent';
comment on column public.agent_support_activities.user_question is 'original question from user';
comment on column public.agent_support_activities.ai_response is 'ai agent response';
comment on column public.agent_support_activities.auto_resolved is 'whether agent resolved without human help';
comment on column public.agent_support_activities.confidence_score is 'confidence in response 0-100';

-- create indexes
create index idx_support_activities_event on public.agent_support_activities(event_id, created_at desc)
  where event_id is not null;
create index idx_support_activities_user on public.agent_support_activities(user_id, created_at desc)
  where user_id is not null;
create index idx_support_activities_email on public.agent_support_activities(user_email)
  where user_email is not null;
create index idx_support_activities_type on public.agent_support_activities(activity_type);
create index idx_support_activities_conversation on public.agent_support_activities(conversation_id, message_sequence)
  where conversation_id is not null;
create index idx_support_activities_created on public.agent_support_activities(created_at desc);
create index idx_support_activities_agent on public.agent_support_activities(agent_id, agent_version);

-- index for finding unresolved escalations
create index idx_support_activities_escalated on public.agent_support_activities(escalated, escalated_at)
  where escalated = true and escalated_to is null;

-- index for measuring auto-resolution rate
create index idx_support_activities_auto_resolved on public.agent_support_activities(auto_resolved);

-- gin index for metadata
create index idx_support_activities_metadata on public.agent_support_activities using gin(metadata);

-- full text search index on questions and responses
create index idx_support_activities_question_search on public.agent_support_activities
  using gin(to_tsvector('english', user_question));
create index idx_support_activities_response_search on public.agent_support_activities
  using gin(to_tsvector('english', ai_response));

-- enable rls
alter table public.agent_support_activities enable row level security;

-- rls policy: organizers can view support activities for their events
create policy "organizers view support activities for their events"
  on public.agent_support_activities
  for select
  to authenticated
  using (
    event_id is null or exists (
      select 1 from public.events
      where events.id = agent_support_activities.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: users can view their own support interactions
create policy "users view their own support interactions"
  on public.agent_support_activities
  for select
  to authenticated
  using (
    user_id = auth.uid()
  );

-- =============================================================================
-- functions
-- =============================================================================

-- function: get unresolved operational issues
-- finds critical operational issues requiring attention
create or replace function public.get_unresolved_operational_issues(
  p_event_id uuid default null,
  p_min_severity text default 'medium'
)
returns table(
  activity_id uuid,
  activity_type text,
  severity text,
  description text,
  created_at timestamptz
)
language plpgsql
security definer
as $$
declare
  v_severity_order text[] := array['low', 'medium', 'high', 'critical'];
  v_min_severity_index integer;
begin
  -- get severity threshold index
  v_min_severity_index := array_position(v_severity_order, p_min_severity);

  return query
  select
    o.id,
    o.activity_type,
    o.severity,
    o.output_data::text as description,
    o.created_at
  from public.agent_operations_activities o
  where o.resolved = false
    and array_position(v_severity_order, o.severity) >= v_min_severity_index
    and (p_event_id is null or o.event_id = p_event_id)
  order by
    array_position(v_severity_order, o.severity) desc,
    o.created_at asc;
end;
$$;

comment on function public.get_unresolved_operational_issues is 'finds unresolved operational issues by severity';

-- function: calculate support metrics
-- calculates support agent performance metrics
create or replace function public.calculate_support_metrics(
  p_event_id uuid default null,
  p_start_date timestamptz default now() - interval '7 days',
  p_end_date timestamptz default now()
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_total_interactions integer;
  v_auto_resolved integer;
  v_escalated integer;
  v_avg_response_time numeric;
  v_satisfaction_rate numeric;
begin
  select
    count(*),
    count(*) filter (where auto_resolved = true),
    count(*) filter (where escalated = true),
    avg(response_time_ms),
    count(*) filter (where user_satisfied = true)::numeric / nullif(count(*) filter (where user_satisfied is not null), 0)
  into
    v_total_interactions,
    v_auto_resolved,
    v_escalated,
    v_avg_response_time,
    v_satisfaction_rate
  from public.agent_support_activities
  where created_at between p_start_date and p_end_date
    and (p_event_id is null or event_id = p_event_id);

  return jsonb_build_object(
    'total_interactions', v_total_interactions,
    'auto_resolved', v_auto_resolved,
    'auto_resolution_rate', case
      when v_total_interactions > 0 then round((v_auto_resolved::numeric / v_total_interactions) * 100, 2)
      else 0
    end,
    'escalated', v_escalated,
    'escalation_rate', case
      when v_total_interactions > 0 then round((v_escalated::numeric / v_total_interactions) * 100, 2)
      else 0
    end,
    'avg_response_time_ms', round(v_avg_response_time, 0),
    'satisfaction_rate', round(coalesce(v_satisfaction_rate, 0) * 100, 2)
  );
end;
$$;

comment on function public.calculate_support_metrics is 'calculates support agent performance metrics';

-- =============================================================================
-- grant permissions
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select on public.agent_operations_activities to authenticated;
grant update(resolved, resolved_at, resolution_notes) on public.agent_operations_activities to authenticated;
grant select on public.agent_support_activities to authenticated;
grant execute on function public.get_unresolved_operational_issues to authenticated;
grant execute on function public.calculate_support_metrics to authenticated;
