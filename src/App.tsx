import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardEvents from "./pages/DashboardEvents";
import DashboardBookings from "./pages/DashboardBookings";
import DashboardFinancials from "./pages/DashboardFinancials";
import DashboardGallery from "./pages/DashboardGallery";
import DashboardEventDetails from "./pages/DashboardEventDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import EventWizard from "./pages/EventWizard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/event-wizard" element={<EventWizard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/events" element={<DashboardEvents />} />
          <Route path="/dashboard/events/:id" element={<DashboardEventDetails />} />
          <Route path="/dashboard/bookings" element={<DashboardBookings />} />
          <Route path="/dashboard/financials" element={<DashboardFinancials />} />
          <Route path="/dashboard/gallery" element={<DashboardGallery />} />
          <Route path="/dashboard/analytics" element={<Dashboard />} />
          <Route path="/dashboard/calendar" element={<Dashboard />} />
          <Route path="/dashboard/organizers" element={<Dashboard />} />
          <Route path="/dashboard/venues" element={<Dashboard />} />
          <Route path="/dashboard/settings" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
