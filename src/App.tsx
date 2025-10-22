/**
 * Main Application Component
 *
 * Sets up the provider tree with authentication, React Query, and routing.
 * All dashboard routes are protected and require authentication.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { queryClient } from "@/lib/queryClient";

// Page imports
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventRegistration from "./pages/EventRegistration";
import TicketSelection from "./pages/TicketSelection";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import RegistrationCheckout from "./pages/RegistrationCheckout";
import OrderTracking from "./pages/OrderTracking";
import MobileRegistration from "./pages/MobileRegistration";
import RegistrationError from "./pages/RegistrationError";
import Dashboard from "./pages/Dashboard";
import DashboardEvents from "./pages/DashboardEvents";
import DashboardBookings from "./pages/DashboardBookings";
import DashboardFinancials from "./pages/DashboardFinancials";
import DashboardGallery from "./pages/DashboardGallery";
import DashboardEventDetails from "./pages/DashboardEventDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import EventWizard from "./pages/EventWizard";
import AIEventWizard from "./pages/AIEventWizard";
import RegistrationAnalytics from "./pages/RegistrationAnalytics";
import EmailTemplates from "./pages/EmailTemplates";
import MyRegistrations from "./pages/MyRegistrations";
import RegistrationLanding from "./pages/RegistrationLanding";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/event/:slug" element={<EventDetails />} />
      <Route path="/event/:slug/register" element={<EventRegistration />} />
      <Route path="/event/:slug/tickets" element={<TicketSelection />} />
      <Route path="/event/:slug/payment" element={<PaymentPage />} />
      <Route path="/event/:slug/confirmation" element={<OrderConfirmation />} />
      <Route path="/checkout/:orderId" element={<RegistrationCheckout />} />
      <Route path="/orders/:orderId" element={<OrderTracking />} />
      <Route path="/m/event/:slug/register" element={<MobileRegistration />} />
      <Route path="/error/registration" element={<RegistrationError />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes - Require Authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/event-wizard" element={<EventWizard />} />
              <Route path="/ai-wizard" element={<AIEventWizard />} />
              <Route path="/admin/events/:slug/analytics" element={<RegistrationAnalytics />} />
              <Route path="/admin/email-templates" element={<EmailTemplates />} />
              <Route path="/account/registrations" element={<MyRegistrations />} />
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
            </Route>

            {/* Public Registration Landing */}
            <Route path="/register/:eventSlug" element={<RegistrationLanding />} />

            {/* 404 - Keep this last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
