# 📦 Component Reference Guide

**Quick reference for all MVP components mapped to database tables**

---

## 🗂️ Component Organization

```
/components
├── auth/              # Authentication (users table)
├── organizer/         # Organizer profile (organizers table)
├── attendees/         # Attendee management (attendees table)
├── crm/              # CRM features (contacts, companies, interactions, notes)
├── events/           # Event management (events, event_sessions, event_settings)
├── venues/           # Venue management (venues table)
├── tickets/          # Ticket management (ticket_tiers table)
├── orders/           # Order management (orders, order_items tables)
├── checkout/         # Checkout flow (orders, attendees)
├── marketing/        # Marketing (promo_codes table)
├── forms/            # Custom forms (questions, question_answers)
├── refunds/          # Refund management (order_refunds table)
├── payments/         # Payment tracking (payments table)
├── budget/           # Budget tracking (budgets table)
├── tasks/            # Task management (tasks table)
├── vendors/          # Vendor management (vendors, event_vendors)
├── email/            # Email templates (email_templates table)
├── settings/         # Settings (taxes_and_fees, event_settings)
└── ui/               # Base UI components (shadcn/ui)
```

---

## 🎯 Components by Database Table

### **users** → `/components/auth/`
```tsx
<LoginForm />              // Email/password login
<SignupForm />             // User registration
<ProfileSettings />        // Profile management
<PasswordReset />          // Reset password flow
<EmailVerification />      // Verify email
```

### **organizers** → `/components/organizer/`
```tsx
<OrganizerProfileForm />   // Organization details
<StripeConnectButton />    // Payment setup
<VerificationBadge />      // Verification status
<OnboardingWizard />       // First-time setup
```

### **attendees** → `/components/attendees/`
```tsx
<AttendeeList />           // Searchable attendee table
<AttendeeDetails />        // Individual attendee view
<AttendeeCard />           // Attendee info card
<AttendeeFilters />        // Filter controls
<AttendeeExport />         // CSV export button
```

### **contacts** → `/components/crm/`
```tsx
<ContactList />            // Contact table
<ContactCard />            // Contact info card
<ContactForm />            // Add/edit contact
<ContactTimeline />        // Activity feed
<ContactStats />           // Engagement metrics
<ContactTagsInput />       // Tag management
<ContactSearch />          // Full-text search
```

### **companies** → `/components/crm/`
```tsx
<CompanyList />            // Company table
<CompanyCard />            // Company info card
<CompanyForm />            // Add/edit company
<CompanyContacts />        // Associated contacts
<CompanyStats />           // Revenue & engagement
```

### **interactions** → `/components/crm/`
```tsx
<InteractionsList />       // Activity feed
<AddInteractionModal />    // Log new interaction
<InteractionCard />        // Single interaction view
<InteractionFilters />     // Filter by type
<InteractionStats />       // Engagement metrics
```

### **notes** → `/components/crm/`
```tsx
<NotesList />              // Notes feed
<AddNoteButton />          // Quick note input
<NoteCard />               // Single note view
<NoteEditor />             // Markdown editor
```

### **venues** → `/components/venues/`
```tsx
<VenueList />              // Venue cards
<VenueForm />              // Add/edit venue
<VenueCard />              // Venue info card
<VenueMap />               // Location map
<AmenitiesSelector />      // Amenities picker
```

### **events** → `/components/events/`
```tsx
// Public
<EventCard />              // Event card for listings
<EventHero />              // Event header section
<EventDetails />           // Event information tabs
<EventSchedule />          // Session schedule
<EventMap />               // Venue location

// Organizer
<CreateEventWizard />      // Multi-step creation
<EventDashboard />         // Event overview
<EventForm />              // Edit event details
<EventList />              // Organizer's events
<EventStats />             // Sales metrics
<EventActions />           // Quick action menu
```

### **event_sessions** → `/components/events/`
```tsx
<SessionsList />           // Timeline of sessions
<SessionForm />            // Add/edit session
<SessionCard />            // Session details
<SessionTimeline />        // Visual schedule
<SpeakerInfo />            // Speaker details
```

### **ticket_tiers** → `/components/tickets/`
```tsx
<TicketTierList />         // List of tiers
<TicketTierForm />         // Add/edit tier
<TicketTierCard />         // Tier details
<TicketSelector />         // Public ticket picker
<QuantitySelector />       // Quantity input
<PricingDisplay />         // Price formatting
```

### **orders** → `/components/orders/`
```tsx
<OrderList />              // Orders table
<OrderDetails />           // Order breakdown
<OrderSummary />           // Order total
<OrderStatusBadge />       // Status indicator
<OrderActions />           // Refund, resend, etc.
<OrderFilters />           // Search & filter
<OrderExport />            // CSV export
```

### **order_items** → `/components/orders/`
```tsx
<OrderItemsList />         // Line items table
<OrderItemCard />          // Single item
<TicketQRCode />           // QR code display
<TicketDownload />         // Download ticket
```

