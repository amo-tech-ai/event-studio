-- migration: cleanup non-mvp tables
-- purpose: remove 9 tables not needed for mvp to simplify schema
-- removes: event_vendors, event_sessions, questions, question_answers, order_refunds, taxes_and_fees, whatsapp_campaigns, payments, notes
-- keeps: 21 core mvp tables (profiles, events, venues, ticket_tiers, wizard_sessions, orders, tickets, attendees, promo_codes, marketing_campaigns, email_templates, event_dashboards, venue_bookings, companies, contacts, interactions, organizers, budgets, tasks, vendors, event_settings)

-- ============================================================================
-- drop tables in correct order (respecting foreign key dependencies)
-- ============================================================================

-- step 1: drop views that depend on tables being removed
drop view if exists public.event_budget_summary cascade;
drop view if exists public.event_task_progress cascade;

-- step 2: drop tables with no incoming dependencies first
drop table if exists public.question_answers cascade;
drop table if exists public.questions cascade;
drop table if exists public.notes cascade;
drop table if exists public.whatsapp_campaigns cascade;
drop table if exists public.order_refunds cascade;
drop table if exists public.taxes_and_fees cascade;
drop table if exists public.event_sessions cascade;
drop table if exists public.event_vendors cascade;
drop table if exists public.payments cascade;

-- ============================================================================
-- recreate views for remaining tables
-- ============================================================================

-- view: event budget summary (still needed for budgets table)
create or replace view public.event_budget_summary as
select
  event_id,
  organizer_id,
  sum(estimated_amount) as total_estimated,
  sum(actual_amount) as total_actual,
  sum(variance) as total_variance,
  count(*) as total_line_items,
  count(*) filter (where status = 'PAID') as paid_items,
  sum(actual_amount) filter (where status = 'PAID') as total_paid
from public.budgets
group by event_id, organizer_id;

comment on view public.event_budget_summary is 'budget summary per event for financial tracking';

-- view: event task progress (still needed for tasks table)
create or replace view public.event_task_progress as
select
  event_id,
  organizer_id,
  count(*) as total_tasks,
  count(*) filter (where status = 'COMPLETED') as completed_tasks,
  count(*) filter (where status = 'TODO') as pending_tasks,
  count(*) filter (where status = 'BLOCKED') as blocked_tasks,
  count(*) filter (where due_date < current_date and status != 'COMPLETED') as overdue_tasks,
  round(count(*) filter (where status = 'COMPLETED')::numeric / nullif(count(*), 0) * 100, 2) as completion_percentage
from public.tasks
group by event_id, organizer_id;

comment on view public.event_task_progress is 'task completion progress per event';

-- ============================================================================
-- completion message
-- ============================================================================

do $$
begin
  raise notice '✅ cleanup completed successfully';
  raise notice '🗑️  removed 9 non-mvp tables: event_vendors, event_sessions, questions, question_answers, order_refunds, taxes_and_fees, whatsapp_campaigns, payments, notes';
  raise notice '✅ kept 21 core mvp tables for production';
  raise notice '📊 final schema: 21 tables ready for sample data';
end $$;
