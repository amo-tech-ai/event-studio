/**
 * TanStack Query Patterns for Supabase
 *
 * Complete reference of common query patterns used in EventOS
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/client';

// ============================================================================
// QUERY PATTERNS
// ============================================================================

/**
 * Pattern 1: Simple List Query
 * Use for: Fetching all records of a table
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
      return data;
    },
    staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
  });
}

/**
 * Pattern 2: Single Item Query
 * Use for: Fetching one record by ID
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
      return data;
    },
    enabled: !!id, // Only run if ID exists
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Pattern 3: Filtered Query with Parameters
 * Use for: Dynamic filtering based on user input
 */
export function useEventsFiltered(filters: {
  status?: string;
  type?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['events', 'filtered', filters],
    queryFn: async () => {
      let query = supabase.from('events').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters.dateFrom) {
        query = query.gte('start_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('start_at', filters.dateTo);
      }

      const { data, error } = await query.order('start_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Pattern 4: Paginated Query
 * Use for: Large datasets with pagination
 */
export function useEventsPaginated(page: number, pageSize: number = 10) {
  return useQuery({
    queryKey: ['events', 'paginated', page, pageSize],
    queryFn: async () => {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('start_at', { ascending: false });

      if (error) throw error;

      return {
        events: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        hasMore: (count || 0) > to + 1,
      };
    },
    keepPreviousData: true, // Keep old data while fetching new page
  });
}

/**
 * Pattern 5: Query with Joins
 * Use for: Fetching related data in one query
 */
export function useEventWithRelations(id: string) {
  return useQuery({
    queryKey: ['event', 'full', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(
            id,
            name,
            address,
            city,
            capacity
          ),
          organizer:profiles(
            id,
            full_name,
            avatar_url,
            email
          ),
          ticket_tiers(
            id,
            name,
            price_cents,
            capacity,
            quantity_sold
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Pattern 6: Aggregation Query
 * Use for: Counting, summing, or stats
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const [eventsRes, ordersRes, ticketsRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('tickets').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalEvents: eventsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalTickets: ticketsRes.count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // Refresh every 2 minutes
  });
}

/**
 * Pattern 7: Dependent Query
 * Use for: Query that depends on another query's result
 */
export function useEventTickets(eventId: string) {
  const { data: event } = useEvent(eventId);

  return useQuery({
    queryKey: ['tickets', 'event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return data;
    },
    enabled: !!event, // Only run if event exists
  });
}

/**
 * Pattern 8: Infinite Query
 * Use for: Infinite scroll
 */
export function useEventsInfinite(pageSize: number = 10) {
  return useInfiniteQuery({
    queryKey: ['events', 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('start_at', { ascending: false });

      if (error) throw error;

      return {
        events: data || [],
        nextPage: (count || 0) > to + 1 ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

// ============================================================================
// MUTATION PATTERNS
// ============================================================================

/**
 * Pattern 1: Create Mutation
 * Use for: Creating new records
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Tables<'events'>['Insert']) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

/**
 * Pattern 2: Update Mutation
 * Use for: Updating existing records
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Tables<'events'>['Update']>) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
    },
  });
}

/**
 * Pattern 3: Delete Mutation
 * Use for: Deleting records
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

/**
 * Pattern 4: Optimistic Update
 * Use for: Immediate UI feedback
 */
export function useUpdateEventOptimistic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Tables<'events'>['Update']>) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, ...updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['event', id] });

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData(['event', id]);

      // Optimistically update
      queryClient.setQueryData(['event', id], (old: any) => ({
        ...old,
        ...updates,
        updated_at: new Date().toISOString(),
      }));

      return { previousEvent };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousEvent) {
        queryClient.setQueryData(['event', variables.id], context.previousEvent);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
}

/**
 * Pattern 5: Batch Mutation
 * Use for: Multiple operations at once
 */
export function useBulkDeleteEvents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

/**
 * Centralized query keys for better organization
 */
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  stats: () => [...eventKeys.all, 'stats'] as const,
};

// Usage:
// useQuery({ queryKey: eventKeys.list('published'), ... })
// queryClient.invalidateQueries({ queryKey: eventKeys.all })
