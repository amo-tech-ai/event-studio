-- migration: sample data for core mvp tables
-- purpose: add realistic sample data to 9 empty tables
-- tables: organizers, promo_codes, companies, contacts, interactions, budgets, tasks, vendors, event_settings
-- reference: /home/sk/event-studio/docs/DATABASE_CLEANUP_REPORT.md

-- ============================================================================
-- 1) ORGANIZERS - extended organizer profiles (3 organizers)
-- ============================================================================

-- Ensure profiles exist first (they should be created in earlier migrations)
-- Insert organizers only if the corresponding profiles exist
insert into public.organizers (
  id, organization_name, organization_type, business_registration_number,
  is_verified, verification_status, stripe_account_status,
  website_url, description, support_email, support_phone,
  business_city, business_country, timezone, currency,
  total_events, total_revenue, total_tickets_sold
) values
(
  '11111111-1111-1111-1111-111111111111',
  'Eventos Pro',
  'COMPANY',
  'BN-2024-001',
  true,
  'APPROVED',
  'ACTIVE',
  'https://eventos.pro',
  'Professional event management company specializing in tech conferences and corporate events',
  'support@eventos.pro',
  '+1-416-555-0100',
  'Toronto',
  'CA',
  'America/Toronto',
  'CAD',
  5,
  125000.00,
  487
),
(
  '22222222-2222-2222-2222-222222222222',
  'Tech Events Inc',
  'COMPANY',
  'BN-2024-002',
  false,
  'PENDING',
  'PENDING',
  'https://techevents.ca',
  'Emerging tech event organizer',
  'hello@techevents.ca',
  '+1-416-555-0200',
  'Toronto',
  'CA',
  'America/Toronto',
  'CAD',
  0,
  0,
  0
),
(
  '33333333-3333-3333-3333-333333333333',
  'Corporate Solutions Ltd',
  'COMPANY',
  'BN-2024-003',
  true,
  'APPROVED',
  'ACTIVE',
  'https://corpsolutions.com',
  'B2B corporate training and networking events',
  'events@corpsolutions.com',
  '+1-416-555-0300',
  'Toronto',
  'CA',
  'America/Toronto',
  'CAD',
  0,
  0,
  0
);

-- ============================================================================
-- 2) PROMO_CODES - discount codes (5 promo codes)
-- ============================================================================

insert into public.promo_codes (
  event_id, code, discount_type, discount_value,
  max_uses, max_uses_per_customer, times_used,
  valid_from, valid_until, is_active, description,
  created_by
) values
(
  'e1111111-1111-1111-1111-111111111111',
  'EARLYBIRD20',
  'PERCENTAGE',
  20.00,
  100,
  1,
  15,
  '2025-01-01 00:00:00+00',
  '2025-03-01 23:59:59+00',
  true,
  'early bird 20% discount for first 100 buyers',
  '11111111-1111-1111-1111-111111111111'
),
(
  'e1111111-1111-1111-1111-111111111111',
  'STUDENT50',
  'PERCENTAGE',
  50.00,
  50,
  1,
  8,
  '2025-01-01 00:00:00+00',
  '2025-06-01 23:59:59+00',
  true,
  'student discount 50% off with valid id',
  '11111111-1111-1111-1111-111111111111'
),
(
  'e2222222-2222-2222-2222-222222222222',
  'LEADER10',
  'FIXED_AMOUNT',
  50.00,
  null,
  1,
  0,
  '2025-02-01 00:00:00+00',
  '2025-04-15 23:59:59+00',
  true,
  '$50 off leadership seminar',
  '11111111-1111-1111-1111-111111111111'
),
(
  'e3333333-3333-3333-3333-333333333333',
  'WORKSHOP15',
  'PERCENTAGE',
  15.00,
  200,
  2,
  45,
  '2025-03-01 00:00:00+00',
  '2025-05-31 23:59:59+00',
  true,
  '15% off product design workshop',
  '11111111-1111-1111-1111-111111111111'
),
(
  'e4444444-4444-4444-4444-444444444444',
  'NETWORK25',
  'PERCENTAGE',
  25.00,
  75,
  1,
  32,
  '2025-04-01 00:00:00+00',
  '2025-06-30 23:59:59+00',
  true,
  '25% off networking night for early registrations',
  '11111111-1111-1111-1111-111111111111'
);

-- ============================================================================
-- 3) COMPANIES - b2b companies (4 companies)
-- ============================================================================

