// TanStack Query Patterns for event-studio Dashboard

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// BASIC QUERY PATTERNS
// ============================================================================

/**
 * Simple data fetching hook
 */
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Query with parameters
 */
export function useEventsByStatus(status: string) {
  return useQuery({
    queryKey: ['events', 'status', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', status);

      if (error) throw error;
      return data;
    },
    enabled: !!status, // Only run if status is provided
  });
}

/**
 * Single item query
 */
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          bookings (
            id,
            user_id,
            total_amount,
            status
          ),
          organizer:users!organizer_id (
            id,
            full_name,
            email
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

// ============================================================================
// AGGREGATIONS & ANALYTICS
// ============================================================================

/**
 * Dashboard metrics with aggregations
 */
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      // Get total events
      const { count: totalEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Get active events
      const { count: activeEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const totalRevenue = recentBookings?.reduce(
        (sum, booking) => sum + (booking.total_amount || 0),
        0
      ) || 0;

      return {
        totalEvents: totalEvents || 0,
        activeEvents: activeEvents || 0,
        totalBookings: totalBookings || 0,
        totalRevenue,
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Revenue analytics over time
 */
export function useRevenueAnalytics(days: number = 30) {
  return useQuery({
    queryKey: ['revenue-analytics', days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('bookings')
        .select('created_at, total_amount')
        .eq('status', 'confirmed')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const groupedData = data.reduce((acc, booking) => {
        const date = new Date(booking.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += booking.total_amount || 0;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(groupedData).map(([date, revenue]) => ({
        date,
        revenue,
      }));
    },
  });
}

// ============================================================================
// MUTATION PATTERNS
// ============================================================================

/**
 * Create mutation with optimistic update
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: any) => {
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newEvent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['events'] });

      // Snapshot previous value
      const previousEvents = queryClient.getQueryData(['events']);

      // Optimistically update
      queryClient.setQueryData(['events'], (old: any[]) => [
        { ...newEvent, id: 'temp-id', created_at: new Date().toISOString() },
        ...(old || []),
      ]);

      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      // Rollback on error
      if (context?.previousEvents) {
        queryClient.setQueryData(['events'], context.previousEvents);
      }
      toast.error('Failed to create event');
    },
    onSuccess: (data) => {
      toast.success('Event created successfully');
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

/**
 * Update mutation
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
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
      // Update individual event cache
      queryClient.setQueryData(['events', data.id], data);
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
    },
    onError: () => {
      toast.error('Failed to update event');
    },
  });
}

/**
 * Delete mutation
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
      toast.success('Event deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete event');
    },
  });
}

// ============================================================================
// INFINITE SCROLL PATTERN
// ============================================================================

const PAGE_SIZE = 20;

export function useInfiniteEvents() {
  return useInfiniteQuery({
    queryKey: ['events', 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (error) throw error;
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length * PAGE_SIZE;
    },
    initialPageParam: 0,
  });
}

// ============================================================================
// DEPENDENT QUERIES
// ============================================================================

/**
 * Query that depends on another query
 */
export function useEventBookings(eventId: string | undefined) {
  return useQuery({
    queryKey: ['bookings', 'event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID required');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users!user_id (
            id,
            full_name,
            email
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!eventId, // Only run when eventId is available
  });
}

// ============================================================================
// PARALLEL QUERIES
// ============================================================================

/**
 * Fetch multiple related datasets in parallel
 */
export function useEventDashboard(eventId: string) {
  const event = useEvent(eventId);
  const bookings = useEventBookings(eventId);
  const analytics = useRevenueAnalytics(30);

  return {
    event,
    bookings,
    analytics,
    isLoading: event.isLoading || bookings.isLoading || analytics.isLoading,
    isError: event.isError || bookings.isError || analytics.isError,
  };
}

// ============================================================================
// POLLING PATTERN
// ============================================================================

/**
 * Auto-refresh data every N seconds
 */
export function useLiveBookings() {
  return useQuery({
    queryKey: ['bookings', 'live'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// ============================================================================
// PREFETCH PATTERN
// ============================================================================

/**
 * Prefetch data for better UX
 */
export function usePrefetchEvent() {
  const queryClient = useQueryClient();

  return (eventId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['events', eventId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        return data;
      },
    });
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Simple Query
function EventsList() {
  const { data, isLoading, error } = useEvents();

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorAlert error={error} />;

  return <DataTable data={data} />;
}

// Example 2: Mutation
function CreateEventButton() {
  const createEvent = useCreateEvent();

  const handleCreate = () => {
    createEvent.mutate({
      title: 'New Event',
      status: 'draft',
    });
  };

  return (
    <Button onClick={handleCreate} disabled={createEvent.isPending}>
      {createEvent.isPending ? 'Creating...' : 'Create Event'}
    </Button>
  );
}

// Example 3: Infinite Scroll
function EventsInfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteEvents();

  return (
    <>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map(event => <EventCard key={event.id} event={event} />)}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </>
  );
}
*/
