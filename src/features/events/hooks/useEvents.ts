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
  event_type: string;
  status: string;
  description: string | null;
  start_at: string;
  end_at: string;
  capacity: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all published events
 *
 * @example
 * const { data: events, isLoading, error } = useEvents();
 */
export function useEvents() {
  return useQuery({
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
