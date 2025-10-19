-- =====================================================
-- migration: sponsors core table
-- purpose: foundation for ai-powered sponsor management
-- affected tables: sponsors (new)
-- dependencies: auth.users must exist
-- special considerations: includes vector embeddings for ai matching
-- =====================================================

-- enable pgvector extension for semantic search
-- this allows us to store and query sponsor embeddings for ai matching
create extension if not exists vector;

-- create sponsors table
-- stores company profiles for potential and active event sponsors
-- core table for ai sponsor matching, lead scoring, and relationship management
create table public.sponsors (
  id uuid primary key default uuid_generate_v4(),

  -- company information
  company_name text not null,
  industry text not null, -- e.g., "technology", "healthcare", "finance"
  website text,
  logo_url text,

  -- sponsorship preferences (for ai matching)
  industries_of_interest text[] default '{}', -- industries they sponsor
  event_types text[] default '{}', -- e.g., ["conference", "webinar", "workshop"]
  geographic_preferences text[] default '{}', -- e.g., ["north_america", "europe"]
  values text[] default '{}', -- e.g., ["innovation", "sustainability", "diversity"]

  -- budget information (for qualification)
  min_budget numeric(10,2),
  max_budget numeric(10,2),
  currency text default 'USD' check (currency in ('USD', 'EUR', 'GBP', 'CAD')),

  -- contact information
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  primary_contact_title text, -- e.g., "VP Marketing"

  -- decision-making information
  decision_maker_title text, -- who approves sponsorships
  approval_process text, -- e.g., "committee review", "single decision maker"
  typical_response_time_days integer, -- how long they usually take to respond

  -- performance tracking
  total_sponsorships integer default 0, -- lifetime sponsorships completed
  average_roi numeric(5,2), -- average return on investment percentage
  renewal_rate numeric(5,2), -- percentage of sponsorships renewed
  last_sponsorship_date date,

  -- engagement tracking
  last_contact_date timestamptz,
  last_contact_type text, -- e.g., "email", "meeting", "call"
  engagement_score integer default 0 check (engagement_score >= 0 and engagement_score <= 100),
  -- 0-100 score based on: email opens, website visits, content downloads, response speed

  -- ai features: vector embedding for semantic search
  -- 1536 dimensions for openai text-embedding-3-small
  vector_embedding vector(1536),
  -- used by ai to find similar sponsors and match with events

  -- ownership and access control
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  -- metadata for extensibility
  metadata jsonb default '{}'::jsonb,
  -- flexible storage for: linkedin_url, crm_id, notes, custom_fields, etc.

  -- timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments for documentation
comment on table public.sponsors is 'company profiles for potential and active event sponsors';
comment on column public.sponsors.industries_of_interest is 'industries this sponsor typically supports';
comment on column public.sponsors.event_types is 'types of events this sponsor prefers (conference, webinar, etc.)';
comment on column public.sponsors.values is 'company values for alignment matching (innovation, diversity, etc.)';
comment on column public.sponsors.engagement_score is 'ai-calculated engagement score 0-100 based on interactions';
comment on column public.sponsors.vector_embedding is 'openai embedding for semantic sponsor matching';
comment on column public.sponsors.metadata is 'flexible jsonb storage for custom fields and integrations';

-- create indexes for performance
-- foreign key indexes
create index idx_sponsors_created_by on public.sponsors(created_by);

-- query optimization indexes
create index idx_sponsors_industry on public.sponsors(industry);
create index idx_sponsors_company_name on public.sponsors(company_name);
create index idx_sponsors_budget_range on public.sponsors(min_budget, max_budget)
  where min_budget is not null and max_budget is not null;
create index idx_sponsors_engagement on public.sponsors(engagement_score desc)
  where engagement_score > 0;
create index idx_sponsors_last_contact on public.sponsors(last_contact_date desc nulls last);
create index idx_sponsors_created_at on public.sponsors(created_at desc);

-- gin indexes for array and jsonb columns
create index idx_sponsors_industries_interest on public.sponsors using gin(industries_of_interest);
create index idx_sponsors_event_types on public.sponsors using gin(event_types);
create index idx_sponsors_values on public.sponsors using gin(values);
create index idx_sponsors_metadata on public.sponsors using gin(metadata);

-- vector similarity search index (ivfflat for approximate nearest neighbor search)
-- lists parameter controls accuracy vs speed tradeoff (100 is good for up to 1M vectors)
create index idx_sponsors_vector_embedding on public.sponsors
  using ivfflat (vector_embedding vector_cosine_ops)
  with (lists = 100);

-- enable row level security
alter table public.sponsors enable row level security;

-- rls policy: authenticated users can view all sponsors
-- sponsors are shared across the platform for discovery
create policy "authenticated users can view all sponsors"
  on public.sponsors
  for select
  to authenticated
  using (true);

-- rls policy: authenticated users can insert sponsors they create
-- users can add new sponsor contacts to the platform
create policy "authenticated users can insert sponsors"
  on public.sponsors
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

-- rls policy: users can update sponsors they created
-- users can only modify their own sponsor contacts
create policy "users can update their own sponsors"
  on public.sponsors
  for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- rls policy: users can delete sponsors they created
-- users can remove their own sponsor contacts
create policy "users can delete their own sponsors"
  on public.sponsors
  for delete
  to authenticated
  using (created_by = auth.uid());

-- =============================================================================
-- functions
-- =============================================================================

-- function: auto-update updated_at timestamp
create or replace function public.handle_sponsors_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

comment on function public.handle_sponsors_updated_at is 'automatically updates updated_at and updated_by on sponsor changes';

-- trigger: auto-update timestamps
create trigger set_sponsors_updated_at
  before update on public.sponsors
  for each row
  execute function public.handle_sponsors_updated_at();

-- function: calculate engagement score
-- calculates 0-100 engagement score based on recent activities
create or replace function public.calculate_sponsor_engagement_score(
  p_sponsor_id uuid
)
returns integer
language plpgsql
security definer
as $$
declare
  v_score integer := 50; -- base score
  v_days_since_contact integer;
  v_email_engagement numeric;
begin
  -- get days since last contact
  select extract(day from now() - last_contact_date)::integer
  into v_days_since_contact
  from public.sponsors
  where id = p_sponsor_id;

  -- adjust score based on recency
  if v_days_since_contact is null then
    v_score := v_score - 20; -- never contacted
  elsif v_days_since_contact <= 7 then
    v_score := v_score + 30; -- very recent
  elsif v_days_since_contact <= 30 then
    v_score := v_score + 20; -- recent
  elsif v_days_since_contact <= 90 then
    v_score := v_score + 10; -- somewhat recent
  elsif v_days_since_contact > 365 then
    v_score := v_score - 30; -- very stale
  end if;

  -- would add more factors here: email opens, website visits, etc.
  -- this is a simplified version

  -- ensure score is between 0 and 100
  v_score := greatest(0, least(100, v_score));

  return v_score;
end;
$$;

comment on function public.calculate_sponsor_engagement_score is 'calculates engagement score 0-100 based on recent interactions';

-- =============================================================================
-- grant permissions
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select on public.sponsors to authenticated;
grant insert, update, delete on public.sponsors to authenticated;
grant execute on function public.calculate_sponsor_engagement_score to authenticated;

-- =============================================================================
-- sample data (commented out - uncomment for testing)
-- =============================================================================

-- insert into public.sponsors (
--   company_name,
--   industry,
--   website,
--   industries_of_interest,
--   event_types,
--   values,
--   min_budget,
--   max_budget,
--   primary_contact_email,
--   engagement_score
-- ) values
-- (
--   'NVIDIA Corporation',
--   'technology',
--   'https://nvidia.com',
--   array['technology', 'ai', 'gaming']::text[],
--   array['conference', 'summit', 'workshop']::text[],
--   array['innovation', 'education', 'research']::text[],
--   50000,
--   200000,
--   'sponsorships@nvidia.com',
--   85
-- ),
-- (
--   'Google Cloud',
--   'technology',
--   'https://cloud.google.com',
--   array['technology', 'cloud', 'ai']::text[],
--   array['conference', 'hackathon', 'webinar']::text[],
--   array['innovation', 'diversity', 'sustainability']::text[],
--   60000,
--   250000,
--   'events@google.com',
--   92
-- );