### **promo_codes** → `/components/marketing/`
```tsx
// Organizer
<PromoCodeList />          // Promo codes table
<PromoCodeForm />          // Add/edit code
<PromoCodeStats />         // Usage analytics
<PromoCodeGenerator />     // Auto-generate codes

// Public
<PromoCodeInput />         // Apply promo code
<PromoCodeValidation />    // Show validation
<DiscountDisplay />        // Show savings
```

### **event_settings** → `/components/events/`
```tsx
<EventSettingsForm />      // Settings tabs
<CheckoutSettings />       // Checkout config
<EmailSettings />          // Email config
<SEOSettings />            // SEO fields
<BrandingSettings />       // Colors & images
<FeatureToggles />         // Feature switches
```

### **taxes_and_fees** → `/components/settings/`
```tsx
<TaxesAndFeesList />       // Tax rules table
<TaxFeeForm />             // Add/edit rule
<TaxFeeCard />             // Rule details
<TaxCalculator />          // Preview calculation
<RegionalRules />          // Region selector
```

### **questions** → `/components/forms/`
```tsx
<QuestionList />           // Draggable list
<QuestionForm />           // Add/edit question
<QuestionPreview />        // Live preview
<QuestionTypeSelector />   // Type picker
<OptionsBuilder />         // Options manager
```

### **question_answers** → `/components/forms/`
```tsx
<AnswersList />            // Display answers
<AnswerCard />             // Single answer
<AnswersExport />          // Export responses
<AnswersSummary />         // Aggregated stats
```

### **order_refunds** → `/components/refunds/`
```tsx
<ProcessRefundModal />     // Initiate refund
<RefundList />             // Refunds table
<RefundStatusBadge />      // Status indicator
<RefundStats />            // Total refunded
<RefundHistory />          // Refund timeline
```

### **payments** → `/components/payments/`
```tsx
<PaymentDetails />         // Payment info
<StripeSetup />            // Connect Stripe
<PaymentHistory />         // Transaction log
<PaymentStatusBadge />     // Status indicator
```

### **budgets** → `/components/budget/`
```tsx
<BudgetList />             // Budget items table
<BudgetForm />             // Add/edit item
<BudgetOverview />         // Summary cards
<BudgetChart />            // Visual breakdown
<BudgetCategorySelector /> // Category picker
```

### **tasks** → `/components/tasks/`
```tsx
<TaskBoard />              // Kanban view
<TaskList />               // Table view
<TaskForm />               // Add/edit task
<TaskCard />               // Task details
<TaskFilters />            // Filter controls
<TaskStats />              // Completion metrics
```

### **vendors** → `/components/vendors/`
```tsx
<VendorList />             // Vendor cards
<VendorForm />             // Add/edit vendor
<VendorCard />             // Vendor details
<VendorRating />           // Rating display
<ServiceCategoryBadge />   // Category tag
```

### **event_vendors** → `/components/vendors/`
```tsx
<EventVendorsList />       // Assigned vendors
<AssignVendorModal />      // Assign to event
<EventVendorCard />        // Vendor assignment
<ContractStatus />         // Status indicator
```

### **email_templates** → `/components/email/`
```tsx
<TemplateList />           // Template cards
<TemplateEditor />         // Edit template
<TemplatePreview />        // Preview email
<VariableInserter />       // Insert variables
<TestEmailButton />        // Send test
```

---

## 🎨 Shared Components

### Layout Components
```tsx
<DashboardLayout />        // Dashboard shell
<PublicLayout />           // Public pages layout
<Navbar />                 // Navigation
<Sidebar />                // Dashboard sidebar
<Footer />                 // Site footer
<Breadcrumbs />            // Navigation path
```

### Data Display
```tsx
<DataTable />              // Sortable table
<StatCard />               // Metric card
<Chart />                  // Chart wrapper
<EmptyState />             // No data state
<LoadingState />           // Loading spinner
<ErrorState />             // Error message
```

### Forms
```tsx
<FormField />              // Form input wrapper
<RichTextEditor />         // Markdown editor
<DateTimePicker />         // Date/time input
<ImageUploader />          // Image upload
<MultiSelect />            // Multi-select dropdown
<TagInput />               // Tag entry
<ColorPicker />            // Color selector
```

### Feedback
```tsx
<Toast />                  // Toast notifications
<Modal />                  // Dialog modal
<ConfirmDialog />          // Confirmation
<Tooltip />                // Hover tooltip
<Alert />                  // Alert banner
```

---

## 🔧 Utility Hooks

### Data Fetching
```tsx
// Events
useEvents()                // List all events
useEvent(id)               // Single event
useCreateEvent()           // Create mutation
useUpdateEvent()           // Update mutation
useDeleteEvent()           // Delete mutation

// Orders
useOrders(eventId)         // Event orders
useOrder(id)               // Single order
useProcessRefund()         // Refund mutation

// Contacts
useContacts()              // CRM contacts
useContact(id)             // Single contact
useCreateContact()         // Create mutation
useUpdateContact()         // Update mutation

// Tickets
useTicketTiers(eventId)    // Event tickets
useCreateTicketTier()      // Create mutation

// Promo Codes
usePromoCodes(eventId)     // Event promo codes
useValidatePromoCode()     // Validate code
```

