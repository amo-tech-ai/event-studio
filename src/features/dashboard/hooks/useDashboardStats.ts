import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalEvents: number;
  totalBookings: number;
  totalTickets: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch dashboard statistics with direct database queries.
 * Fetches aggregated counts from events, orders, and tickets tables.
 *
 * @returns Dashboard statistics with loading and error states
 */
export const useDashboardStats = (): DashboardStats => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      // Fetch all counts in parallel for better performance
      const [eventsResult, ordersResult, ticketsResult] = await Promise.all([
        // Count total events
        supabase
          .from('events')
          .select('id', { count: 'exact', head: true }),

        // Count total orders (bookings)
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true }),

        // Sum total tickets sold
        supabase
          .from('tickets')
          .select('quantity_sold'),
      ]);

      // Handle errors
      if (eventsResult.error) throw eventsResult.error;
      if (ordersResult.error) throw ordersResult.error;
      if (ticketsResult.error) throw ticketsResult.error;

      // Calculate total tickets sold
      const totalTicketsSold = (ticketsResult.data || []).reduce(
        (sum, ticket) => sum + (ticket.quantity_sold || 0),
        0
      );

      return {
        total_events: eventsResult.count || 0,
        total_orders: ordersResult.count || 0,
        total_tickets: totalTicketsSold,
      };
    },
    // Cache for 30 seconds to reduce database load
    staleTime: 30000,
    // Retry failed requests up to 2 times
    retry: 2,
  });

  return {
    totalEvents: data?.total_events || 0,
    totalBookings: data?.total_orders || 0,
    totalTickets: data?.total_tickets || 0,
    isLoading,
    error: error as Error | null,
    refetch: () => { refetch(); },
  };
};