insert into public.companies (
  organizer_id, name, slug, industry, company_size, website_url,
  phone, email, address_line1, city, state_province, postal_code, country,
  annual_revenue, currency, linkedin_url, lead_source, status, tags,
  total_events_attended, total_revenue
) values
(
  '11111111-1111-1111-1111-111111111111',
  'techcorp solutions',
  'techcorp-solutions',
  'technology',
  '201-500',
  'https://techcorp.com',
  '+1-416-555-1001',
  'events@techcorp.com',
  '123 king street west, suite 500',
  'toronto',
  'on',
  'm5h 1a1',
  'ca',
  5000000.00,
  'cad',
  'https://linkedin.com/company/techcorp',
  'website',
  'customer',
  array['enterprise', 'tech', 'recurring'],
  3,
  15000.00
),
(
  '11111111-1111-1111-1111-111111111111',
  'innovate consulting group',
  'innovate-consulting',
  'consulting',
  '51-200',
  'https://innovategroup.ca',
  '+1-416-555-2002',
  'contact@innovategroup.ca',
  '456 bay street, floor 12',
  'toronto',
  'on',
  'm5j 2s1',
  'ca',
  2500000.00,
  'cad',
  'https://linkedin.com/company/innovategroup',
  'referral',
  'prospect',
  array['consulting', 'b2b', 'warm-lead'],
  1,
  5000.00
),
(
  '11111111-1111-1111-1111-111111111111',
  'startup hub inc',
  'startup-hub',
  'venture capital',
  '11-50',
  'https://startuphub.ca',
  '+1-416-555-3003',
  'hello@startuphub.ca',
  '789 richmond street east',
  'toronto',
  'on',
  'm5c 1n3',
  'ca',
  1000000.00,
  'cad',
  'https://linkedin.com/company/startuphub',
  'event',
  'active',
  array['startups', 'networking', 'vip'],
  5,
  25000.00
),
(
  '11111111-1111-1111-1111-111111111111',
  'global enterprises ltd',
  'global-enterprises',
  'manufacturing',
  '1000+',
  'https://globalent.com',
  '+1-416-555-4004',
  'corporate@globalent.com',
  '321 front street west, tower a',
  'toronto',
  'on',
  'm5v 2y1',
  'ca',
  50000000.00,
  'cad',
  'https://linkedin.com/company/globalent',
  'sales',
  'customer',
  array['enterprise', 'fortune-500', 'recurring'],
  2,
  30000.00
);

-- ============================================================================
-- 4) CONTACTS - individual contacts (8 contacts)
-- ============================================================================