### Auth
```tsx
useUser()                  // Current user
useSession()               // Auth session
useOrganizer()             // Organizer profile
useSignIn()                // Login mutation
useSignUp()                // Register mutation
useSignOut()               // Logout mutation
```

### UI State
```tsx
useToast()                 // Toast notifications
useModal()                 // Modal control
useForm()                  // Form state
useDebounce()              // Debounce input
usePagination()            // Pagination state
```

---

## 📱 Page Component Mapping

### Public Pages
```tsx
// Homepage
/app/page.tsx → <HomePage />
  - <EventCard />
  - <HeroSection />

// Event Listing
/app/events/page.tsx → <EventsPage />
  - <EventCard />
  - <EventFilters />

// Event Details
/app/events/[slug]/page.tsx → <EventDetailsPage />
  - <EventHero />
  - <EventDetails />
  - <TicketSelector />

// Checkout
/app/events/[slug]/checkout/page.tsx → <CheckoutPage />
  - <TicketSummary />
  - <CheckoutForm />
  - <PromoCodeInput />
  - <StripeCheckout />

// Success
/app/success/page.tsx → <SuccessPage />
  - <OrderSummary />
  - <TicketDownload />
```

### Auth Pages
```tsx
/app/auth/login/page.tsx → <LoginPage />
  - <LoginForm />

/app/auth/signup/page.tsx → <SignupPage />
  - <SignupForm />
```

### Organizer Dashboard
```tsx
// Dashboard Home
/app/dashboard/page.tsx → <DashboardHome />
  - <StatCard />
  - <RecentOrders />
  - <QuickActions />

// Events Management
/app/dashboard/events/page.tsx → <EventsListPage />
  - <EventList />
  - <CreateEventButton />

/app/dashboard/events/new/page.tsx → <CreateEventPage />
  - <CreateEventWizard />

/app/dashboard/events/[id]/page.tsx → <EventOverviewPage />
  - <EventDashboard />
  - <EventStats />

/app/dashboard/events/[id]/edit/page.tsx → <EditEventPage />
  - <EventForm />

/app/dashboard/events/[id]/tickets/page.tsx → <TicketsPage />
  - <TicketTierList />
  - <TicketTierForm />

/app/dashboard/events/[id]/orders/page.tsx → <OrdersPage />
  - <OrderList />

/app/dashboard/events/[id]/attendees/page.tsx → <AttendeesPage />
  - <AttendeeList />

/app/dashboard/events/[id]/promo-codes/page.tsx → <PromoCodesPage />
  - <PromoCodeList />
  - <PromoCodeForm />

/app/dashboard/events/[id]/questions/page.tsx → <QuestionsPage />
  - <QuestionList />
  - <QuestionForm />

/app/dashboard/events/[id]/settings/page.tsx → <EventSettingsPage />
  - <EventSettingsForm />

// CRM
/app/dashboard/contacts/page.tsx → <ContactsPage />
  - <ContactList />

/app/dashboard/contacts/[id]/page.tsx → <ContactDetailsPage />
  - <ContactCard />
  - <ContactTimeline />

/app/dashboard/companies/page.tsx → <CompaniesPage />
  - <CompanyList />

/app/dashboard/companies/[id]/page.tsx → <CompanyDetailsPage />
  - <CompanyCard />
  - <CompanyContacts />

// Operations
/app/dashboard/venues/page.tsx → <VenuesPage />
  - <VenueList />

/app/dashboard/vendors/page.tsx → <VendorsPage />
  - <VendorList />

/app/dashboard/tasks/page.tsx → <TasksPage />
  - <TaskBoard />
  - <TaskList />

// Settings
/app/dashboard/settings/profile/page.tsx → <ProfileSettingsPage />
  - <OrganizerProfileForm />

/app/dashboard/settings/taxes/page.tsx → <TaxSettingsPage />
  - <TaxesAndFeesList />

/app/dashboard/settings/billing/page.tsx → <BillingPage />
  - <StripeSetup />
```

---

## 🎯 Component Props Examples

```tsx
// EventCard
interface EventCardProps {
  event: Event;
  onClick?: () => void;
  showOrganizer?: boolean;
  variant?: 'compact' | 'full';
}

// TicketTierForm
interface TicketTierFormProps {
  eventId: string;
  tier?: TicketTier;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// OrderList
interface OrderListProps {
  eventId?: string;
  filters?: OrderFilters;
  onRefund?: (orderId: string) => void;
}

// PromoCodeInput
interface PromoCodeInputProps {
  eventId: string;
  onApply: (code: string) => void;
  discount?: number;
}

// ContactTimeline
interface ContactTimelineProps {
  contactId: string;
  limit?: number;
  showAddButton?: boolean;
}
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-17
**Total Components:** 100+
**Component Categories:** 15
**Status:** ✅ Ready for Implementation
