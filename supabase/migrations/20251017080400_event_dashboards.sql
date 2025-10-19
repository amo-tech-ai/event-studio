-- =====================================================
-- Migration: event_dashboards table
-- Purpose: Real-time analytics dashboard for Event Wizard Stage 6
-- Affected tables: event_dashboards (new)
-- Dependencies: events table must exist
-- Special considerations: Stores real-time metrics for post-publish analytics
-- =====================================================

-- Create event_dashboards table
-- Provides real-time analytics after event is published (Stage 6)
create table public.event_dashboards (
  id uuid primary key default uuid_generate_v4(),

  -- Event relationship (one dashboard per event)
  event_id uuid unique not null references public.events(id) on delete cascade,

  -- Owner
  organizer_id uuid references auth.users(id) on delete set null,

  -- Real-time metrics stored as JSONB for flexibility
  metrics jsonb default '{}'::jsonb,
  -- Structure:
  -- {
  --   "views": 0,
  --   "unique_visitors": 0,
  --   "ticket_sales": 0,
  --   "revenue": 0,
  --   "conversion_rate": 0,
  --   "tickets_by_tier": {
  --     "early_bird": {"sold": 0, "revenue": 0},
  --     "regular": {"sold": 0, "revenue": 0}
  --   },
  --   "traffic_sources": {
  --     "social": 0,
  --     "direct": 0,
  --     "email": 0,
  --     "whatsapp": 0
  --   },
  --   "last_24_hours": {
  --     "views": 0,
  --     "ticket_sales": 0,
  --     "revenue": 0
  --   }
  -- }

  -- Marketing performance
  marketing_metrics jsonb default '{}'::jsonb,
  -- {
  --   "emails_sent": 0,
  --   "emails_opened": 0,
  --   "emails_clicked": 0,
  --   "social_posts": 0,
  --   "social_engagement": 0,
  --   "whatsapp_sent": 0,
  --   "whatsapp_responses": 0
  -- }

  -- Engagement tracking
  engagement_metrics jsonb default '{}'::jsonb,
  -- {
  --   "avg_time_on_page": 0,
  --   "bounce_rate": 0,
  --   "questions_asked": 0,
  --   "comments_count": 0,
  --   "shares_count": 0
  -- }

  -- Conversion funnel
  funnel_metrics jsonb default '{}'::jsonb,
  -- {
  --   "landing_page_views": 0,
  --   "ticket_page_views": 0,
  --   "checkout_started": 0,
  --   "checkout_completed": 0,
  --   "conversion_rate": 0
  -- }

  -- Quick access fields (denormalized for performance)
  total_views integer default 0,
  total_tickets_sold integer default 0,
  total_revenue numeric(12,2) default 0,
  conversion_rate numeric(5,4) default 0, -- Percentage as decimal

  -- Timestamps for tracking
  first_view_at timestamptz,
  first_sale_at timestamptz,
  last_updated_at timestamptz default now() not null,

  -- Snapshot history (for trend analysis)
  snapshots jsonb default '[]'::jsonb,
  -- Array of timestamped metrics snapshots
  -- [
  --   {"timestamp": "2025-10-17T08:00:00Z", "views": 100, "sales": 5},
  --   {"timestamp": "2025-10-17T09:00:00Z", "views": 150, "sales": 8}
  -- ]

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Add comments for documentation
comment on table public.event_dashboards is 'Real-time analytics dashboards for published events';
comment on column public.event_dashboards.metrics is 'Real-time event metrics including views, sales, revenue, and conversion rates';
comment on column public.event_dashboards.marketing_metrics is 'Marketing campaign performance across all channels';
comment on column public.event_dashboards.engagement_metrics is 'User engagement metrics for event pages';
comment on column public.event_dashboards.funnel_metrics is 'Conversion funnel from view to purchase';
comment on column public.event_dashboards.snapshots is 'Historical snapshots of metrics for trend analysis';

-- Create indexes for performance
create index idx_event_dashboards_event_id on public.event_dashboards(event_id);
create index idx_event_dashboards_organizer_id on public.event_dashboards(organizer_id);
create index idx_event_dashboards_created_at on public.event_dashboards(created_at desc);
create index idx_event_dashboards_total_views on public.event_dashboards(total_views desc);
create index idx_event_dashboards_total_revenue on public.event_dashboards(total_revenue desc);

-- GIN indexes for JSONB queries
create index idx_event_dashboards_metrics on public.event_dashboards using gin(metrics);
create index idx_event_dashboards_marketing_metrics on public.event_dashboards using gin(marketing_metrics);
create index idx_event_dashboards_snapshots on public.event_dashboards using gin(snapshots);

-- Enable Row Level Security
alter table public.event_dashboards enable row level security;

-- RLS Policy: Event organizers can view their dashboards
create policy "organizers can view their event dashboards"
  on public.event_dashboards
  for select
  to authenticated
  using (
    auth.uid() is not null
    and (
      auth.uid() = organizer_id
      or exists (
        select 1 from public.events
        where events.id = event_dashboards.event_id
        and events.organizer_id = auth.uid()
      )
    )
  );

-- RLS Policy: Event organizers can create dashboards for their events
create policy "organizers can create dashboards for their events"
  on public.event_dashboards
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.events
      where events.id = event_dashboards.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- RLS Policy: Event organizers can update their dashboards
create policy "organizers can update their dashboards"
  on public.event_dashboards
  for update
  to authenticated
  using (
    auth.uid() is not null
    and (
      auth.uid() = organizer_id
      or exists (
        select 1 from public.events
        where events.id = event_dashboards.event_id
        and events.organizer_id = auth.uid()
      )
    )
  );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function: Initialize dashboard on event publish
create or replace function public.initialize_event_dashboard(p_event_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  v_dashboard_id uuid;
  v_organizer_id uuid;
begin
  -- Get event organizer
  select organizer_id into v_organizer_id
  from public.events
  where id = p_event_id;

  -- Create dashboard if doesn't exist
  insert into public.event_dashboards (event_id, organizer_id)
  values (p_event_id, v_organizer_id)
  on conflict (event_id) do nothing
  returning id into v_dashboard_id;

  -- If already existed, get the ID
  if v_dashboard_id is null then
    select id into v_dashboard_id
    from public.event_dashboards
    where event_id = p_event_id;
  end if;

  return v_dashboard_id;
end;
$$;

comment on function public.initialize_event_dashboard is 'Creates event dashboard when event is published (called from Stage 6)';

-- Function: Update dashboard metrics
create or replace function public.update_dashboard_metrics(
  p_event_id uuid,
  p_metric_name text,
  p_metric_value numeric
)
returns void
language plpgsql
security definer
as $$
begin
  update public.event_dashboards
  set
    metrics = jsonb_set(
      metrics,
      array[p_metric_name],
      to_jsonb(p_metric_value)
    ),
    last_updated_at = now(),
    updated_at = now()
  where event_id = p_event_id;

  -- Update denormalized fields for common metrics
  if p_metric_name = 'views' then
    update public.event_dashboards
    set total_views = p_metric_value::integer
    where event_id = p_event_id;
  elsif p_metric_name = 'ticket_sales' then
    update public.event_dashboards
    set total_tickets_sold = p_metric_value::integer
    where event_id = p_event_id;
  elsif p_metric_name = 'revenue' then
    update public.event_dashboards
    set total_revenue = p_metric_value
    where event_id = p_event_id;
  elsif p_metric_name = 'conversion_rate' then
    update public.event_dashboards
    set conversion_rate = p_metric_value
    where event_id = p_event_id;
  end if;
end;
$$;

comment on function public.update_dashboard_metrics is 'Updates specific metric in event dashboard';

-- Function: Create metrics snapshot
create or replace function public.create_metrics_snapshot(p_event_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_snapshot jsonb;
begin
  -- Build snapshot from current metrics
  select jsonb_build_object(
    'timestamp', now(),
    'views', total_views,
    'sales', total_tickets_sold,
    'revenue', total_revenue,
    'conversion_rate', conversion_rate
  ) into v_snapshot
  from public.event_dashboards
  where event_id = p_event_id;

  -- Append to snapshots array
  update public.event_dashboards
  set
    snapshots = snapshots || v_snapshot,
    updated_at = now()
  where event_id = p_event_id;
end;
$$;

comment on function public.create_metrics_snapshot is 'Creates timestamped snapshot of current metrics for trend analysis';

-- Function: Auto-update updated_at timestamp
create or replace function public.update_event_dashboard_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  new.last_updated_at = now();

  -- Set first_view_at if total_views just increased from 0
  if old.total_views = 0 and new.total_views > 0 and new.first_view_at is null then
    new.first_view_at = now();
  end if;

  -- Set first_sale_at if total_tickets_sold just increased from 0
  if old.total_tickets_sold = 0 and new.total_tickets_sold > 0 and new.first_sale_at is null then
    new.first_sale_at = now();
  end if;

  return new;
end;
$$;

comment on function public.update_event_dashboard_updated_at() is 'Auto-updates timestamps and tracks first view/sale';

-- Trigger: Auto-update timestamps
create trigger set_event_dashboard_updated_at
  before update on public.event_dashboards
  for each row
  execute function public.update_event_dashboard_updated_at();

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select on public.event_dashboards to authenticated;
grant select, insert, update on public.event_dashboards to authenticated;

-- Grant execute on dashboard functions
grant execute on function public.initialize_event_dashboard to authenticated;
grant execute on function public.update_dashboard_metrics to authenticated;
grant execute on function public.create_metrics_snapshot to authenticated;

-- =============================================================================
-- SAMPLE DATA (optional - remove in production)
-- =============================================================================

-- insert into public.event_dashboards (
--   event_id,
--   organizer_id,
--   metrics,
--   total_views,
--   total_tickets_sold,
--   total_revenue
-- )
-- select
--   events.id,
--   events.organizer_id,
--   '{
--     "views": 1247,
--     "unique_visitors": 892,
--     "ticket_sales": 23,
--     "revenue": 6877,
--     "conversion_rate": 0.0184,
--     "traffic_sources": {
--       "social": 722,
--       "direct": 287,
--       "email": 187,
--       "whatsapp": 51
--     }
--   }'::jsonb,
--   1247,
--   23,
--   6877.00
-- from public.events
-- where events.slug = 'ai-summit-2025'
-- limit 1;
