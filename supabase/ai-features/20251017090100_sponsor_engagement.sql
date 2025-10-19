-- =====================================================
-- migration: sponsor engagement tracking
-- purpose: track all sponsor interactions, proposals, lead scores, and follow-ups
-- affected tables: sponsor_activities, sponsor_proposals, sponsor_lead_scores, follow_up_sequences (new)
-- dependencies: sponsors, events, auth.users must exist
-- special considerations: comprehensive tracking for ai sales agent
-- =====================================================

-- =============================================================================
-- 1. sponsor_activities table
-- =============================================================================

-- create sponsor_activities table
-- tracks every interaction with sponsors for engagement scoring and ai learning
create table public.sponsor_activities (
  id uuid primary key default uuid_generate_v4(),

  -- relationships
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  -- event_id is optional: some activities are not event-specific

  -- activity details
  activity_type text not null check (activity_type in (
    'email_sent',           -- email sent to sponsor
    'email_opened',         -- sponsor opened email
    'email_clicked',        -- sponsor clicked link in email
    'proposal_sent',        -- proposal sent
    'proposal_viewed',      -- sponsor viewed proposal
    'proposal_downloaded',  -- sponsor downloaded proposal
    'meeting_scheduled',    -- meeting scheduled
    'meeting_completed',    -- meeting took place
    'call_completed',       -- phone call completed
    'linkedin_message',     -- contacted via linkedin
    'website_visit',        -- sponsor visited event website
    'contract_sent',        -- contract sent
    'contract_signed',      -- sponsorship confirmed
    'payment_received',     -- payment processed
    'sponsorship_completed',-- sponsorship fulfilled
    'feedback_received',    -- post-event feedback
    'renewal_discussion',   -- discussing renewal
    'declined',            -- sponsor declined opportunity
    'unresponsive'         -- marked as unresponsive after multiple attempts
  )),

  -- activity metadata
  metadata jsonb default '{}'::jsonb,
  -- flexible storage for:
  -- {
  --   "email_subject": "...",
  --   "proposal_amount": 50000,
  --   "meeting_duration_minutes": 30,
  --   "decline_reason": "budget constraints",
  --   "automated": true/false
  -- }

  -- user tracking
  performed_by uuid references auth.users(id) on delete set null,
  -- null if performed by ai agent

  -- timestamps
  created_at timestamptz default now() not null
);

-- add comments
comment on table public.sponsor_activities is 'tracks all interactions with sponsors for engagement scoring';
comment on column public.sponsor_activities.activity_type is 'type of interaction with sponsor';
comment on column public.sponsor_activities.metadata is 'flexible jsonb storage for activity-specific data';
comment on column public.sponsor_activities.performed_by is 'user who performed activity, null for ai agent';

-- create indexes
create index idx_sponsor_activities_sponsor on public.sponsor_activities(sponsor_id, created_at desc);
create index idx_sponsor_activities_event on public.sponsor_activities(event_id, created_at desc)
  where event_id is not null;
create index idx_sponsor_activities_type on public.sponsor_activities(activity_type);
create index idx_sponsor_activities_created on public.sponsor_activities(created_at desc);
create index idx_sponsor_activities_metadata on public.sponsor_activities using gin(metadata);

-- enable rls
alter table public.sponsor_activities enable row level security;

