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

interface DashboardStatsResponse {
  total_events: number;
  total_orders: number;
  total_tickets: number;
}

/**
 * Hook to fetch dashboard statistics using secure SECURITY DEFINER function.
 *
 * Security: Uses get_dashboard_stats() function which only returns aggregated counts,
 * not individual record access. This prevents anonymous users from reading sensitive data.
 *
 * @returns Dashboard statistics with loading and error states
 */
export const useDashboardStats = (): DashboardStats => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      // Call the secure SECURITY DEFINER function
      const { data, error } = await supabase.rpc<DashboardStatsResponse>(
        "get_dashboard_stats"
      );

      if (error) throw error;
      return data;
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
