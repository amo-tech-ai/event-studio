// Supabase Query Patterns for event-studio

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// BASIC QUERIES
// ============================================================================

// Select all
const { data } = await supabase.from('events').select('*');

// Select specific columns
const { data } = await supabase.from('events').select('id, title, start_date');

// Single row
const { data } = await supabase.from('events').select('*').eq('id', id).single();

// ============================================================================
// FILTERS
// ============================================================================

// Equality
const { data } = await supabase.from('events').select('*').eq('status', 'active');

// Multiple conditions (AND)
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'active')
  .eq('visibility', 'public');

// OR conditions
const { data } = await supabase
  .from('events')
  .select('*')
  .or('status.eq.draft,status.eq.active');

// Date range
const { data } = await supabase
  .from('events')
  .select('*')
  .gte('start_date', startDate)
  .lte('start_date', endDate);

// Text search (case-insensitive)
const { data } = await supabase
  .from('events')
  .select('*')
  .ilike('title', `%${query}%`);

// IN filter
const { data } = await supabase
  .from('events')
  .select('*')
  .in('category', ['music', 'tech']);

// ============================================================================
// JOINS & RELATIONSHIPS
// ============================================================================

// One-to-many
const { data } = await supabase
  .from('events')
  .select('*, bookings(id, total_amount, status)')
  .eq('id', eventId)
  .single();

// Many-to-one (foreign key)
const { data } = await supabase
  .from('events')
  .select(`
    *,
    organizer:users!organizer_id (id, full_name, email)
  `)
  .eq('id', eventId)
  .single();

// Multiple levels
const { data } = await supabase
  .from('events')
  .select(`
    *,
    organizer:users!organizer_id (id, full_name),
    bookings (
      id,
      total_amount,
      user:users!user_id (full_name, email)
    )
  `);

// ============================================================================
// AGGREGATIONS
// ============================================================================

// Count
const { count } = await supabase
  .from('events')
  .select('*', { count: 'exact', head: true });

// Count with filter
const { count } = await supabase
  .from('events')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'active');

// Sum (manual aggregation)
const { data } = await supabase
  .from('bookings')
  .select('total_amount')
  .eq('status', 'confirmed');

const total = data.reduce((sum, b) => sum + (b.total_amount || 0), 0);

// ============================================================================
// ORDERING & PAGINATION
// ============================================================================

// Order by
const { data } = await supabase
  .from('events')
  .select('*')
  .order('start_date', { ascending: false });

// Pagination
const from = page * pageSize;
const to = from + pageSize - 1;

const { data, count } = await supabase
  .from('events')
  .select('*', { count: 'exact' })
  .range(from, to)
  .order('created_at', { ascending: false });

// Limit
const { data } = await supabase
  .from('events')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);

// ============================================================================
// INSERT, UPDATE, DELETE
// ============================================================================

// Insert
const { data } = await supabase
  .from('events')
  .insert({ title: 'New Event', status: 'draft' })
  .select()
  .single();

// Update
const { data } = await supabase
  .from('events')
  .update({ status: 'active' })
  .eq('id', id)
  .select()
  .single();

// Delete
const { error } = await supabase.from('events').delete().eq('id', id);

// Upsert
const { data } = await supabase
  .from('events')
  .upsert({ id, title: 'Updated' })
  .select()
  .single();

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

// Subscribe to changes
const channel = supabase
  .channel('events-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'events' },
    (payload) => {
      console.log('Change:', payload);
    }
  )
  .subscribe();

// Cleanup
supabase.removeChannel(channel);

// ============================================================================
// FILE STORAGE
// ============================================================================

// Upload
const { data } = await supabase.storage
  .from('event-images')
  .upload(`${eventId}/${file.name}`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('event-images')
  .getPublicUrl(path);

// Delete
await supabase.storage.from('event-images').remove([path]);

// ============================================================================
// AUTHENTICATION
// ============================================================================

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// User's events
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('organizer_id', user.id);

// ============================================================================
// COMPLEX QUERIES
// ============================================================================

// Dashboard data (parallel queries)
const [eventsResult, bookingsResult, revenueResult] = await Promise.all([
  supabase.from('events').select('*', { count: 'exact', head: true }),
  supabase.from('bookings').select('*', { count: 'exact', head: true }),
  supabase.from('bookings').select('total_amount').eq('status', 'confirmed'),
]);

// Advanced search with multiple filters
let query = supabase.from('events').select('*');

if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
if (status) query = query.eq('status', status);
if (category) query = query.eq('category', category);
if (startDate) query = query.gte('start_date', startDate);
if (endDate) query = query.lte('end_date', endDate);

const { data } = await query;
