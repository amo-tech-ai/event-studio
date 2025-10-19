-- =====================================================
-- Migration: wizard_sessions table
-- Purpose: Track CopilotKit Event Wizard state and progress
-- Affected tables: wizard_sessions (new)
-- Dependencies: events table must exist
-- Special considerations: Supports both single-tenant (profiles) and multi-tenant (accounts) architectures
-- =====================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create wizard_sessions table
-- This table persists the state of the CopilotKit Event Wizard across all 6 stages
-- Enables state recovery after browser refresh and tracks completion metrics
create table public.wizard_sessions (
  id uuid primary key default uuid_generate_v4(),

  -- User identification
  -- NOTE: user_id can be NULL during Stage 1 (before contact info captured)
  -- For multi-tenant: references users(id)
  -- For single-tenant: references profiles(id)
  user_id uuid references auth.users(id) on delete set null,

  -- Contact info captured during Stage 1 (before auth)
  contact_email text,
  contact_name text,
  contact_company text,
  contact_role text,

  -- Wizard progress tracking
  current_stage text not null check (current_stage in (
    'contact_info',
    'event_basics',
    'venue_selection',
    'ticketing',
    'marketing',
    'review',
    'completed'
  )),

  -- Array of completed stages for progress tracking
  stages_completed text[] default '{}',

  -- Linked event (created during Stage 2: Event Basics)
  event_id uuid references public.events(id) on delete cascade,

  -- Full wizard state as JSONB for CopilotKit state persistence
  -- Stores: contactInfo, eventData, venueData, ticketingData, marketingData
  state jsonb default '{}'::jsonb,

  -- Session metrics for analytics
  started_at timestamptz default now() not null,
  last_activity_at timestamptz default now() not null,
  completed_at timestamptz,

  -- Engagement tracking
  total_messages integer default 0,
  time_spent_seconds integer default 0,

  -- Source tracking
  referrer text,
  user_agent text,

  -- Session status
  status text default 'active' not null check (status in ('active', 'abandoned', 'completed')),

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Add comments for documentation
comment on table public.wizard_sessions is 'Tracks CopilotKit Event Wizard progress and state across all 6 stages';
comment on column public.wizard_sessions.user_id is 'References auth.users. NULL until user creates account (may be after Stage 1)';
comment on column public.wizard_sessions.contact_email is 'Email captured during Stage 1 before authentication';
comment on column public.wizard_sessions.current_stage is 'Current wizard stage: contact_info → event_basics → venue_selection → ticketing → marketing → review → completed';
comment on column public.wizard_sessions.stages_completed is 'Array of completed stage names for progress tracking';
comment on column public.wizard_sessions.state is 'Full CopilotKit wizard state as JSONB for recovery and persistence';
comment on column public.wizard_sessions.total_messages is 'Number of AI messages sent during wizard session';
comment on column public.wizard_sessions.time_spent_seconds is 'Total time spent in wizard (target: <300 seconds)';

-- Create indexes for performance
create index idx_wizard_sessions_user_id on public.wizard_sessions(user_id);
create index idx_wizard_sessions_contact_email on public.wizard_sessions(contact_email);
create index idx_wizard_sessions_event_id on public.wizard_sessions(event_id);
create index idx_wizard_sessions_current_stage on public.wizard_sessions(current_stage);
create index idx_wizard_sessions_status on public.wizard_sessions(status);
create index idx_wizard_sessions_started_at on public.wizard_sessions(started_at desc);
create index idx_wizard_sessions_last_activity on public.wizard_sessions(last_activity_at desc) where status = 'active';

-- Create GIN index for JSONB state queries
create index idx_wizard_sessions_state on public.wizard_sessions using gin(state);

-- Enable Row Level Security
alter table public.wizard_sessions enable row level security;

-- RLS Policy: Users can view their own wizard sessions
create policy "users can view own wizard sessions"
  on public.wizard_sessions
  for select
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = user_id
  );

-- RLS Policy: Anonymous users can view sessions by contact email (before auth)
create policy "anonymous can view sessions by email"
  on public.wizard_sessions
  for select
  to anon
  using (
    contact_email is not null
    -- Additional validation could be added (e.g., session token)
  );

-- RLS Policy: Authenticated users can create wizard sessions
create policy "authenticated users can create wizard sessions"
  on public.wizard_sessions
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and (user_id is null or auth.uid() = user_id)
  );

-- RLS Policy: Anonymous users can create wizard sessions (before auth)
create policy "anonymous can create wizard sessions"
  on public.wizard_sessions
  for insert
  to anon
  with check (
    user_id is null
    and contact_email is not null
  );

-- RLS Policy: Users can update their own wizard sessions
create policy "users can update own wizard sessions"
  on public.wizard_sessions
  for update
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = user_id
  )
  with check (
    auth.uid() is not null
    and auth.uid() = user_id
  );

-- RLS Policy: Anonymous can update sessions by email (before auth)
create policy "anonymous can update sessions by email"
  on public.wizard_sessions
  for update
  to anon
  using (
    user_id is null
    and contact_email is not null
  )
  with check (
    user_id is null
    and contact_email is not null
  );

-- Function: Automatically update updated_at timestamp
create or replace function public.update_wizard_session_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  new.last_activity_at = now();
  return new;
end;
$$;

comment on function public.update_wizard_session_updated_at() is 'Automatically updates updated_at and last_activity_at on wizard session updates';

-- Trigger: Auto-update timestamps
create trigger set_wizard_session_updated_at
  before update on public.wizard_sessions
  for each row
  execute function public.update_wizard_session_updated_at();

-- Function: Mark wizard session as abandoned after 24 hours of inactivity
create or replace function public.mark_abandoned_wizard_sessions()
returns integer
language plpgsql
security definer
as $$
declare
  affected_count integer;
begin
  -- Mark sessions as abandoned if inactive for 24+ hours and not completed
  update public.wizard_sessions
  set
    status = 'abandoned',
    updated_at = now()
  where
    status = 'active'
    and current_stage != 'completed'
    and last_activity_at < (now() - interval '24 hours');

  get diagnostics affected_count = row_count;
  return affected_count;
end;
$$;

comment on function public.mark_abandoned_wizard_sessions() is 'Marks wizard sessions as abandoned after 24 hours of inactivity. Should be called by cron job.';

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.wizard_sessions to anon;
grant select, insert, update, delete on public.wizard_sessions to authenticated;

-- Sample data for development (optional - remove in production)
-- insert into public.wizard_sessions (
--   contact_email,
--   contact_name,
--   contact_company,
--   current_stage,
--   stages_completed,
--   state
-- ) values (
--   'sarah.johnson@techcorp.com',
--   'Sarah Johnson',
--   'TechCorp',
--   'event_basics',
--   array['contact_info']::text[],
--   '{"contactInfo": {"name": "Sarah Johnson", "email": "sarah.johnson@techcorp.com", "company": "TechCorp"}}'::jsonb
-- );