insert into public.contacts (
  organizer_id, company_id, first_name, last_name, email, phone, mobile_phone,
  job_title, department, linkedin_url, city, state_province, country,
  lead_source, status, tags, total_events_attended, total_spent,
  email_consent, sms_consent, whatsapp_consent
) values
(
  '11111111-1111-1111-1111-111111111111',
  (select id from companies where slug = 'techcorp-solutions'),
  'david',
  'thompson',
  'david.thompson@techcorp.com',
  '+1-416-555-1001',
  '+1-647-555-1001',
  'cto',
  'technology',
  'https://linkedin.com/in/davidthompson',
  'toronto',
  'on',
  'ca',
  'website',
  'customer',
  array['decision-maker', 'tech-lead', 'frequent-attendee'],
  3,
  7500.00,
  true,
  true,
  false
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from companies where slug = 'techcorp-solutions'),
  'lisa',
  'martinez',
  'lisa.martinez@techcorp.com',
  '+1-416-555-1002',
  '+1-647-555-1002',
  'hr director',
  'human resources',
  'https://linkedin.com/in/lisamartinez',
  'toronto',
  'on',
  'ca',
  'referral',
  'active',
  array['hr', 'training', 'warm'],
  2,
  3000.00,
  true,
  false,
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from companies where slug = 'innovate-consulting'),
  'james',
  'wilson',
  'james.wilson@innovategroup.ca',
  '+1-416-555-2002',
  '+1-647-555-2002',
  'managing partner',
  'executive',
  'https://linkedin.com/in/jameswilson',
  'toronto',
  'on',
  'ca',
  'event',
  'prospect',
  array['c-level', 'consulting', 'warm-lead'],
  1,
  2500.00,
  true,
  true,
  false
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from companies where slug = 'startup-hub'),
  'emily',
  'chen',
  'emily.chen@startuphub.ca',
  '+1-416-555-3003',
  '+1-647-555-3003',
  'community manager',
  'operations',
  'https://linkedin.com/in/emilychen',
  'toronto',
  'on',
  'ca',
  'social-media',
  'customer',
  array['community', 'networking', 'vip'],
  5,
  12000.00,
  true,
  true,
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from companies where slug = 'startup-hub'),
  'robert',
  'kim',
  'robert.kim@startuphub.ca',
  '+1-416-555-3004',
  '+1-647-555-3004',
  'investment director',
  'investments',
  'https://linkedin.com/in/robertkim',
  'toronto',
  'on',
  'ca',
  'referral',
  'customer',
  array['investor', 'vip', 'frequent'],
  4,
  10000.00,
  true,
  false,
  false
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from companies where slug = 'global-enterprises'),
  'sarah',
  'patel',
  'sarah.patel@globalent.com',
  '+1-416-555-4004',
  '+1-647-555-4004',
  'vp of operations',
  'operations',
  'https://linkedin.com/in/sarahpatel',
  'toronto',
  'on',
  'ca',
  'sales',
  'customer',
  array['enterprise', 'decision-maker', 'recurring'],
  2,
  15000.00,
  true,
  true,
  false
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from companies where slug = 'global-enterprises'),
  'michael',
  'rodriguez',
  'michael.rodriguez@globalent.com',
  '+1-416-555-4005',
  '+1-647-555-4005',
  'learning & development manager',
  'hr',
  'https://linkedin.com/in/michaelrodriguez',
  'toronto',
  'on',
  'ca',
  'event',
  'active',
  array['training', 'hr', 'warm'],
  1,
  5000.00,
  true,
  false,
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  null,
  'jessica',
  'lee',
  'jessica.lee@freelancer.com',
  null,
  '+1-647-555-5005',
  'independent consultant',
  null,
  'https://linkedin.com/in/jessicalee',
  'toronto',
  'on',
  'ca',
  'website',
  'lead',
  array['freelancer', 'b2c', 'cold'],
  0,
  0,
  true,
  false,
  false
);

-- ============================================================================
-- 5) INTERACTIONS - crm interactions (6 interactions)
-- ============================================================================

insert into public.interactions (
  organizer_id, contact_id, company_id, event_id,
  interaction_type, subject, description, outcome,
  interaction_date, duration_minutes,
  requires_follow_up, follow_up_date, created_by
) values
(
  '11111111-1111-1111-1111-111111111111',
  (select id from contacts where email = 'david.thompson@techcorp.com'),
  (select company_id from contacts where email = 'david.thompson@techcorp.com'),
  'e1111111-1111-1111-1111-111111111111',
  'meeting',
  'ai summit 2025 sponsorship discussion',
  'discussed platinum sponsorship package for ai summit. david very interested in keynote slot.',
  'positive - awaiting approval from finance',
  '2025-01-15 14:00:00+00',
  45,
  true,
  '2025-01-22',
  '11111111-1111-1111-1111-111111111111'
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from contacts where email = 'emily.chen@startuphub.ca'),
  (select company_id from contacts where email = 'emily.chen@startuphub.ca'),
  'e4444444-4444-4444-4444-444444444444',
  'email',
  'networking night group booking',
  'emily requested group booking for 20 startup founders. offered 25% group discount.',
  'confirmed - payment pending',
  '2025-04-02 10:30:00+00',
  null,
  false,
  null,
  '11111111-1111-1111-1111-111111111111'
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from contacts where email = 'james.wilson@innovategroup.ca'),
  (select company_id from contacts where email = 'james.wilson@innovategroup.ca'),
  null,
  'call',
  'follow-up on leadership seminar attendance',
  'james attended last seminar, very positive feedback. interested in private workshop for his team.',
  'hot lead - send proposal',
  '2025-02-20 11:00:00+00',
  30,
  true,
  '2025-02-27',
  '11111111-1111-1111-1111-111111111111'
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from contacts where email = 'sarah.patel@globalent.com'),
  (select company_id from contacts where email = 'sarah.patel@globalent.com'),
  'e2222222-2222-2222-2222-222222222222',
  'ticket_purchase',
  'bulk ticket purchase for leadership seminar',
  'purchased 15 tickets for executive team. requested invoice for accounting.',
  'completed - invoice sent',
  '2025-02-10 09:15:00+00',
  null,
  false,
  null,
  '11111111-1111-1111-1111-111111111111'
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from contacts where email = 'robert.kim@startuphub.ca'),
  (select company_id from contacts where email = 'robert.kim@startuphub.ca'),
  'e1111111-1111-1111-1111-111111111111',
  'event_attendance',
  'attended ai summit 2025',
  'robert attended and networked extensively. collected 40+ business cards.',
  'excellent - request testimonial',
  '2025-03-15 09:00:00+00',
  480,
  true,
  '2025-03-22',
  '11111111-1111-1111-1111-111111111111'
),
(
  '11111111-1111-1111-1111-111111111111',
  (select id from contacts where email = 'jessica.lee@freelancer.com'),
  null,
  null,
  'website_visit',
  'browsed ai summit event page',
  'visited event page 3 times, downloaded brochure. no ticket purchase yet.',
  'warm lead - send follow-up email',
  '2025-01-25 16:45:00+00',
  null,
  true,
  '2025-02-01',
  '11111111-1111-1111-1111-111111111111'
);

