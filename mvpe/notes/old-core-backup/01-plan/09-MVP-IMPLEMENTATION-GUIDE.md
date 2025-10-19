# EventOS MVP - Implementation Guide

**Project:** EventOS MVP - AI-Powered Event Management (Expanded)
**Version:** 2.0 (with CRM, WhatsApp, Marketing, Venue)
**Last Updated:** 2025-10-17
**Status:** Implementation Guide

---

## 📋 Table of Contents

### Part 1: Core Event Features
1. [Project Setup](#1-project-setup)
2. [AI Event Wizard](#2-ai-event-wizard-copilotkit)
3. [Ticketing System](#3-ticketing-system)
4. [Payment Processing](#4-payment-processing-stripe)
5. [Public Event Pages](#5-public-event-pages)
6. [Email Notifications](#6-email-notifications-resend)

### Part 2: Business Features
7. [CRM System](#7-crm-system)
8. [WhatsApp Automation](#8-whatsapp-automation)
9. [Marketing Campaigns](#9-marketing-campaigns)
10. [Venue Database](#10-venue-database)

### Part 3: Dashboard & Polish
11. [Organizer Dashboard](#11-organizer-dashboard)
12. [Testing & Deployment](#12-testing--deployment)

---

## 🎯 Overview

This implementation guide covers building EventOS MVP with **10 core feature areas**:

**Original 6 MVP Features:**
- ✅ AI Event Wizard (CopilotKit)
- ✅ Ticketing System
- ✅ Payment Processing (Stripe)
- ✅ Public Event Pages
- ✅ Email Notifications (Resend)
- ✅ Organizer Dashboard

**Expanded 4 Business Features:**
- ✅ CRM System (Contact Management)
- ✅ WhatsApp Automation (Business API)
- ✅ Marketing Campaigns (Email + Social)
- ✅ Venue Database (Search + Booking)

**Timeline:** 6-8 weeks (extended from original 4 weeks)

---

## 1. Project Setup

### 1.1 Initialize React Project

```bash
# Create Vite project
npm create vite@latest eventos-mvp -- --template react-ts
cd eventos-mvp
npm install

# Install core dependencies
npm install @supabase/supabase-js
npm install @copilotkit/react-core @copilotkit/react-ui
npm install openai
npm install @stripe/stripe-js stripe
npm install react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install zod
npm install lucide-react
npm install date-fns

# Install shadcn/ui
npx shadcn-ui@latest init

# Install shadcn components
npx shadcn-ui@latest add button card input textarea select dialog toast

# Install Tailwind plugins
npm install -D tailwindcss-animate
```

### 1.2 Set Up Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase project
npx supabase init

# Start local development
npx supabase start

# Link to remote project (optional)
npx supabase link --project-ref YOUR_PROJECT_ID
```

### 1.3 Environment Variables

```env
# .env.local
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_OPENAI_API_KEY=sk-...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_id
VITE_WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
```

### 1.4 Project Structure

```
src/
├── components/
│   ├── wizard/          # AI Event Wizard
│   ├── events/          # Event CRUD
│   ├── tickets/         # Ticketing
│   ├── crm/             # CRM System (NEW)
│   ├── whatsapp/        # WhatsApp Integration (NEW)
│   ├── marketing/       # Marketing Campaigns (NEW)
│   ├── venues/          # Venue Database (NEW)
│   ├── dashboard/       # Dashboard
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── supabase.ts
│   ├── copilot.ts
│   ├── openai.ts
│   ├── stripe.ts
│   ├── whatsapp.ts      # (NEW)
│   └── utils.ts
├── hooks/
│   ├── useEvent.ts
│   ├── useTickets.ts
│   ├── useCRM.ts        # (NEW)
│   ├── useWhatsApp.ts   # (NEW)
│   ├── useCampaigns.ts  # (NEW)
│   └── useVenues.ts     # (NEW)
├── pages/
│   ├── HomePage.tsx
│   ├── EventPage.tsx
│   ├── DashboardPage.tsx
│   ├── CRMPage.tsx      # (NEW)
│   ├── MarketingPage.tsx # (NEW)
│   └── VenuesPage.tsx   # (NEW)
└── App.tsx
```

---

## 2. AI Event Wizard (CopilotKit)

### 2.1 Install CopilotKit

```bash
npm install @copilotkit/react-core @copilotkit/react-ui openai
```

### 2.2 Configure CopilotKit Provider

```typescript
// src/lib/copilot.ts
import { CopilotKit } from "@copilotkit/react-core";

export const copilotConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: "gpt-4o"
  }
};
```

### 2.3 Wrap App with CopilotKit

```typescript
// src/App.tsx
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function App() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      instructions={`
        You are an AI event planning assistant for EventOS.
        Help users create professional business events quickly.

        Conversation Flow:
        1. Gather event basics: name, date, location, capacity
        2. Suggest ticket tiers with pricing
        3. Recommend venues from database (NEW)
        4. Create event and provide next steps

        Be professional, efficient, and suggest best practices.
      `}
    >
      <Router>
        <Routes>
          {/* Routes here */}
        </Routes>
      </Router>
    </CopilotKit>
  );
}
```

### 2.4 Create Wizard Component

```typescript
// src/components/wizard/EventWizard.tsx
import { useState } from "react";
import { CopilotSidebar, useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { supabase } from "@/lib/supabase";

interface WizardState {
  stage: "event_details" | "ticket_config" | "venue_search" | "review";
  eventData: Partial<Event>;
  ticketData: Partial<Ticket>[];
  selectedVenue?: Venue;
}

export function EventWizard() {
  const [state, setState] = useState<WizardState>({
    stage: "event_details",
    eventData: {},
    ticketData: []
  });

  const { user } = useAuth();

  // Make state readable to AI
  useCopilotReadable({
    description: "Current wizard state and progress",
    value: state
  });

  // Action 1: Save Event Details
  useCopilotAction({
    name: "saveEventDetails",
    description: "Save basic event information",
    parameters: [
      { name: "name", type: "string", required: true, description: "Event name" },
      { name: "date", type: "string", required: true, description: "Event date (ISO format)" },
      { name: "location", type: "string", required: true, description: "Event location" },
      { name: "capacity", type: "number", required: true, description: "Max attendees" },
      { name: "description", type: "string", description: "Event description" }
    ],
    handler: async ({ name, date, location, capacity, description }) => {
      // Generate slug
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      setState((s) => ({
        ...s,
        stage: "venue_search",
        eventData: {
          name,
          start_date: date,
          location,
          capacity,
          description,
          slug,
          organizer_id: user.id
        }
      }));

      return `Event "${name}" details saved! Let me search for venues that match your needs.`;
    }
  });

  // Action 2: Search Venues (NEW)
  useCopilotAction({
    name: "searchVenues",
    description: "Search for venues matching event requirements",
    parameters: [
      { name: "city", type: "string", required: true },
      { name: "capacity", type: "number", required: true }
    ],
    handler: async ({ city, capacity }) => {
      const { data: venues } = await supabase
        .from("venues")
        .select("*")
        .ilike("city", `%${city}%`)
        .gte("capacity", capacity * 0.8) // Allow 20% flexibility
        .lte("capacity", capacity * 1.5)
        .limit(5);

      if (venues && venues.length > 0) {
        const venueList = venues.map((v) =>
          `- ${v.name} (${v.capacity} capacity, $${v.price_per_day}/day)`
        ).join("\n");

        return `Found ${venues.length} venues:\n${venueList}\n\nWhich venue interests you?`;
      }

      return `No venues found in ${city} for ${capacity} attendees. Would you like to search in a nearby city?`;
    }
  });

  // Action 3: Select Venue (NEW)
  useCopilotAction({
    name: "selectVenue",
    description: "Select a venue for the event",
    parameters: [
      { name: "venueId", type: "string", required: true }
    ],
    handler: async ({ venueId }) => {
      const { data: venue } = await supabase
        .from("venues")
        .select("*")
        .eq("id", venueId)
        .single();

      if (venue) {
        setState((s) => ({
          ...s,
          stage: "ticket_config",
          selectedVenue: venue,
          eventData: {
            ...s.eventData,
            venue_id: venue.id,
            location: `${venue.name}, ${venue.city}`
          }
        }));

        return `Great! I've selected ${venue.name}. Now let's configure ticket tiers.`;
      }

      return "Venue not found. Please try another venue.";
    }
  });

  // Action 4: Add Ticket Tier
  useCopilotAction({
    name: "addTicketTier",
    description: "Add a ticket tier with pricing",
    parameters: [
      { name: "name", type: "string", required: true },
      { name: "price", type: "number", required: true },
      { name: "quantity", type: "number", required: true }
    ],
    handler: async ({ name, price, quantity }) => {
      setState((s) => ({
        ...s,
        ticketData: [...s.ticketData, { name, price, quantity }]
      }));

      return `Ticket tier "${name}" added ($${price}, ${quantity} available). Add more tiers or say "create event" to finish.`;
    }
  });

  // Action 5: Create Event
  useCopilotAction({
    name: "createEvent",
    description: "Create the event with all details",
    parameters: [],
    handler: async () => {
      // Insert event
      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          ...state.eventData,
          status: "draft"
        })
        .select()
        .single();

      if (eventError) {
        return `Error creating event: ${eventError.message}`;
      }

      // Insert tickets
      const ticketsToInsert = state.ticketData.map((t) => ({
        ...t,
        event_id: event.id
      }));

      const { error: ticketsError } = await supabase
        .from("tickets")
        .insert(ticketsToInsert);

      if (ticketsError) {
        return `Event created but error adding tickets: ${ticketsError.message}`;
      }

      // Create venue booking record (NEW)
      if (state.selectedVenue) {
        await supabase.from("venue_bookings").insert({
          venue_id: state.selectedVenue.id,
          event_id: event.id,
          status: "pending"
        });
      }

      setState((s) => ({ ...s, stage: "review" }));

      return `✅ Event created successfully!\n\nView at: /events/${event.slug}\nDashboard: /dashboard\n\nNext steps:\n1. Publish event\n2. Set up CRM contacts\n3. Create marketing campaign`;
    }
  });

  return (
    <CopilotSidebar
      defaultOpen
      labels={{
        title: "AI Event Assistant",
        initial: "Hi! I'll help you create a professional event in minutes. Let's start with some basics: What's your event name?"
      }}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Create Event with AI</h1>

        {/* Show current state */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Progress:</h2>
          <div className="space-y-1">
            <div className={state.stage === "event_details" ? "font-bold" : ""}>
              1. Event Details {state.eventData.name && "✓"}
            </div>
            <div className={state.stage === "venue_search" ? "font-bold" : ""}>
              2. Venue Selection {state.selectedVenue && "✓"}
            </div>
            <div className={state.stage === "ticket_config" ? "font-bold" : ""}>
              3. Ticket Configuration {state.ticketData.length > 0 && "✓"}
            </div>
            <div className={state.stage === "review" ? "font-bold" : ""}>
              4. Review & Create
            </div>
          </div>
        </div>

        {/* Event Preview */}
        {state.eventData.name && (
          <div className="mt-6 border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{state.eventData.name}</h2>
            <p className="text-gray-600">{state.eventData.location}</p>
            <p className="text-sm text-gray-500">
              {state.eventData.start_date} • {state.eventData.capacity} attendees
            </p>

            {state.selectedVenue && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="text-sm font-medium">Selected Venue:</p>
                <p className="text-sm">{state.selectedVenue.name}</p>
              </div>
            )}

            {state.ticketData.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Tickets:</h3>
                <ul className="space-y-1">
                  {state.ticketData.map((t, i) => (
                    <li key={i} className="text-sm">
                      {t.name} - ${t.price} ({t.quantity} available)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </CopilotSidebar>
  );
}
```

---

## 3. Ticketing System

### 3.1 Ticket Configuration Component

```typescript
// src/components/tickets/TicketConfig.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface TicketTier {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export function TicketConfig({ eventId }: { eventId: string }) {
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [newTier, setNewTier] = useState<TicketTier>({
    name: "",
    description: "",
    price: 0,
    quantity: 100
  });

  const addTier = async () => {
    const { error } = await supabase.from("tickets").insert({
      ...newTier,
      event_id: eventId
    });

    if (!error) {
      setTiers([...tiers, newTier]);
      setNewTier({ name: "", description: "", price: 0, quantity: 100 });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Configure Tickets</h2>

      {/* Existing tiers */}
      {tiers.map((tier, i) => (
        <Card key={i} className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{tier.name}</h3>
              <p className="text-sm text-gray-600">{tier.description}</p>
              <p className="text-lg font-bold mt-2">${tier.price}</p>
              <p className="text-sm text-gray-500">{tier.quantity} available</p>
            </div>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}

      {/* Add new tier */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Add Ticket Tier</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Tier name (e.g., General Admission)"
            value={newTier.name}
            onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newTier.price}
            onChange={(e) => setNewTier({ ...newTier, price: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newTier.quantity}
            onChange={(e) => setNewTier({ ...newTier, quantity: parseInt(e.target.value) })}
          />
          <Button onClick={addTier} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

---

## 4. Payment Processing (Stripe)

### 4.1 Create Checkout Session (Edge Function)

```typescript
// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16"
});

serve(async (req) => {
  try {
    const { eventId, tickets } = await req.json();

    // Calculate line items
    const lineItems = tickets.map((ticket: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: ticket.name,
          description: ticket.description
        },
        unit_amount: Math.round(ticket.price * 100)
      },
      quantity: ticket.quantity
    }));

    // Create session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/events/${eventId}`,
      metadata: {
        eventId,
        tickets: JSON.stringify(tickets)
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

### 4.2 Stripe Webhook Handler

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { eventId, tickets } = session.metadata!;

      // Create order
      const { data: order } = await supabase
        .from("orders")
        .insert({
          event_id: eventId,
          user_email: session.customer_details!.email,
          user_name: session.customer_details!.name,
          total_amount: session.amount_total! / 100,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_checkout_session_id: session.id,
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      // Create attendees
      const ticketsParsed = JSON.parse(tickets);
      const attendees = ticketsParsed.flatMap((ticket: any) =>
        Array.from({ length: ticket.quantity }, () => ({
          order_id: order.id,
          event_id: eventId,
          ticket_id: ticket.id,
          attendee_name: session.customer_details!.name,
          attendee_email: session.customer_details!.email,
          qr_code: crypto.randomUUID(),
          ticket_number: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))
      );

      await supabase.from("attendees").insert(attendees);

      // Send tickets via email
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id })
      });

      // Send WhatsApp confirmation (NEW)
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: session.customer_details!.phone || session.customer_details!.email,
          message: `Your tickets for ${session.metadata!.eventName} are confirmed! Check your email for details.`
        })
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});
```

---

## 5. Public Event Pages

### 5.1 Event Detail Page

```typescript
// src/pages/EventPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";

export function EventPage() {
  const { slug } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select(`
          *,
          tickets (*),
          venue:venues (*)
        `)
        .eq("slug", slug)
        .single();
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        <img
          src={event.cover_image_url || "/placeholder-event.jpg"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
            <div className="flex items-center gap-6 text-lg">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(event.start_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {event.location}
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {event.capacity} capacity
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </Card>

          {/* Venue Info (NEW) */}
          {event.venue && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Venue</h2>
              <div className="flex gap-4">
                <img
                  src={event.venue.image_url}
                  alt={event.venue.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{event.venue.name}</h3>
                  <p className="text-gray-600">{event.venue.address}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Capacity: {event.venue.capacity} | Amenities: {event.venue.amenities.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Tickets Sidebar */}
        <div>
          <Card className="p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Get Tickets</h2>
            <div className="space-y-4">
              {event.tickets.map((ticket: any) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{ticket.name}</h3>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                    </div>
                    <p className="text-xl font-bold">${ticket.price}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {ticket.quantity - ticket.sold} / {ticket.quantity} available
                  </p>
                  <Button className="w-full">Select</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Email Notifications (Resend)

### 6.1 Send Tickets Email

```typescript
// supabase/functions/send-tickets/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const { orderId } = await req.json();

  // Fetch order and attendees
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      event:events (*),
      attendees (*)
    `)
    .eq("id", orderId)
    .single();

  // Generate email HTML
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .ticket { border: 2px solid #000; padding: 20px; margin: 10px 0; }
          .qr-code { width: 200px; height: 200px; }
        </style>
      </head>
      <body>
        <h1>Your Tickets for ${order.event.name}</h1>
        <p>Thank you for your purchase, ${order.user_name}!</p>

        <div>
          <h2>Event Details:</h2>
          <p><strong>Date:</strong> ${new Date(order.event.start_date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${order.event.location}</p>
        </div>

        <h2>Your Tickets:</h2>
        ${order.attendees.map((attendee: any) => `
          <div class="ticket">
            <h3>${attendee.attendee_name}</h3>
            <p>Ticket #: ${attendee.ticket_number}</p>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${attendee.qr_code}"
              alt="QR Code"
              class="qr-code"
            />
          </div>
        `).join("")}

        <p>Show this QR code at the entrance for check-in.</p>
      </body>
    </html>
  `;

  // Send email via Resend
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: "EventOS <tickets@eventos.com>",
      to: order.user_email,
      subject: `Your Tickets for ${order.event.name}`,
      html: emailHtml
    })
  });

  if (response.ok) {
    // Mark emails as sent
    await supabase
      .from("attendees")
      .update({ email_sent: true, email_sent_at: new Date().toISOString() })
      .in("id", order.attendees.map((a: any) => a.id));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(
    JSON.stringify({ error: "Failed to send email" }),
    { status: 500 }
  );
});
```

---

## 7. CRM System

### 7.1 Database Schema (CRM Tables)

```sql
-- Add to database migration

-- CRM Contacts
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('organizer', 'sponsor', 'vendor', 'attendee')),

  -- Basic Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,

  -- Contact Details
  title TEXT,
  website TEXT,
  linkedin_url TEXT,

  -- Status & Health
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),

  -- Engagement
  last_contacted_at TIMESTAMPTZ,
  last_event_attended_at TIMESTAMPTZ,
  total_events_attended INTEGER DEFAULT 0,
  total_revenue_generated NUMERIC(10, 2) DEFAULT 0,

  -- Tags
  tags TEXT[] DEFAULT '{}',

  -- Metadata
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_contacts_organizer ON crm_contacts(organizer_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_type ON crm_contacts(contact_type);

-- CRM Interactions
CREATE TABLE crm_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,

  interaction_type TEXT NOT NULL CHECK (
    interaction_type IN ('email', 'call', 'meeting', 'whatsapp', 'note')
  ),

  subject TEXT NOT NULL,
  content TEXT,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_created ON crm_interactions(created_at);
```

### 7.2 CRM Dashboard Component

```typescript
// src/components/crm/CRMDashboard.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus, Search, Mail, Phone, MessageCircle } from "lucide-react";

export function CRMDashboard() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: contacts, refetch } = useQuery({
    queryKey: ["crm-contacts", filter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("crm_contacts")
        .select("*")
        .eq("organizer_id", (await supabase.auth.getUser()).data.user!.id);

      if (filter !== "all") {
        query = query.eq("contact_type", filter);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`);
      }

      const { data } = await query.order("created_at", { ascending: false });
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ["crm-stats"],
    queryFn: async () => {
      const userId = (await supabase.auth.getUser()).data.user!.id;

      const { count: totalContacts } = await supabase
        .from("crm_contacts")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", userId);

      const { count: sponsors } = await supabase
        .from("crm_contacts")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", userId)
        .eq("contact_type", "sponsor");

      const { count: vendors } = await supabase
        .from("crm_contacts")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", userId)
        .eq("contact_type", "vendor");

      return { totalContacts, sponsors, vendors };
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CRM - Contact Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Contacts</h3>
          <p className="text-3xl font-bold">{stats?.totalContacts || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Sponsors</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.sponsors || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Vendors</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.vendors || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Avg Health Score</h3>
          <p className="text-3xl font-bold text-purple-600">78%</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <option value="all">All Contacts</option>
          <option value="sponsor">Sponsors</option>
          <option value="vendor">Vendors</option>
          <option value="organizer">Organizers</option>
          <option value="attendee">Attendees</option>
        </Select>
      </div>

      {/* Contacts Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Health Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts?.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contact.contact_type === "sponsor"
                        ? "bg-blue-100 text-blue-800"
                        : contact.contact_type === "vendor"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {contact.contact_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{contact.company || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${contact.health_score}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{contact.health_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.last_contacted_at
                      ? new Date(contact.last_contacted_at).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
```

---

## 8. WhatsApp Automation

### 8.1 WhatsApp Client Setup

```typescript
// src/lib/whatsapp.ts
const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

export interface WhatsAppMessage {
  to: string; // Phone number in E.164 format (e.g., +1234567890)
  message: string;
  type?: "text" | "template";
}

export async function sendWhatsAppMessage({ to, message, type = "text" }: WhatsAppMessage) {
  const response = await fetch(
    `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/[^0-9]/g, ""), // Remove non-numeric characters
        type: type,
        text: type === "text" ? { body: message } : undefined,
        template: type === "template" ? { name: message } : undefined
      })
    }
  );

  if (!response.ok) {
    throw new Error(`WhatsApp API error: ${response.statusText}`);
  }

  return response.json();
}
```

### 8.2 WhatsApp Notification Templates

```typescript
// src/lib/whatsapp-templates.ts
export const WhatsAppTemplates = {
  TICKET_CONFIRMATION: (eventName: string, ticketNumber: string) => `
🎟️ *Ticket Confirmed!*

Your tickets for *${eventName}* have been confirmed!

Ticket #: ${ticketNumber}

Check your email for QR codes and event details.

Reply HELP for assistance.
  `.trim(),

  EVENT_REMINDER: (eventName: string, date: string, location: string) => `
📅 *Event Reminder*

*${eventName}* is coming up soon!

📆 Date: ${date}
📍 Location: ${location}

Don't forget to bring your QR code!

Reply with VENUE for directions.
  `.trim(),

  SPONSOR_LEAD: (contactName: string, eventName: string) => `
💼 *New Sponsor Lead*

${contactName} has expressed interest in sponsoring *${eventName}*.

Action required:
- Review sponsor package
- Schedule discovery call
- Send proposal

View in CRM: /crm/contacts
  `.trim(),

  VENUE_BOOKING_CONFIRMED: (venueName: string, date: string) => `
✅ *Venue Booking Confirmed*

${venueName} is now booked for ${date}!

Next steps:
1. Review contract
2. Pay deposit
3. Coordinate setup

View details: /venues/bookings
  `.trim()
};
```

### 8.3 WhatsApp Integration Component

```typescript
// src/components/whatsapp/WhatsAppDashboard.tsx
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Clock, CheckCheck } from "lucide-react";

export function WhatsAppDashboard() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const { data: conversations } = useQuery({
    queryKey: ["whatsapp-conversations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("whatsapp_messages")
        .select(`
          *,
          contact:crm_contacts (*)
        `)
        .order("created_at", { ascending: false })
        .limit(50);
      return data;
    }
  });

  const sendMessage = useMutation({
    mutationFn: async ({ to, message }: { to: string; message: string }) => {
      // Send via WhatsApp API
      await sendWhatsAppMessage({ to, message });

      // Log in database
      await supabase.from("whatsapp_messages").insert({
        to_phone: to,
        message,
        direction: "outbound",
        status: "sent"
      });
    },
    onSuccess: () => {
      setMessage("");
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">WhatsApp Automation</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Conversation List */}
        <Card className="col-span-1 p-4 h-[600px] overflow-y-auto">
          <h2 className="font-semibold mb-4">Conversations</h2>
          <div className="space-y-2">
            {conversations?.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedContact === conv.contact.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedContact(conv.contact.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{conv.contact.name}</span>
                  {conv.status === "sent" && <CheckCheck className="h-4 w-4 text-blue-600" />}
                  {conv.status === "pending" && <Clock className="h-4 w-4 text-gray-400" />}
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.message}</p>
                <span className="text-xs text-gray-400">
                  {new Date(conv.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="col-span-2 p-4 flex flex-col h-[600px]">
          {selectedContact ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {conversations
                  ?.filter((c) => c.contact.id === selectedContact)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.direction === "outbound" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.direction === "outbound"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <span className="text-xs opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const contact = conversations?.find(
                        (c) => c.contact.id === selectedContact
                      )?.contact;
                      if (contact?.phone) {
                        sendMessage.mutate({ to: contact.phone, message });
                      }
                    }
                  }}
                  className="flex-1"
                  rows={3}
                />
                <Button
                  onClick={() => {
                    const contact = conversations?.find(
                      (c) => c.contact.id === selectedContact
                    )?.contact;
                    if (contact?.phone) {
                      sendMessage.mutate({ to: contact.phone, message });
                    }
                  }}
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
```

### 8.4 WhatsApp Database Tables

```sql
-- Add to database migration

CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  contact_id UUID REFERENCES crm_contacts(id),

  to_phone TEXT NOT NULL,
  from_phone TEXT,

  message TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'template', 'media')),

  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'sent', 'delivered', 'read', 'failed')
  ),

  whatsapp_message_id TEXT UNIQUE,
  error_message TEXT,

  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_messages_organizer ON whatsapp_messages(organizer_id);
CREATE INDEX idx_whatsapp_messages_contact ON whatsapp_messages(contact_id);
CREATE INDEX idx_whatsapp_messages_phone ON whatsapp_messages(to_phone);
CREATE INDEX idx_whatsapp_messages_created ON whatsapp_messages(created_at);

-- WhatsApp Templates
CREATE TABLE whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id),

  name TEXT NOT NULL,
  template_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (
    category IN ('marketing', 'transactional', 'otp', 'reminder')
  ),

  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',

  approved BOOLEAN DEFAULT false,
  whatsapp_template_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_templates_organizer ON whatsapp_templates(organizer_id);
```

---

## 9. Marketing Campaigns

### 9.1 Campaign Database Schema

```sql
-- Add to database migration

CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  campaign_type TEXT NOT NULL CHECK (
    campaign_type IN ('email', 'whatsapp', 'social', 'multi-channel')
  ),

  status TEXT DEFAULT 'draft' CHECK (
    status IN ('draft', 'scheduled', 'active', 'paused', 'completed')
  ),

  -- Targeting
  target_audience TEXT NOT NULL CHECK (
    target_audience IN ('all_contacts', 'past_attendees', 'sponsors', 'custom')
  ),
  target_segment_filter JSONB DEFAULT '{}',

  -- Content
  subject TEXT,
  message_content TEXT NOT NULL,
  call_to_action TEXT,
  cta_url TEXT,

  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  -- Analytics
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketing_campaigns_organizer ON marketing_campaigns(organizer_id);
CREATE INDEX idx_marketing_campaigns_event ON marketing_campaigns(event_id);
CREATE INDEX idx_marketing_campaigns_status ON marketing_campaigns(status);

-- Campaign Recipients
CREATE TABLE campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,

  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed')
  ),

  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_contact ON campaign_recipients(contact_id);
```

### 9.2 Campaign Builder Component

```typescript
// src/components/marketing/CampaignBuilder.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Mail, MessageCircle, Share2, Send } from "lucide-react";

export function CampaignBuilder() {
  const [campaign, setCampaign] = useState({
    name: "",
    campaign_type: "email",
    target_audience: "all_contacts",
    subject: "",
    message_content: "",
    call_to_action: "",
    cta_url: "",
    scheduled_at: null
  });

  const createCampaign = useMutation({
    mutationFn: async (data: typeof campaign) => {
      const user = (await supabase.auth.getUser()).data.user!;

      // Create campaign
      const { data: newCampaign, error } = await supabase
        .from("marketing_campaigns")
        .insert({
          ...data,
          organizer_id: user.id,
          status: data.scheduled_at ? "scheduled" : "draft"
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch target contacts
      let contactsQuery = supabase
        .from("crm_contacts")
        .select("id")
        .eq("organizer_id", user.id)
        .eq("status", "active");

      if (data.target_audience === "past_attendees") {
        contactsQuery = contactsQuery.eq("contact_type", "attendee");
      } else if (data.target_audience === "sponsors") {
        contactsQuery = contactsQuery.eq("contact_type", "sponsor");
      }

      const { data: contacts } = await contactsQuery;

      if (contacts && contacts.length > 0) {
        // Create recipient records
        const recipients = contacts.map((contact) => ({
          campaign_id: newCampaign.id,
          contact_id: contact.id
        }));

        await supabase.from("campaign_recipients").insert(recipients);

        // Update total_recipients count
        await supabase
          .from("marketing_campaigns")
          .update({ total_recipients: contacts.length })
          .eq("id", newCampaign.id);
      }

      return newCampaign;
    },
    onSuccess: () => {
      // Reset form or navigate to campaigns list
      alert("Campaign created successfully!");
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Marketing Campaign</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Name</label>
                <Input
                  placeholder="e.g., Summer Event Promotion"
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Channel</label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={campaign.campaign_type === "email" ? "default" : "outline"}
                    onClick={() => setCampaign({ ...campaign, campaign_type: "email" })}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant={campaign.campaign_type === "whatsapp" ? "default" : "outline"}
                    onClick={() => setCampaign({ ...campaign, campaign_type: "whatsapp" })}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant={campaign.campaign_type === "social" ? "default" : "outline"}
                    onClick={() => setCampaign({ ...campaign, campaign_type: "social" })}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Social
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <Select
                  value={campaign.target_audience}
                  onValueChange={(value) =>
                    setCampaign({ ...campaign, target_audience: value })
                  }
                >
                  <option value="all_contacts">All Contacts</option>
                  <option value="past_attendees">Past Attendees</option>
                  <option value="sponsors">Sponsors</option>
                  <option value="custom">Custom Segment</option>
                </Select>
              </div>

              {campaign.campaign_type === "email" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Subject Line</label>
                  <Input
                    placeholder="e.g., You're Invited to Our Summer Gala"
                    value={campaign.subject}
                    onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Write your campaign message..."
                  value={campaign.message_content}
                  onChange={(e) =>
                    setCampaign({ ...campaign, message_content: e.target.value })
                  }
                  rows={8}
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can use variables: {{name}}, {{event_name}}, {{event_date}}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Call to Action</label>
                  <Input
                    placeholder="e.g., Buy Tickets Now"
                    value={campaign.call_to_action}
                    onChange={(e) =>
                      setCampaign({ ...campaign, call_to_action: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CTA URL</label>
                  <Input
                    placeholder="https://..."
                    value={campaign.cta_url}
                    onChange={(e) => setCampaign({ ...campaign, cta_url: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">AI Content Generator</h2>
            <p className="text-gray-600 mb-4">
              Use AI to generate compelling campaign content based on your event details.
            </p>
            <Button variant="outline">
              Generate with AI
            </Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Schedule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Send Time</label>
                <Select
                  value={campaign.scheduled_at ? "scheduled" : "now"}
                  onValueChange={(value) => {
                    if (value === "now") {
                      setCampaign({ ...campaign, scheduled_at: null });
                    }
                  }}
                >
                  <option value="now">Send Now</option>
                  <option value="scheduled">Schedule for Later</option>
                </Select>
              </div>

              {campaign.scheduled_at && (
                <div>
                  <Calendar
                    mode="single"
                    selected={campaign.scheduled_at}
                    onSelect={(date) => setCampaign({ ...campaign, scheduled_at: date })}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">To: {campaign.target_audience}</p>
              {campaign.subject && (
                <p className="font-semibold mb-2">{campaign.subject}</p>
              )}
              <p className="text-sm whitespace-pre-wrap">
                {campaign.message_content || "Your message will appear here..."}
              </p>
              {campaign.call_to_action && (
                <Button className="mt-4 w-full">{campaign.call_to_action}</Button>
              )}
            </div>
          </Card>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => createCampaign.mutate(campaign)}
              disabled={!campaign.name || !campaign.message_content}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {campaign.scheduled_at ? "Schedule Campaign" : "Send Now"}
            </Button>
            <Button variant="outline" className="w-full">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 10. Venue Database

### 10.1 Venue Database Schema

```sql
-- Add to database migration

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Location
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'USA',
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Capacity & Pricing
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  standing_capacity INTEGER,
  seated_capacity INTEGER,

  price_per_day NUMERIC(10, 2) CHECK (price_per_day >= 0),
  price_per_hour NUMERIC(10, 2) CHECK (price_per_hour >= 0),
  minimum_booking_hours INTEGER DEFAULT 4,

  -- Amenities
  amenities TEXT[] DEFAULT '{}',
  -- Example: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Stage']

  venue_type TEXT NOT NULL CHECK (
    venue_type IN ('conference_center', 'hotel', 'outdoor', 'restaurant', 'theater', 'warehouse', 'other')
  ),

  -- Media
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  virtual_tour_url TEXT,

  -- Contact
  contact_name TEXT,
  contact_email TEXT CHECK (contact_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  contact_phone TEXT,
  website_url TEXT,

  -- Status
  is_available BOOLEAN DEFAULT true,
  requires_deposit BOOLEAN DEFAULT true,
  deposit_percentage INTEGER DEFAULT 50,

  -- Ratings
  rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_bookings INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_capacity ON venues(capacity);
CREATE INDEX idx_venues_type ON venues(venue_type);
CREATE INDEX idx_venues_available ON venues(is_available) WHERE is_available = true;

-- Venue Bookings
CREATE TABLE venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES auth.users(id),

  -- Booking Details
  booking_date TIMESTAMPTZ NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  setup_time_hours INTEGER DEFAULT 2,
  teardown_time_hours INTEGER DEFAULT 1,

  -- Pricing
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
  deposit_paid NUMERIC(10, 2) DEFAULT 0,
  balance_due NUMERIC(10, 2) GENERATED ALWAYS AS (total_price - deposit_paid) STORED,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed')
  ),

  -- Contract
  contract_signed BOOLEAN DEFAULT false,
  contract_url TEXT,

  -- Payments
  payment_due_date TIMESTAMPTZ,

  -- Notes
  special_requirements TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_booking_time CHECK (end_time > start_time),
  CONSTRAINT valid_deposit CHECK (deposit_paid <= total_price)
);

CREATE INDEX idx_venue_bookings_venue ON venue_bookings(venue_id);
CREATE INDEX idx_venue_bookings_event ON venue_bookings(event_id);
CREATE INDEX idx_venue_bookings_organizer ON venue_bookings(organizer_id);
CREATE INDEX idx_venue_bookings_date ON venue_bookings(booking_date);
CREATE INDEX idx_venue_bookings_status ON venue_bookings(status);
```

### 10.2 Venue Search Component

```typescript
// src/components/venues/VenueSearch.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { MapPin, Users, DollarSign, Star, Calendar } from "lucide-react";

export function VenueSearch() {
  const [filters, setFilters] = useState({
    city: "",
    min_capacity: 0,
    max_capacity: 10000,
    venue_type: "all",
    max_price: 10000
  });

  const { data: venues, isLoading } = useQuery({
    queryKey: ["venues", filters],
    queryFn: async () => {
      let query = supabase
        .from("venues")
        .select("*")
        .eq("is_available", true);

      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }

      if (filters.min_capacity > 0) {
        query = query.gte("capacity", filters.min_capacity);
      }

      if (filters.max_capacity < 10000) {
        query = query.lte("capacity", filters.max_capacity);
      }

      if (filters.venue_type !== "all") {
        query = query.eq("venue_type", filters.venue_type);
      }

      if (filters.max_price < 10000) {
        query = query.lte("price_per_day", filters.max_price);
      }

      const { data } = await query.order("rating", { ascending: false });
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find the Perfect Venue</h1>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-5 gap-4">
          <Input
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Min Capacity"
            value={filters.min_capacity}
            onChange={(e) =>
              setFilters({ ...filters, min_capacity: parseInt(e.target.value) || 0 })
            }
          />
          <Input
            type="number"
            placeholder="Max Capacity"
            value={filters.max_capacity}
            onChange={(e) =>
              setFilters({ ...filters, max_capacity: parseInt(e.target.value) || 10000 })
            }
          />
          <Select
            value={filters.venue_type}
            onValueChange={(value) => setFilters({ ...filters, venue_type: value })}
          >
            <option value="all">All Types</option>
            <option value="conference_center">Conference Center</option>
            <option value="hotel">Hotel</option>
            <option value="outdoor">Outdoor</option>
            <option value="restaurant">Restaurant</option>
            <option value="theater">Theater</option>
            <option value="warehouse">Warehouse</option>
          </Select>
          <Input
            type="number"
            placeholder="Max Price/Day"
            value={filters.max_price}
            onChange={(e) =>
              setFilters({ ...filters, max_price: parseInt(e.target.value) || 10000 })
            }
          />
        </div>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div>Loading venues...</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {venues?.map((venue) => (
            <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={venue.images?.[0] || "/placeholder-venue.jpg"}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{venue.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{venue.name}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{venue.city}, {venue.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>${venue.price_per_day}/day</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.amenities.slice(0, 3).map((amenity: string) => (
                    <span
                      key={amenity}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {venue.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{venue.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {venues && venues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No venues found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilters({
            city: "",
            min_capacity: 0,
            max_capacity: 10000,
            venue_type: "all",
            max_price: 10000
          })}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
```

---

## 11. Organizer Dashboard

### 11.1 Dashboard Overview

```typescript
// src/pages/DashboardPage.tsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, TrendingUp, Plus } from "lucide-react";

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user!;

      // Total events
      const { count: totalEvents } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", user.id);

      // Total revenue
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount")
        .in("event_id", supabase
          .from("events")
          .select("id")
          .eq("organizer_id", user.id)
        )
        .eq("status", "completed");

      const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0;

      // Total attendees
      const { count: totalAttendees } = await supabase
        .from("attendees")
        .select("*", { count: "exact", head: true })
        .in("event_id", supabase
          .from("events")
          .select("id")
          .eq("organizer_id", user.id)
        );

      // Total contacts
      const { count: totalContacts } = await supabase
        .from("crm_contacts")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", user.id);

      return {
        totalEvents,
        totalRevenue,
        totalAttendees,
        totalContacts
      };
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Total Events</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{stats?.totalEvents || 0}</p>
          <p className="text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            12% from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Total Revenue</h3>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">${stats?.totalRevenue?.toFixed(2) || "0.00"}</p>
          <p className="text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            8% from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Total Attendees</h3>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{stats?.totalAttendees || 0}</p>
          <p className="text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            15% from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">CRM Contacts</h3>
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold">{stats?.totalContacts || 0}</p>
          <p className="text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            20% from last month
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Events</h2>
          {/* Event list component */}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Tasks</h2>
          {/* Task list component */}
        </Card>
      </div>
    </div>
  );
}
```

---

## 12. Testing & Deployment

### 12.1 Run Database Migrations

```bash
# Apply all migrations
npx supabase db push

# Verify schema
npx supabase db diff
```

### 12.2 Deploy Edge Functions

```bash
# Deploy all functions
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook
npx supabase functions deploy send-tickets
npx supabase functions deploy send-whatsapp

# Set function secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
npx supabase secrets set RESEND_API_KEY=re_...
npx supabase secrets set WHATSAPP_ACCESS_TOKEN=...
```

### 12.3 Build & Deploy Frontend

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### 12.4 Testing Checklist

- [ ] AI Wizard creates events successfully
- [ ] Ticket purchase flow works end-to-end
- [ ] Stripe webhook processes payments
- [ ] Email delivery works
- [ ] WhatsApp messages send successfully
- [ ] CRM contacts CRUD operations
- [ ] Marketing campaigns send to correct segments
- [ ] Venue search returns relevant results
- [ ] Dashboard displays accurate stats
- [ ] RLS policies enforce security

---

## ✅ Implementation Complete

**Total Implementation Time:** 6-8 weeks
**Features Implemented:** 10 core feature areas
**Database Tables:** 5 core + 7 business features = 12 total
**Edge Functions:** 4 functions
**Components:** 20+ React components

**Next Steps:**
1. Deploy to production
2. Set up monitoring (Sentry, LogRocket)
3. Launch beta with 10-20 organizers
4. Gather feedback
5. Iterate based on usage data

---

**Status:** ✅ Implementation Guide Complete
**Ready for:** Full development execution
