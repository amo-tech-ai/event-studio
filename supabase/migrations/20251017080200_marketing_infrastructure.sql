-- =====================================================
-- Migration: marketing infrastructure for Event Wizard Stage 5
-- Purpose: Marketing campaigns, email templates, and WhatsApp broadcasts
-- Affected tables: marketing_campaigns, email_templates, whatsapp_campaigns (new)
-- Dependencies: events table must exist
-- Special considerations: Supports AI-generated content and multi-channel campaigns
-- =====================================================

-- =============================================================================
-- 1. MARKETING_CAMPAIGNS TABLE
-- =============================================================================

-- Main marketing campaign table
-- Tracks overall campaign status and generated content
create table public.marketing_campaigns (
  id uuid primary key default uuid_generate_v4(),

  -- Event relationship
  event_id uuid not null references public.events(id) on delete cascade,

  -- Campaign identification
  name text not null,
  description text,

  -- Campaign configuration
  channels text[] default '{}' not null, -- ['email', 'social', 'whatsapp']
  status text default 'draft' not null check (status in ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),

  -- AI-generated content stored as JSONB
  content jsonb default '{}'::jsonb,
  -- Structure:
  -- {
  --   "landingPage": {"headline": "...", "subheadline": "...", "description": "..."},
  --   "emails": [{"type": "announcement", "subject": "...", "body": "..."}],
  --   "socialPosts": [{"platform": "linkedin", "content": "...", "hashtags": [...]}],
  --   "whatsappMessages": [{"type": "announcement", "message": "..."}]
  -- }

  -- Campaign metrics
  emails_sent integer default 0,
  emails_opened integer default 0,
  emails_clicked integer default 0,
  social_posts_created integer default 0,
  social_engagement integer default 0,
  whatsapp_messages_sent integer default 0,
  whatsapp_responses integer default 0,

  -- Generation metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "wizard_session_id": "uuid",
  --   "generated_by": "ai",
  --   "tone": "professional",
  --   "target_audience": "tech professionals",
  --   "generation_timestamp": "2025-10-17T08:00:00Z"
  -- }

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  scheduled_at timestamptz,
  launched_at timestamptz,
  completed_at timestamptz
);

-- Add comments
comment on table public.marketing_campaigns is 'Marketing campaigns generated during Event Wizard Stage 5';
comment on column public.marketing_campaigns.channels is 'Array of campaign channels: email, social, whatsapp';
comment on column public.marketing_campaigns.content is 'AI-generated campaign content for all channels stored as JSONB';
comment on column public.marketing_campaigns.metadata is 'Generation metadata including wizard session ID and AI parameters';

-- Indexes
create index idx_marketing_campaigns_event_id on public.marketing_campaigns(event_id);
create index idx_marketing_campaigns_status on public.marketing_campaigns(status);
create index idx_marketing_campaigns_channels on public.marketing_campaigns using gin(channels);
create index idx_marketing_campaigns_created_at on public.marketing_campaigns(created_at desc);

-- GIN index for JSONB content
create index idx_marketing_campaigns_content on public.marketing_campaigns using gin(content);
create index idx_marketing_campaigns_metadata on public.marketing_campaigns using gin(metadata);

-- =============================================================================
-- 2. EMAIL_TEMPLATES TABLE
-- =============================================================================