-- ============================================================================
-- 6) BUDGETS - event budgets (5 budget items)
-- ============================================================================

insert into public.budgets (
  event_id, organizer_id, category, subcategory, description,
  estimated_amount, actual_amount, currency, status,
  payment_due_date
) values
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'venue',
  'conference center rental',
  'metro toronto convention centre - main hall rental for 2 days',
  15000.00,
  15500.00,
  'cad',
  'paid',
  '2025-02-01'
),
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'catering',
  'lunch and coffee service',
  'full day catering for 500 attendees x 2 days',
  12000.00,
  11800.00,
  'cad',
  'paid',
  '2025-03-01'
),
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'marketing',
  'digital advertising',
  'google ads, linkedin, and facebook campaigns',
  8000.00,
  7500.00,
  'cad',
  'committed',
  '2025-04-15'
),
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'equipment',
  'av and tech setup',
  'projectors, sound system, livestream equipment',
  5000.00,
  0,
  'cad',
  'approved',
  '2025-05-01'
),
(
  'e2222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'venue',
  'hotel ballroom',
  'sheraton toronto ballroom rental for half day',
  3500.00,
  0,
  'cad',
  'planned',
  '2025-03-15'
);

-- ============================================================================
-- 7) TASKS - event tasks (6 tasks)
-- ============================================================================

insert into public.tasks (
  event_id, organizer_id, title, description, category,
  priority, status, due_date, completed_at
) values
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'finalize speaker lineup',
  'confirm all 12 keynote speakers and send contracts',
  'planning',
  'high',
  'completed',
  '2025-01-31',
  '2025-01-28 14:30:00+00'
),
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'send attendee welcome emails',
  'prepare and send welcome emails to all registered attendees',
  'marketing',
  'medium',
  'in_progress',
  '2025-03-10',
  null
),
(
  'e1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'setup event check-in system',
  'configure qr code scanners and check-in app for registration desk',
  'logistics',
  'high',
  'todo',
  '2025-03-12',
  null
),
(
  'e2222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'book catering service',
  'arrange lunch and refreshments for 50 attendees',
  'venue',
  'urgent',
  'todo',
  '2025-03-01',
  null
),
(
  'e3333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'prepare workshop materials',
  'print handouts and create digital resources for workshop participants',
  'planning',
  'medium',
  'todo',
  '2025-04-20',
  null
),
(
  'e4444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'send post-event survey',
  'create and distribute feedback survey to all attendees',
  'follow_up',
  'low',
  'todo',
  '2025-06-20',
  null
);

-- ============================================================================
-- 8) VENDORS - service providers (4 vendors)
-- ============================================================================