-- rls policy: users can view activities for sponsors they created
create policy "users view activities for their sponsors"
  on public.sponsor_activities
  for select
  to authenticated
  using (
    exists (
      select 1 from public.sponsors
      where sponsors.id = sponsor_activities.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- rls policy: users can insert activities for their sponsors
create policy "users insert activities for their sponsors"
  on public.sponsor_activities
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.sponsors
      where sponsors.id = sponsor_activities.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- =============================================================================
-- 2. sponsor_proposals table
-- =============================================================================

-- create sponsor_proposals table
-- stores ai-generated and manual sponsorship proposals
create table public.sponsor_proposals (
  id uuid primary key default uuid_generate_v4(),

  -- relationships
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,

  -- proposal details
  title text not null,
  package_level text not null check (package_level in (
    'platinum', 'gold', 'silver', 'bronze', 'custom'
  )),
  proposed_amount numeric(10,2) not null check (proposed_amount >= 0),
  currency text default 'USD',

  -- proposal content (stored as structured json)
  content jsonb not null,
  -- {
  --   "executive_summary": "...",
  --   "event_overview": "...",
  --   "audience_profile": {...},
  --   "sponsorship_packages": [{...}],
  --   "benefits": [{...}],
  --   "roi_projection": {...},
  --   "deliverables": [{...}],
  --   "testimonials": [{...}],
  --   "call_to_action": "..."
  -- }

  -- generation metadata
  generated_by text default 'manual' check (generated_by in ('ai', 'manual', 'hybrid')),
  generation_time_seconds integer,
  ai_model_used text, -- e.g., "gpt-4o"
  ai_confidence_score numeric(5,2), -- 0-100 confidence in generated content

  -- status tracking
  status text default 'draft' check (status in (
    'draft',        -- being created
    'review',       -- awaiting internal review
    'sent',         -- sent to sponsor
    'viewed',       -- sponsor viewed proposal
    'accepted',     -- sponsor accepted
    'rejected',     -- sponsor rejected
    'negotiating',  -- in negotiation
    'expired'       -- offer expired
  )),

  -- engagement tracking
  sent_at timestamptz,
  first_viewed_at timestamptz,
  total_views integer default 0,
  time_spent_viewing_seconds integer default 0,
  sections_viewed text[] default '{}', -- which sections were viewed
  links_clicked text[] default '{}',   -- which links were clicked

  -- response tracking
  responded_at timestamptz,
  response_time_hours integer, -- time from sent to first response
  response_type text check (response_type in (
    'accepted', 'rejected', 'counter_offer', 'needs_more_info', 'not_interested'
  )),
  feedback_text text,
  rejection_reason text,

  -- document generation
  pdf_url text,
  pdf_generated_at timestamptz,

  -- version control
  version integer default 1,
  previous_version_id uuid references public.sponsor_proposals(id),

  -- timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments
comment on table public.sponsor_proposals is 'ai-generated and manual sponsorship proposals';
comment on column public.sponsor_proposals.content is 'full proposal content as structured jsonb';
comment on column public.sponsor_proposals.generated_by is 'how proposal was created: ai, manual, or hybrid';
comment on column public.sponsor_proposals.total_views is 'number of times proposal was viewed by sponsor';

-- create indexes
create index idx_sponsor_proposals_event on public.sponsor_proposals(event_id);
create index idx_sponsor_proposals_sponsor on public.sponsor_proposals(sponsor_id);
create index idx_sponsor_proposals_status on public.sponsor_proposals(status);
create index idx_sponsor_proposals_created on public.sponsor_proposals(created_at desc);
create index idx_sponsor_proposals_sent on public.sponsor_proposals(sent_at desc nulls last);
create index idx_sponsor_proposals_content on public.sponsor_proposals using gin(content);

-- enable rls
alter table public.sponsor_proposals enable row level security;

-- rls policy: organizers can view proposals for their events
create policy "organizers view proposals for their events"
  on public.sponsor_proposals
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = sponsor_proposals.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can create proposals for their events
create policy "organizers create proposals for their events"
  on public.sponsor_proposals
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where events.id = sponsor_proposals.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can update proposals for their events
create policy "organizers update proposals for their events"
  on public.sponsor_proposals
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = sponsor_proposals.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- 3. sponsor_lead_scores table
-- =============================================================================

-- create sponsor_lead_scores table
-- ai-calculated scores for prioritizing sponsor outreach
create table public.sponsor_lead_scores (
  id uuid primary key default uuid_generate_v4(),

  -- relationships
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  -- event_id optional: can score sponsors generally or for specific event

  -- score
  score integer not null check (score >= 0 and score <= 100),
  conversion_probability numeric(5,4) check (conversion_probability >= 0 and conversion_probability <= 1),
  -- 0.0000 to 1.0000 (0% to 100%)
  confidence_level text check (confidence_level in ('low', 'medium', 'high')),

  -- priority assignment
  priority text not null check (priority in ('hot', 'warm', 'cold', 'unqualified')),
  -- hot: 80-100, warm: 60-79, cold: 40-59, unqualified: 0-39

  -- insights (ai-generated)
  insights jsonb default '{}'::jsonb,
  -- {
  --   "strengths": ["High engagement rate", "Perfect budget fit"],
  --   "concerns": ["No past sponsorships in this industry"],
  --   "opportunities": ["Recently expanded marketing budget"],
  --   "red_flags": ["Negative reviews from past events"]
  -- }

  -- recommended actions
  recommended_actions jsonb default '[]'::jsonb,
  -- [
  --   {"action": "send_proposal", "priority": 1, "timing": "immediately", "reason": "..."},
  --   {"action": "schedule_call", "priority": 2, "timing": "this_week", "reason": "..."}
  -- ]

  -- feature importance (which factors contributed most to score)
  top_features jsonb,
  -- {"industry_match": 0.35, "engagement_score": 0.28, "budget_fit": 0.22, ...}

  -- model metadata
  model_version text,
  model_type text, -- e.g., "xgboost", "random_forest", "neural_network"
  scored_at timestamptz default now(),

  -- status
  status text default 'active' check (status in ('active', 'converted', 'lost', 'archived')),
  converted_at timestamptz,
  conversion_value numeric(10,2), -- actual sponsorship amount if converted

  -- timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments
comment on table public.sponsor_lead_scores is 'ai-calculated lead scores for prioritizing outreach';
comment on column public.sponsor_lead_scores.score is 'lead quality score 0-100';
comment on column public.sponsor_lead_scores.conversion_probability is 'predicted probability of closing deal';
comment on column public.sponsor_lead_scores.priority is 'priority level: hot, warm, cold, unqualified';
comment on column public.sponsor_lead_scores.insights is 'ai-generated insights about lead quality';
comment on column public.sponsor_lead_scores.top_features is 'which factors contributed most to score';

-- create indexes
create index idx_lead_scores_sponsor on public.sponsor_lead_scores(sponsor_id);
create index idx_lead_scores_event on public.sponsor_lead_scores(event_id) where event_id is not null;
create index idx_lead_scores_priority on public.sponsor_lead_scores(priority, score desc);
create index idx_lead_scores_score on public.sponsor_lead_scores(score desc);
create index idx_lead_scores_status on public.sponsor_lead_scores(status);
create index idx_lead_scores_scored on public.sponsor_lead_scores(scored_at desc);

-- enable rls
alter table public.sponsor_lead_scores enable row level security;

-- rls policy: users can view scores for their sponsors
create policy "users view scores for their sponsors"
  on public.sponsor_lead_scores
  for select
  to authenticated
  using (
    exists (
      select 1 from public.sponsors
      where sponsors.id = sponsor_lead_scores.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- rls policy: users can insert scores for their sponsors
create policy "users insert scores for their sponsors"
  on public.sponsor_lead_scores
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.sponsors
      where sponsors.id = sponsor_lead_scores.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- rls policy: users can update scores for their sponsors
create policy "users update scores for their sponsors"
  on public.sponsor_lead_scores
  for update
  to authenticated
  using (
    exists (
      select 1 from public.sponsors
      where sponsors.id = sponsor_lead_scores.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- =============================================================================
-- 4. follow_up_sequences table
-- =============================================================================

-- create follow_up_sequences table
-- manages automated email follow-up sequences for sponsors
create table public.follow_up_sequences (
  id uuid primary key default uuid_generate_v4(),

  -- relationships
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  proposal_id uuid references public.sponsor_proposals(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,

  -- sequence details
  sequence_name text not null,
  sequence_type text not null check (sequence_type in (
    'post_proposal',    -- after sending proposal
    'post_meeting',     -- after meeting
    'nurture',         -- long-term relationship building
    're_engagement',   -- re-engaging cold leads
    'renewal',         -- renewal outreach
    'custom'          -- custom sequence
  )),

  -- status
  status text default 'active' check (status in (
    'draft', 'active', 'paused', 'completed', 'cancelled'
  )),

  -- emails in sequence (stored as array of email objects)
  emails jsonb not null,
  -- [
  --   {
  --     "step": 1,
  --     "day_offset": 0,
  --     "subject": "...",
  --     "body": "...",
  --     "send_time": "09:00",
  --     "sent_at": null,
  --     "opened_at": null,
  --     "clicked_at": null,
  --     "status": "pending"
  --   }
  -- ]

  -- performance tracking
  total_emails integer default 0,
  emails_sent integer default 0,
  emails_opened integer default 0,
  emails_clicked integer default 0,
  replies_received integer default 0,

  -- conversion tracking
  converted boolean default false,
  converted_at timestamptz,
  conversion_step integer, -- which email in sequence led to conversion

  -- metadata
  metadata jsonb default '{}'::jsonb,

  -- timestamps
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments
comment on table public.follow_up_sequences is 'automated email follow-up sequences for sponsors';
comment on column public.follow_up_sequences.emails is 'array of email objects in sequence';
comment on column public.follow_up_sequences.conversion_step is 'which email led to conversion';

-- create indexes
create index idx_follow_up_sequences_sponsor on public.follow_up_sequences(sponsor_id);
create index idx_follow_up_sequences_proposal on public.follow_up_sequences(proposal_id) where proposal_id is not null;
create index idx_follow_up_sequences_event on public.follow_up_sequences(event_id) where event_id is not null;
create index idx_follow_up_sequences_status on public.follow_up_sequences(status);
create index idx_follow_up_sequences_started on public.follow_up_sequences(started_at desc nulls last);

-- enable rls
alter table public.follow_up_sequences enable row level security;

-- rls policy: users can view sequences for their sponsors
create policy "users view sequences for their sponsors"
  on public.follow_up_sequences
  for select
  to authenticated
  using (
    exists (
      select 1 from public.sponsors
      where sponsors.id = follow_up_sequences.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- rls policy: users can create sequences for their sponsors
create policy "users create sequences for their sponsors"
  on public.follow_up_sequences
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.sponsors
      where sponsors.id = follow_up_sequences.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- rls policy: users can update sequences for their sponsors
create policy "users update sequences for their sponsors"
  on public.follow_up_sequences
  for update
  to authenticated
  using (
    exists (
      select 1 from public.sponsors
      where sponsors.id = follow_up_sequences.sponsor_id
      and sponsors.created_by = auth.uid()
    )
  );

-- =============================================================================
-- functions
-- =============================================================================

-- function: auto-update updated_at for proposals
create or replace function public.handle_proposal_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();

  -- track first view
  if old.total_views = 0 and new.total_views > 0 and new.first_viewed_at is null then
    new.first_viewed_at = now();
  end if;

  -- calculate response time when first response received
  if old.responded_at is null and new.responded_at is not null and new.sent_at is not null then
    new.response_time_hours = extract(epoch from (new.responded_at - new.sent_at)) / 3600;
  end if;

  return new;
end;
$$;

-- trigger for proposals
create trigger set_proposal_updated_at
  before update on public.sponsor_proposals
  for each row
  execute function public.handle_proposal_updated_at();

-- function: auto-update updated_at for sequences
create or replace function public.handle_sequence_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- trigger for sequences
create trigger set_sequence_updated_at
  before update on public.follow_up_sequences
  for each row
  execute function public.handle_sequence_updated_at();

-- =============================================================================
-- grant permissions
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select, insert on public.sponsor_activities to authenticated;
grant select, insert, update on public.sponsor_proposals to authenticated;
grant select, insert, update on public.sponsor_lead_scores to authenticated;
grant select, insert, update on public.follow_up_sequences to authenticated;