-- Email campaign templates
-- Stores individual email content generated during Stage 5
create table public.email_templates (
  id uuid primary key default uuid_generate_v4(),

  -- Campaign relationship
  campaign_id uuid not null references public.marketing_campaigns(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,

  -- Template identification
  name text not null,
  template_type text not null check (template_type in (
    'announcement',      -- Initial event announcement
    'reminder',          -- 1 week before event
    'last_chance',       -- 24 hours before event
    'confirmation',      -- Ticket purchase confirmation
    'follow_up',         -- Post-event follow-up
    'custom'            -- Custom template
  )),

  -- Email content
  subject text not null,
  body text not null,
  preheader text, -- Email preview text

  -- Email settings
  from_name text,
  from_email text,
  reply_to text,

  -- Scheduling
  send_date timestamptz,
  send_time_offset_hours integer, -- Hours before/after event to send

  -- Template status
  status text default 'draft' not null check (status in ('draft', 'scheduled', 'sent', 'cancelled')),

  -- Metrics
  sent_count integer default 0,
  delivered_count integer default 0,
  opened_count integer default 0,
  clicked_count integer default 0,
  bounced_count integer default 0,
  unsubscribed_count integer default 0,

  -- Metadata
  metadata jsonb default '{}'::jsonb,

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  sent_at timestamptz
);

-- Add comments
comment on table public.email_templates is 'Email templates for marketing campaigns';
comment on column public.email_templates.template_type is 'Type of email: announcement, reminder, last_chance, confirmation, follow_up';
comment on column public.email_templates.send_time_offset_hours is 'Hours before/after event to send (negative for before, positive for after)';

-- Indexes
create index idx_email_templates_campaign_id on public.email_templates(campaign_id);
create index idx_email_templates_event_id on public.email_templates(event_id);
create index idx_email_templates_template_type on public.email_templates(template_type);
create index idx_email_templates_status on public.email_templates(status);
create index idx_email_templates_send_date on public.email_templates(send_date);

-- =============================================================================
-- 3. WHATSAPP_CAMPAIGNS TABLE
-- =============================================================================

-- WhatsApp broadcast campaigns (EventOS exclusive differentiator!)
-- Enables personalized WhatsApp marketing not available in Zoho Backstage
create table public.whatsapp_campaigns (
  id uuid primary key default uuid_generate_v4(),

  -- Campaign relationship
  campaign_id uuid references public.marketing_campaigns(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,

  -- Message identification
  name text not null,
  message_type text not null check (message_type in (
    'announcement',      -- Event announcement
    'reminder',          -- Event reminder
    'invitation',        -- Personal invitation
    'confirmation',      -- Ticket confirmation
    'update',           -- Event updates
    'custom'            -- Custom message
  )),

  -- WhatsApp message content
  message text not null,
  media_url text, -- Optional image/video URL

  -- Targeting
  target_audience text default 'all_contacts' not null check (target_audience in (
    'all_contacts',
    'ticket_holders',
    'vip_only',
    'custom_list'
  )),
  recipient_list text[], -- Array of phone numbers or contact IDs

  -- Scheduling
  scheduled_for timestamptz,
  send_time_offset_hours integer, -- Hours before/after event

  -- Campaign status
  status text default 'draft' not null check (status in ('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled')),

  -- Metrics
  messages_sent integer default 0,
  messages_delivered integer default 0,
  messages_read integer default 0,
  responses_received integer default 0,
  failed_sends integer default 0,

  -- Metadata
  metadata jsonb default '{}'::jsonb,

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  sent_at timestamptz
);

-- Add comments
comment on table public.whatsapp_campaigns is 'WhatsApp broadcast campaigns (EventOS exclusive differentiator vs Zoho)';
comment on column public.whatsapp_campaigns.message_type is 'Type of WhatsApp message: announcement, reminder, invitation, confirmation, update';
comment on column public.whatsapp_campaigns.target_audience is 'Who receives message: all_contacts, ticket_holders, vip_only, custom_list';

-- Indexes
create index idx_whatsapp_campaigns_campaign_id on public.whatsapp_campaigns(campaign_id);
create index idx_whatsapp_campaigns_event_id on public.whatsapp_campaigns(event_id);
create index idx_whatsapp_campaigns_message_type on public.whatsapp_campaigns(message_type);
create index idx_whatsapp_campaigns_status on public.whatsapp_campaigns(status);
create index idx_whatsapp_campaigns_scheduled_for on public.whatsapp_campaigns(scheduled_for);
create index idx_whatsapp_campaigns_target_audience on public.whatsapp_campaigns(target_audience);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
alter table public.marketing_campaigns enable row level security;
alter table public.email_templates enable row level security;
alter table public.whatsapp_campaigns enable row level security;

-- Marketing Campaigns RLS Policies
create policy "organizers can view campaigns for their events"
  on public.marketing_campaigns
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = marketing_campaigns.event_id
      and events.organizer_id = auth.uid()
    )
  );

create policy "organizers can create campaigns for their events"
  on public.marketing_campaigns
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.events
      where events.id = marketing_campaigns.event_id
      and events.organizer_id = auth.uid()
    )
  );

create policy "organizers can update campaigns for their events"
  on public.marketing_campaigns
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = marketing_campaigns.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- Email Templates RLS Policies
create policy "organizers can view email templates for their events"
  on public.email_templates
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = email_templates.event_id
      and events.organizer_id = auth.uid()
    )
  );

create policy "organizers can manage email templates"
  on public.email_templates
  for all
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = email_templates.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- WhatsApp Campaigns RLS Policies
create policy "organizers can view whatsapp campaigns for their events"
  on public.whatsapp_campaigns
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = whatsapp_campaigns.event_id
      and events.organizer_id = auth.uid()
    )
  );

create policy "organizers can manage whatsapp campaigns"
  on public.whatsapp_campaigns
  for all
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = whatsapp_campaigns.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger: Auto-update marketing_campaigns.updated_at
create trigger set_marketing_campaigns_updated_at
  before update on public.marketing_campaigns
  for each row
  execute function public.handle_updated_at();

-- Trigger: Auto-update email_templates.updated_at
create trigger set_email_templates_updated_at
  before update on public.email_templates
  for each row
  execute function public.handle_updated_at();

-- Trigger: Auto-update whatsapp_campaigns.updated_at
create trigger set_whatsapp_campaigns_updated_at
  before update on public.whatsapp_campaigns
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select on public.marketing_campaigns to authenticated;
grant select, insert, update, delete on public.marketing_campaigns to authenticated;
grant select on public.email_templates to authenticated;
grant select, insert, update, delete on public.email_templates to authenticated;
grant select on public.whatsapp_campaigns to authenticated;
grant select, insert, update, delete on public.whatsapp_campaigns to authenticated;

-- =============================================================================
-- SAMPLE DATA (optional - remove in production)
-- =============================================================================

-- insert into public.marketing_campaigns (
--   event_id,
--   name,
--   channels,
--   status,
--   content
-- )
-- select
--   events.id,
--   events.name || ' - Launch Campaign',
--   array['email', 'social', 'whatsapp']::text[],
--   'draft',
--   '{
--     "landingPage": {
--       "headline": "Transform Your AI Skills",
--       "subheadline": "Join industry leaders at AI Summit 2025"
--     },
--     "emails": [
--       {"type": "announcement", "subject": "You are invited to AI Summit 2025"}
--     ],
--     "socialPosts": [
--       {"platform": "linkedin", "content": "Excited to announce AI Summit 2025!"}
--     ],
--     "whatsappMessages": [
--       {"type": "announcement", "message": "Hi! You are invited to AI Summit 2025"}
--     ]
--   }'::jsonb
-- from public.events
-- where events.slug = 'ai-summit-2025'
-- limit 1;