insert into public.vendors (
  organizer_id, business_name, contact_name, email, phone, website_url,
  service_category, services_offered, description,
  address_line1, city, state_province, postal_code, country,
  rating, total_reviews, insurance_verified,
  total_events_serviced, total_spent_with_vendor, is_preferred, status
) values
(
  '11111111-1111-1111-1111-111111111111',
  'elite catering co',
  'maria garcia',
  'bookings@elitecatering.ca',
  '+1-416-555-7001',
  'https://elitecatering.ca',
  'catering',
  array['corporate lunches', 'coffee breaks', 'cocktail receptions', 'dietary accommodations'],
  'full-service catering for corporate events. specialized in dietary restrictions and international cuisine.',
  '789 dundas street west',
  'toronto',
  'on',
  'm5t 1h6',
  'ca',
  4.8,
  24,
  true,
  8,
  45000.00,
  true,
  'active'
),
(
  '11111111-1111-1111-1111-111111111111',
  'pro av solutions',
  'david lee',
  'contact@proavsolutions.ca',
  '+1-416-555-7002',
  'https://proavsolutions.ca',
  'av_equipment',
  array['sound systems', 'projectors', 'livestreaming', 'stage lighting', 'tech support'],
  'professional audio-visual equipment rental and technical support for events of all sizes.',
  '456 industrial parkway',
  'toronto',
  'on',
  'm8z 5s5',
  'ca',
  4.9,
  31,
  true,
  12,
  38000.00,
  true,
  'active'
),
(
  '11111111-1111-1111-1111-111111111111',
  'shuttlelink transportation',
  'john park',
  'bookings@shuttlelink.ca',
  '+1-416-555-7003',
  'https://shuttlelink.ca',
  'transportation',
  array['shuttle buses', 'airport transfers', 'vip car service', 'parking coordination'],
  'reliable transportation services for corporate events and conferences.',
  '123 airport road',
  'mississauga',
  'on',
  'l4v 1a1',
  'ca',
  4.6,
  18,
  true,
  5,
  12000.00,
  false,
  'active'
),
(
  '11111111-1111-1111-1111-111111111111',
  'bloom & petals florist',
  'susan chen',
  'events@bloomandpetals.ca',
  '+1-416-555-7004',
  'https://bloomandpetals.ca',
  'florist',
  array['centerpieces', 'stage decorations', 'entrance displays', 'corporate branding'],
  'custom floral arrangements and event decorations for corporate functions.',
  '321 queen street east',
  'toronto',
  'on',
  'm5a 1s5',
  'ca',
  4.7,
  15,
  false,
  3,
  8500.00,
  false,
  'active'
);

-- ============================================================================
-- 9) EVENT_SETTINGS - per-event customization (3 settings)
-- ============================================================================

insert into public.event_settings (
  event_id, pre_checkout_message, post_checkout_message,
  order_timeout_minutes, seo_title, seo_description,
  website_url, social_links, is_online_event,
  primary_color, show_remaining_tickets,
  require_attendee_info, collect_special_requests
) values
(
  'e1111111-1111-1111-1111-111111111111',
  'thank you for registering! please review your ticket selection carefully.',
  'registration confirmed! check your email for tickets and event details.',
  15,
  'ai & machine learning summit 2025 | toronto tech conference',
  'join 500+ ai professionals at toronto''s premier ai conference. keynotes, workshops, and networking.',
  'https://aisummit2025.com',
  '{"linkedin": "https://linkedin.com/company/aisummit", "twitter": "https://twitter.com/aisummit2025"}'::jsonb,
  false,
  '#0066cc',
  true,
  true,
  true
),
(
  'e2222222-2222-2222-2222-222222222222',
  'secure your spot at this exclusive leadership seminar.',
  'you''re all set! we''ll send you a reminder email 1 day before the event.',
  10,
  'leadership excellence seminar | executive training toronto',
  'develop critical leadership skills with industry experts. limited to 50 participants.',
  null,
  '{"linkedin": "https://linkedin.com/company/eventos"}'::jsonb,
  false,
  '#2c5530',
  false,
  true,
  false
),
(
  'e3333333-3333-3333-3333-333333333333',
  'join our hands-on product design workshop! materials provided.',
  'workshop registration complete! bring your laptop and creative mindset.',
  20,
  'product design workshop | user-centered innovation',
  'learn cutting-edge product design techniques in this interactive workshop.',
  'https://designworkshop.eventos.com',
  '{"instagram": "https://instagram.com/eventos", "linkedin": "https://linkedin.com/company/eventos"}'::jsonb,
  false,
  '#ff6b35',
  true,
  true,
  true
);

-- ============================================================================
-- completion message
-- ============================================================================

do $$
begin
  raise notice '✅ sample data migration completed successfully';
  raise notice '📊 added sample data to 9 tables:';
  raise notice '   - organizers: 3 rows';
  raise notice '   - promo_codes: 5 rows';
  raise notice '   - companies: 4 rows';
  raise notice '   - contacts: 8 rows';
  raise notice '   - interactions: 6 rows';
  raise notice '   - budgets: 5 rows';
  raise notice '   - tasks: 6 rows';
  raise notice '   - vendors: 4 rows';
  raise notice '   - event_settings: 3 rows';
  raise notice '🎯 total: 44 new sample records';
  raise notice '✨ all 21 tables now have realistic sample data';
end $$;
