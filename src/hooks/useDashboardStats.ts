import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
  totalAttendees: number;
  completedEvents: number;
  draftEvents: number;
}

/**
 * Hook to fetch dashboard statistics
 * Aggregates data from events, tickets, orders, and attendees tables
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Fetch all required data in parallel
      const [
        eventsResult,
        ticketsResult,
        ordersResult,
        attendeesResult,
      ] = await Promise.all([
        // Get events count by status
        supabase
          .from('events')
          .select('id, status, start_date', { count: 'exact' }),

        // Get tickets data
        supabase
          .from('tickets')
          .select('id, price, quantity_sold'),

        // Get orders data
        supabase
          .from('orders')
          .select('id, total_amount, status'),

        // Get attendees count
        supabase
          .from('attendees')
          .select('id', { count: 'exact', head: true }),
      ]);

      // Handle errors
      if (eventsResult.error) throw eventsResult.error;
      if (ticketsResult.error) throw ticketsResult.error;
      if (ordersResult.error) throw ordersResult.error;
      if (attendeesResult.error) throw attendeesResult.error;

      // Calculate stats
      const events = eventsResult.data || [];
      const tickets = ticketsResult.data || [];
      const orders = ordersResult.data || [];

      // Event counts by status
      const totalEvents = eventsResult.count || 0;
      const activeEvents = events.filter(e => e.status === 'published').length;
      const draftEvents = events.filter(e => e.status === 'draft').length;
      const completedEvents = events.filter(e => e.status === 'completed').length;

      // Upcoming events (published and start date in future)
      const now = new Date();
      const upcomingEvents = events.filter(e =>
        e.status === 'published' &&
        new Date(e.start_date) > now
      ).length;

      // Calculate total tickets sold
      const totalTicketsSold = tickets.reduce(
        (sum, ticket) => sum + (ticket.quantity_sold || 0),
        0
      );

      // Calculate total revenue from completed orders
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Total attendees
      const totalAttendees = attendeesResult.count || 0;

      const stats: DashboardStats = {
        totalEvents,
        activeEvents,
        totalTicketsSold,
        totalRevenue,
        upcomingEvents,
        totalAttendees,
        completedEvents,
        draftEvents,
      };

      return stats;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - dashboard stats can be slightly stale
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch recent events for dashboard
 * @param limit - Number of recent events to fetch (default: 5)
 */
export function useRecentEvents(limit: number = 5) {
  return useQuery({
    queryKey: ['recent-events', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          start_date,
          end_date,
          status,
          venue:venues (name, city)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent events:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch recent bookings for dashboard
 * @param limit - Number of recent bookings to fetch (default: 10)
 */
export function useRecentBookings(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-bookings', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          attendee:attendees (
            first_name,
            last_name,
            email
          ),
          event:events (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent bookings:', error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
