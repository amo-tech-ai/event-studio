-- =====================================================
-- migration: automation workflows engine
-- purpose: workflow orchestration for ai automation (event launch, sponsor outreach, deliverable tracking)
-- affected tables: automation_workflows, workflow_execution_logs, automation_triggers (new)
-- dependencies: events, auth.users must exist
-- special considerations: supports complex multi-step workflows with conditional logic
-- =====================================================

-- =============================================================================
-- 1. automation_workflows table
-- =============================================================================

-- create automation_workflows table
-- stores workflow definitions and execution state for ai automation
create table public.automation_workflows (
  id uuid primary key default uuid_generate_v4(),

  -- event relationship
  event_id uuid not null references public.events(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,

  -- workflow identification
  name text not null,
  description text,
  workflow_type text not null check (workflow_type in (
    'event_launch',           -- complete event launch marketing sequence
    'sponsor_outreach',       -- automated sponsor acquisition workflow
    'attendee_nurture',       -- attendee engagement throughout event lifecycle
    'post_event_followup',    -- post-event thank you and content delivery
    'deliverable_tracking',   -- automated tracking of sponsor deliverables
    'custom'                  -- user-defined custom workflow
  )),

  -- workflow definition (stored as jsonb for flexibility)
  definition jsonb not null,
  -- {
  --   "steps": [
  --     {
  --       "id": "step_1",
  --       "name": "Send announcement email",
  --       "type": "email",
  --       "delay_hours": 0,
  --       "config": {...},
  --       "dependencies": []
  --     },
  --     {
  --       "id": "step_2",
  --       "name": "Post to social media",
  --       "type": "social",
  --       "delay_hours": 1,
  --       "config": {...},
  --       "dependencies": ["step_1"]
  --     }
  --   ],
  --   "error_handling": "continue",
  --   "max_retries": 3
  -- }

  -- status tracking
  status text default 'pending' check (status in (
    'pending',     -- created but not started
    'active',      -- currently executing
    'paused',      -- temporarily paused
    'completed',   -- all steps completed successfully
    'failed',      -- workflow failed
    'cancelled'    -- manually cancelled
  )),

  -- execution tracking
  current_step text, -- id of current step being executed
  steps_completed integer default 0,
  steps_total integer, -- total number of steps in workflow

  -- performance metrics
  tasks_executed integer default 0,
  tasks_successful integer default 0,
  tasks_failed integer default 0,

  -- error handling
  last_error text,
  retry_count integer default 0,
  max_retries integer default 3,

  -- scheduling
  next_execution_at timestamptz,
  -- when the next step should execute

  -- metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "wizard_session_id": "uuid",
  --   "triggered_by": "event_published",
  --   "priority": "high"
  -- }

  -- timestamps
  started_at timestamptz,
  completed_at timestamptz,
  paused_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments
comment on table public.automation_workflows is 'workflow orchestration engine for ai automation';
comment on column public.automation_workflows.definition is 'workflow definition with steps and logic as jsonb';
comment on column public.automation_workflows.current_step is 'id of step currently executing';
comment on column public.automation_workflows.next_execution_at is 'scheduled time for next step execution';

-- create indexes
create index idx_workflows_event on public.automation_workflows(event_id);
create index idx_workflows_created_by on public.automation_workflows(created_by);
create index idx_workflows_type on public.automation_workflows(workflow_type);
create index idx_workflows_status on public.automation_workflows(status);
create index idx_workflows_created on public.automation_workflows(created_at desc);

-- index for finding workflows ready to execute
create index idx_workflows_next_execution on public.automation_workflows(next_execution_at)
  where status = 'active' and next_execution_at is not null;

-- gin index for definition search
create index idx_workflows_definition on public.automation_workflows using gin(definition);

-- enable rls
alter table public.automation_workflows enable row level security;

-- rls policy: organizers can view workflows for their events
create policy "organizers view workflows for their events"
  on public.automation_workflows
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = automation_workflows.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can create workflows for their events
create policy "organizers create workflows for their events"
  on public.automation_workflows
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where events.id = automation_workflows.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can update workflows for their events
create policy "organizers update workflows for their events"
  on public.automation_workflows
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = automation_workflows.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- 2. workflow_execution_logs table
-- =============================================================================

-- create workflow_execution_logs table
-- detailed log of each workflow step execution
create table public.workflow_execution_logs (
  id uuid primary key default uuid_generate_v4(),

  -- workflow relationship
  workflow_id uuid not null references public.automation_workflows(id) on delete cascade,

  -- step details
  step_id text not null,
  step_name text not null,
  action_type text not null,
  -- e.g., "email", "social", "database", "api", "ai_generation"

  -- execution status
  status text not null check (status in (
    'pending',   -- queued for execution
    'running',   -- currently executing
    'success',   -- completed successfully
    'failed',    -- execution failed
    'skipped'    -- skipped due to condition or dependency
  )),

  -- execution details
  input_data jsonb,
  -- data passed to the action
  result jsonb,
  -- result returned by the action
  error_message text,
  error_stack text,

  -- timing
  started_at timestamptz default now(),
  completed_at timestamptz,
  duration_ms integer,
  -- milliseconds to execute

  -- retry tracking
  retry_attempt integer default 0,

  -- metadata
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now() not null
);

-- add comments
comment on table public.workflow_execution_logs is 'detailed execution log for each workflow step';
comment on column public.workflow_execution_logs.action_type is 'type of action executed: email, social, database, api, etc.';
comment on column public.workflow_execution_logs.duration_ms is 'execution time in milliseconds';

-- create indexes
create index idx_execution_logs_workflow on public.workflow_execution_logs(workflow_id, created_at desc);
create index idx_execution_logs_step on public.workflow_execution_logs(step_id);
create index idx_execution_logs_status on public.workflow_execution_logs(status);
create index idx_execution_logs_created on public.workflow_execution_logs(created_at desc);

-- enable rls
alter table public.workflow_execution_logs enable row level security;

-- rls policy: users can view logs for workflows they own
create policy "users view logs for their workflows"
  on public.workflow_execution_logs
  for select
  to authenticated
  using (
    exists (
      select 1 from public.automation_workflows w
      join public.events e on e.id = w.event_id
      where w.id = workflow_execution_logs.workflow_id
      and e.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- 3. automation_triggers table
-- =============================================================================

-- create automation_triggers table
-- defines triggers that start workflows (time-based, event-based, condition-based)
create table public.automation_triggers (
  id uuid primary key default uuid_generate_v4(),

  -- workflow relationship
  workflow_id uuid not null references public.automation_workflows(id) on delete cascade,

  -- trigger details
  trigger_type text not null check (trigger_type in (
    'event_published',        -- when event status changes to published
    'event_date_relative',    -- relative to event date (e.g., "7 days before")
    'time_schedule',          -- at specific time/date
    'proposal_sent',          -- when proposal sent to sponsor
    'deliverable_overdue',    -- when deliverable becomes overdue
    'ticket_milestone',       -- when ticket sales reach threshold
    'manual'                  -- manually triggered by user
  )),

  -- trigger configuration
  trigger_config jsonb not null,
  -- {
  --   "event_status": "published",
  --   "days_before_event": 7,
  --   "time": "09:00",
  --   "ticket_threshold": 100
  -- }

  -- status
  status text default 'active' check (status in (
    'active', 'inactive', 'fired', 'disabled'
  )),
  enabled boolean default true,

  -- execution tracking
  total_fired integer default 0,
  last_triggered_at timestamptz,
  next_trigger_at timestamptz,

  -- metadata
  metadata jsonb default '{}'::jsonb,

  -- timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments
comment on table public.automation_triggers is 'defines triggers that start automation workflows';
comment on column public.automation_triggers.trigger_type is 'what event triggers this workflow';
comment on column public.automation_triggers.trigger_config is 'configuration for trigger logic';

-- create indexes
create index idx_triggers_workflow on public.automation_triggers(workflow_id);
create index idx_triggers_type on public.automation_triggers(trigger_type);
create index idx_triggers_status on public.automation_triggers(status);
create index idx_triggers_enabled on public.automation_triggers(enabled)
  where enabled = true;
create index idx_triggers_next on public.automation_triggers(next_trigger_at)
  where status = 'active' and next_trigger_at is not null;

-- enable rls
alter table public.automation_triggers enable row level security;

-- rls policy: users can manage triggers for their workflows
create policy "users manage triggers for their workflows"
  on public.automation_triggers
  for all
  to authenticated
  using (
    exists (
      select 1 from public.automation_workflows w
      join public.events e on e.id = w.event_id
      where w.id = automation_triggers.workflow_id
      and e.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- functions
-- =============================================================================

-- function: auto-update workflow timestamps
create or replace function public.handle_workflow_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();

  -- track state changes
  if old.status != 'active' and new.status = 'active' then
    new.started_at = coalesce(new.started_at, now());
  end if;

  if old.status != 'completed' and new.status = 'completed' then
    new.completed_at = now();
  end if;

  if old.status != 'paused' and new.status = 'paused' then
    new.paused_at = now();
  end if;

  if old.status != 'cancelled' and new.status = 'cancelled' then
    new.cancelled_at = now();
  end if;

  return new;
end;
$$;

comment on function public.handle_workflow_updated_at is 'auto-updates timestamps on workflow state changes';

-- trigger for workflows
create trigger set_workflow_updated_at
  before update on public.automation_workflows
  for each row
  execute function public.handle_workflow_updated_at();

-- function: log workflow step execution
-- helper function for workflow engine to log step execution
create or replace function public.log_workflow_step(
  p_workflow_id uuid,
  p_step_id text,
  p_step_name text,
  p_action_type text,
  p_status text,
  p_result jsonb default null,
  p_error_message text default null,
  p_duration_ms integer default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_log_id uuid;
begin
  insert into public.workflow_execution_logs (
    workflow_id,
    step_id,
    step_name,
    action_type,
    status,
    result,
    error_message,
    duration_ms,
    completed_at
  ) values (
    p_workflow_id,
    p_step_id,
    p_step_name,
    p_action_type,
    p_status,
    p_result,
    p_error_message,
    p_duration_ms,
    case when p_status in ('success', 'failed', 'skipped') then now() else null end
  )
  returning id into v_log_id;

  -- update workflow step counter
  if p_status = 'success' then
    update public.automation_workflows
    set
      steps_completed = steps_completed + 1,
      tasks_successful = tasks_successful + 1,
      tasks_executed = tasks_executed + 1,
      current_step = p_step_id
    where id = p_workflow_id;
  elsif p_status = 'failed' then
    update public.automation_workflows
    set
      tasks_failed = tasks_failed + 1,
      tasks_executed = tasks_executed + 1,
      last_error = p_error_message
    where id = p_workflow_id;
  end if;

  return v_log_id;
end;
$$;

comment on function public.log_workflow_step is 'logs workflow step execution and updates counters';

-- function: find workflows ready to execute
-- called by workflow engine scheduler
create or replace function public.find_ready_workflows()
returns table(
  workflow_id uuid,
  workflow_name text,
  workflow_type text,
  next_step jsonb
)
language plpgsql
security definer
as $$
begin
  return query
  select
    w.id,
    w.name,
    w.workflow_type,
    w.definition->'steps'->0 as next_step
  from public.automation_workflows w
  where w.status = 'active'
    and w.next_execution_at <= now()
  order by w.next_execution_at asc
  limit 100;
end;
$$;

comment on function public.find_ready_workflows is 'finds workflows that are ready to execute next step';

-- =============================================================================
-- grant permissions
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.automation_workflows to authenticated;
grant select on public.workflow_execution_logs to authenticated;
grant select, insert, update, delete on public.automation_triggers to authenticated;
grant execute on function public.log_workflow_step to authenticated;
grant execute on function public.find_ready_workflows to authenticated;
