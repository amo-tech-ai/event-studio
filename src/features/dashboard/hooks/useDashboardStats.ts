import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalEvents: number;
  totalBookings: number;
  totalTickets: number;
  isLoading: boolean;
  error: Error | null;
}

export const useDashboardStats = (): DashboardStats => {
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ["dashboard", "events-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ["dashboard", "orders-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: ticketsData, isLoading: ticketsLoading, error: ticketsError } = useQuery({
    queryKey: ["dashboard", "tickets-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const isLoading = eventsLoading || ordersLoading || ticketsLoading;
  const error = eventsError || ordersError || ticketsError;

  return {
    totalEvents: eventsData || 0,
    totalBookings: ordersData || 0,
    totalTickets: ticketsData || 0,
    isLoading,
    error: error as Error | null,
  };
};
