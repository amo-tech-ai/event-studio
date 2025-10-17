-- EventOS Seed Data
-- Comprehensive test data for development and testing

BEGIN;

-- Clear existing data (development only!)
TRUNCATE public.tickets CASCADE;
TRUNCATE public.attendees CASCADE;
TRUNCATE public.orders CASCADE;
TRUNCATE public.events CASCADE;
TRUNCATE public.venues CASCADE;
TRUNCATE public.profiles CASCADE;

-- Insert test profiles (simulating auth.users)
-- Note: In production, profiles are created via auth triggers
-- Using extensions.pgcrypto for password hashing
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'organizer@eventos.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'customer@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'john@techcorp.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert profiles
INSERT INTO public.profiles (id, email, full_name, phone, company)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'organizer@eventos.com', 'Sarah Johnson', '+1-416-555-0101', 'EventOS Inc'),
  ('22222222-2222-2222-2222-222222222222', 'customer@example.com', 'Michael Chen', '+1-416-555-0102', 'Tech Innovations'),
  ('33333333-3333-3333-3333-333333333333', 'john@techcorp.com', 'John Smith', '+1-416-555-0103', 'TechCorp Canada');

-- Insert venues
INSERT INTO public.venues (id, name, address, city, postal_code, capacity, amenities, contact_email, contact_phone)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Metro Toronto Convention Centre', '255 Front St W', 'Toronto', 'M5V 2W6', 5000,
   '{"wifi": true, "parking": true, "av_equipment": true, "catering": true, "accessibility": true}'::jsonb,
   'events@mtccc.com', '+1-416-585-8000'),

  ('a2222222-2222-2222-2222-222222222222', 'The Royal York Hotel', '100 Front St W', 'Toronto', 'M5J 1E3', 1500,
   '{"wifi": true, "parking": true, "av_equipment": true, "catering": true, "hotel": true}'::jsonb,
   'events@fairmont.com', '+1-416-368-2511'),

  ('a3333333-3333-3333-3333-333333333333', 'Design Exchange', '234 Bay St', 'Toronto', 'M5K 1B2', 500,
   '{"wifi": true, "av_equipment": true, "accessibility": true, "modern_design": true}'::jsonb,
   'bookings@dx.org', '+1-416-363-6121'),

  ('a4444444-4444-4444-4444-444444444444', 'Steam Whistle Brewing', '255 Bremner Blvd', 'Toronto', 'M5V 3M9', 800,
   '{"wifi": true, "parking": true, "catering": true, "unique_venue": true, "brewery": true}'::jsonb,
   'events@steamwhistle.ca', '+1-416-362-2337');

-- Insert events
INSERT INTO public.events (id, organizer_id, venue_id, name, slug, type, description, start_at, end_at, capacity, price_cents, status, visibility)
VALUES
  ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111',
   'AI & Machine Learning Summit 2025', 'ai-ml-summit-2025-e1111111', 'conference',
   'Join industry leaders for a two-day conference on the latest in AI and ML technologies, featuring keynote speakers, workshops, and networking opportunities.',
   '2025-06-15 09:00:00-04'::timestamptz, '2025-06-16 18:00:00-04'::timestamptz,
   500, 29900, 'published', 'public'),

  ('e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222',
   'Leadership Excellence Seminar', 'leadership-excellence-seminar-e2222222', 'seminar',
   'A half-day seminar focusing on modern leadership strategies for tech companies. Learn from C-suite executives about building high-performing teams.',
   '2025-07-20 13:00:00-04'::timestamptz, '2025-07-20 17:00:00-04'::timestamptz,
   150, 12900, 'published', 'public'),

  ('e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333',
   'Product Design Workshop: User-Centered Innovation', 'product-design-workshop-e3333333', 'workshop',
   'Hands-on workshop teaching user-centered design principles. Bring your laptop and work on real product challenges with expert facilitators.',
   '2025-08-10 10:00:00-04'::timestamptz, '2025-08-10 16:00:00-04'::timestamptz,
   50, 19900, 'published', 'public'),

  ('e4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444',
   'Tech Startup Networking Night', 'tech-startup-networking-e4444444', 'networking',
   'Connect with Toronto''s tech startup ecosystem. Meet founders, investors, and innovators in a casual brewery setting with drinks and appetizers included.',
   '2025-09-05 18:00:00-04'::timestamptz, '2025-09-05 21:00:00-04'::timestamptz,
   200, 4900, 'published', 'public'),

  ('e5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', NULL,
   'Future Tech Conference 2026', 'future-tech-2026-e5555555', 'conference',
   'Planning stage for our flagship 2026 conference. Venue TBD.',
   '2026-05-15 09:00:00-04'::timestamptz, '2026-05-17 18:00:00-04'::timestamptz,
   1000, 49900, 'draft', 'private');

