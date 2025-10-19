/**
 * Events Data Fetching Hooks
 *
 * React Query hooks for fetching and managing event data.
 * Implements caching, automatic refetching, and error handling.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  name: string;
  slug: string;
  type: string;              // Fixed: was event_type
  status: string;
  description: string | null;
  start_at: string;
  end_at: string;
  capacity: number | null;
  price_cents: number;       // Added: price in cents
  venue_id: string | null;   // Added: venue reference
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all published events
 *
 * @example
 * const { data: events, isLoading, error, refetch } = useEvents();
 */
export function useEvents() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_at', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    refetch: () => { refetch(); },
  };
}

/**
 * Fetch a single event by ID
 *
 * @example
 * const { data: event, isLoading } = useEvent(eventId);
 */
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Event;
    },
    enabled: !!id, // Only run if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