-- Insert orders (order_number will be auto-generated by trigger)
INSERT INTO public.orders (id, customer_id, event_id, order_number, quantity, unit_price_cents, total_cents, payment_status, stripe_payment_intent_id, paid_at)
VALUES
  ('01111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111',
   '', 2, 29900, 59800, 'paid', 'pi_test_123456789', now() - interval '2 days'),

  ('02222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'e2222222-2222-2222-2222-222222222222',
   '', 1, 12900, 12900, 'paid', 'pi_test_234567890', now() - interval '1 day'),

  ('03333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333333',
   '', 1, 19900, 19900, 'pending', NULL, NULL);

-- Insert attendees
INSERT INTO public.attendees (id, order_id, event_id, full_name, email, phone)
VALUES
  ('a0111111-1111-1111-1111-111111111111', '01111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111',
   'Michael Chen', 'customer@example.com', '+1-416-555-0102'),

  ('a0222222-2222-2222-2222-222222222222', '01111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111',
   'Emily Rodriguez', 'emily.r@techinnovations.com', '+1-416-555-0201'),

  ('a0333333-3333-3333-3333-333333333333', '02222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222',
   'John Smith', 'john@techcorp.com', '+1-416-555-0103'),

  ('a0444444-4444-4444-4444-444444444444', '03333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333',
   'Michael Chen', 'customer@example.com', '+1-416-555-0102');

-- Insert tickets (ticket_number and qr_code will be auto-generated via trigger)
INSERT INTO public.tickets (id, event_id, order_id, attendee_id, ticket_number, qr_code, status)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '01111111-1111-1111-1111-111111111111',
   'a0111111-1111-1111-1111-111111111111', '', '', 'active'),

  ('b2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', '01111111-1111-1111-1111-111111111111',
   'a0222222-2222-2222-2222-222222222222', '', '', 'active'),

  ('b3333333-3333-3333-3333-333333333333', 'e2222222-2222-2222-2222-222222222222', '02222222-2222-2222-2222-222222222222',
   'a0333333-3333-3333-3333-333333333333', '', '', 'used');

COMMIT;

-- Verification queries
SELECT 'Profiles created: ' || count(*)::text FROM public.profiles;
SELECT 'Venues created: ' || count(*)::text FROM public.venues;
SELECT 'Events created: ' || count(*)::text FROM public.events;
SELECT 'Orders created: ' || count(*)::text FROM public.orders;
SELECT 'Attendees created: ' || count(*)::text FROM public.attendees;
SELECT 'Tickets created: ' || count(*)::text FROM public.tickets;

-- Show events with ticket sales (using view)
SELECT
  s.event_name,
  e.type,
  e.status,
  s.capacity,
  s.tickets_sold,
  e.price_cents / 100.0 as price_dollars,
  v.name as venue_name
FROM public.event_stats s
JOIN public.events e ON e.id = s.event_id
LEFT JOIN public.venues v ON e.venue_id = v.id
ORDER BY e.start_at;
