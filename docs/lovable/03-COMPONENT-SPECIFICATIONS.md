# 🧩 Component Specifications - EventOS AI Event Wizard

## 🗓️ Date: 2025-01-18
## 📍 Location: `/home/sk/event-studio/copilotkit-langgraph/copilotkit-docs/lovable/`

---

## 🎯 **Component Design Specifications**

### **1. AI Chat Interface Components**

#### **ChatMessageBubble Component**
```typescript
interface ChatMessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'processing';
  quickActions?: QuickAction[];
}

// Visual Design:
// - User messages: Right-aligned, primary background
// - AI messages: Left-aligned, subtle background with AI avatar
// - Typing indicator: Animated dots with AI avatar
// - Quick actions: Inline buttons below messages
// - Status indicators: Small icons for message status
```

#### **AIAgentStatus Component**
```typescript
interface AIAgentStatusProps {
  status: 'idle' | 'thinking' | 'processing' | 'error';
  agentName: string;
  progress?: number;
  errorMessage?: string;
}

// Visual Design:
// - Active: Green pulsing dot with "AI is thinking..."
// - Processing: Spinning loader with progress percentage
// - Idle: Gray dot with "AI is ready"
// - Error: Red dot with retry option
// - Multi-Agent: Multiple status indicators
```

#### **SmartInput Component**
```typescript
interface SmartInputProps {
  placeholder: string;
  suggestions: string[];
  onSend: (message: string) => void;
  onVoiceInput: () => void;
  onFileUpload: (file: File) => void;
}

// Visual Design:
// - Auto-expanding textarea with smart suggestions
// - Voice input button with microphone icon
// - Quick prompt chips above input
// - File upload drag-and-drop area
// - Emoji picker button
```

### **2. Event Summary Components**

#### **EventPreviewCard Component**
```typescript
interface EventPreviewCardProps {
  event: {
    title: string;
    date: Date;
    location: string;
    status: 'draft' | 'published' | 'live';
    progress: number;
  };
  onEdit: () => void;
  onPreview: () => void;
  onShare: () => void;
}

// Visual Design:
// - Large, prominent event title
// - Clear date/time display with timezone
// - Venue name with address and map link
// - Status badge with appropriate colors
// - Progress bar showing completion percentage
// - Quick action buttons (Edit, Preview, Share)
```

#### **FormIntegrationCard Component**
```typescript
interface FormIntegrationCardProps {
  fields: FormField[];
  onFieldUpdate: (field: string, value: any) => void;
  validationStatus: ValidationStatus;
}

// Visual Design:
// - Real-time form field updates from chat
// - Green checkmarks for completed fields
// - Red indicators for missing required fields
// - Smart suggestions for field completion
// - Auto-save indicators and timestamps
```

### **3. Venue Selection Components**

#### **VenueResearchCard Component**
```typescript
interface VenueResearchCardProps {
  searchCriteria: {
    location: string;
    capacity: number;
    budget: number;
    amenities: string[];
  };
  onSearch: (criteria: SearchCriteria) => void;
  aiInsights: AIInsight[];
}

// Visual Design:
// - Search filters with location, capacity, budget
// - AI insights panel with smart recommendations
// - Market analysis with pricing trends
// - Quick action buttons for search and filter
// - Results count display
```

#### **VenueComparisonCard Component**
```typescript
interface VenueComparisonCardProps {
  venue: {
    name: string;
    photos: string[];
    capacity: number;
    pricing: PricingInfo;
    amenities: string[];
    availability: AvailabilityInfo;
    aiInsights: AIInsight[];
  };
  onSelect: () => void;
  onCompare: () => void;
  onSave: () => void;
}

// Visual Design:
// - High-quality venue photos in carousel
// - Clear capacity and layout details
// - Transparent pricing with breakdown
// - Visual amenity icons and descriptions
// - Real-time availability calendar
// - AI insights and recommendations
```

### **4. Ticketing Components**

#### **PricingRecommendationCard Component**
```typescript
interface PricingRecommendationCardProps {
  recommendations: PricingRecommendation[];
  marketAnalysis: MarketAnalysis;
  revenueProjections: RevenueProjection[];
}

// Visual Design:
// - Market analysis with competitor pricing
// - AI pricing suggestions with reasoning
// - Revenue projections with charts
// - Attendee predictions with confidence levels
// - Pricing validation with real-time feedback
```

#### **TicketTierBuilder Component**
```typescript
interface TicketTierBuilderProps {
  tiers: TicketTier[];
  onTierAdd: (tier: TicketTier) => void;
  onTierUpdate: (id: string, tier: TicketTier) => void;
  onTierRemove: (id: string) => void;
  validation: ValidationStatus;
}

// Visual Design:
// - Dynamic form for creating ticket tiers
// - Real-time price calculations
// - Early bird and group discount setup
// - Quantity limits and availability
// - Real-time form validation feedback
```

### **5. Agenda Builder Components**

#### **AIAgendaGenerator Component**
```typescript
interface AIAgendaGeneratorProps {
  eventDetails: EventDetails;
  onGenerate: () => void;
  suggestions: AgendaSuggestion[];
  onSuggestionSelect: (suggestion: AgendaSuggestion) => void;
}

// Visual Design:
// - Smart session suggestions with AI reasoning
// - Speaker matching with expertise indicators
// - Time optimization with conflict detection
// - Approval workflow with human oversight
// - Visual timeline with drag-and-drop
```

#### **InteractiveTimeline Component**
```typescript
interface InteractiveTimelineProps {
  sessions: Session[];
  onSessionMove: (sessionId: string, newTime: Date) => void;
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
  conflicts: Conflict[];
}

// Visual Design:
// - Drag-and-drop session management
// - Real-time conflict detection with alerts
// - Speaker assignment with availability
// - Room management with capacity
// - Break scheduling with optimization
```

### **6. Marketing Components**

#### **ContentGenerator Component**
```typescript
interface ContentGeneratorProps {
  eventDetails: EventDetails;
  onGenerate: (type: ContentType) => void;
  generatedContent: GeneratedContent[];
  onContentUpdate: (id: string, content: string) => void;
}

// Visual Design:
// - AI-powered content generation tools
// - Social media post templates
// - Email campaign builders
// - Landing page content generators
// - Hashtag suggestion engine
```

#### **CampaignManager Component**
```typescript
interface CampaignManagerProps {
  campaigns: Campaign[];
  onCampaignCreate: (campaign: Campaign) => void;
  onCampaignUpdate: (id: string, updates: Partial<Campaign>) => void;
  performance: PerformanceMetrics;
}

// Visual Design:
// - Multi-channel campaign setup
// - Visual content scheduling calendar
// - Real-time performance tracking
// - A/B testing interface
// - Audience targeting tools
```

---

## 🎨 **Visual Design Specifications**

### **Color System**
```css
/* Primary Colors */
--primary: #3b82f6;           /* EventOS Blue */
--primary-dark: #1e40af;      /* Darker Blue */
--primary-light: #93c5fd;    /* Lighter Blue */

/* AI Accent Colors */
--ai-accent: #10b981;         /* AI Green */
--ai-accent-dark: #059669;    /* Darker Green */
--ai-accent-light: #6ee7b7;  /* Lighter Green */

/* Status Colors */
--success: #22c55e;           /* Success Green */
--warning: #f59e0b;           /* Warning Orange */
--error: #ef4444;             /* Error Red */
--info: #3b82f6;              /* Info Blue */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### **Typography Scale**
```css
/* Headings */
--text-4xl: 2.25rem;    /* 36px - Page titles */
--text-3xl: 1.875rem;   /* 30px - Section titles */
--text-2xl: 1.5rem;     /* 24px - Card titles */
--text-xl: 1.25rem;     /* 20px - Subsection titles */
--text-lg: 1.125rem;    /* 18px - Large body text */

/* Body Text */
--text-base: 1rem;      /* 16px - Default body text */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-xs: 0.75rem;     /* 12px - Captions */

/* AI Text */
--text-ai: 0.95rem;     /* Slightly smaller for AI responses */
--font-ai: 'Inter', sans-serif; /* AI-specific font */
```

### **Spacing System**
```css
/* 8px Grid System */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
```

### **Shadow System**
```css
/* Elevation Levels */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* AI Element Glows */
--glow-ai: 0 0 20px rgb(16 185 129 / 0.3);
--glow-processing: 0 0 20px rgb(59 130 246 / 0.3);
--glow-error: 0 0 20px rgb(239 68 68 / 0.3);
```

---

## 📱 **Responsive Design Specifications**

### **Breakpoints**
```css
/* Mobile First Approach */
--mobile: 640px;        /* < 640px */
--tablet: 768px;        /* 640px - 1024px */
--desktop: 1024px;      /* > 1024px */
--wide: 1280px;         /* > 1280px */
```

### **Grid Systems**
```css
/* Mobile Grid */
.mobile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
}

/* Tablet Grid */
.tablet-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  padding: var(--space-6);
}

/* Desktop Grid */
.desktop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  padding: var(--space-8);
}
```

### **Component Responsive Behavior**
```css
/* Chat Panel Responsive */
.chat-panel {
  /* Mobile: Full width, bottom position */
  @media (max-width: 639px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50vh;
  }
  
  /* Tablet: Side panel */
  @media (min-width: 640px) and (max-width: 1023px) {
    width: 60%;
    float: left;
  }
  
  /* Desktop: Left column */
  @media (min-width: 1024px) {
    width: 60%;
    float: left;
  }
}

/* Event Summary Panel Responsive */
.event-summary-panel {
  /* Mobile: Hidden by default, slide up on tap */
  @media (max-width: 639px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50vh;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  
  /* Tablet: Right panel */
  @media (min-width: 640px) and (max-width: 1023px) {
    width: 40%;
    float: right;
  }
  
  /* Desktop: Right column */
  @media (min-width: 1024px) {
    width: 40%;
    float: right;
  }
}
```

---

## 🎯 **Component States & Interactions**

### **Button States**
```css
/* Primary Button */
.btn-primary {
  background: var(--primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  transform: none;
}
```

### **Card States**
```css
/* Interactive Card */
.card-interactive {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  padding: var(--space-6);
  transition: all 0.2s ease;
  cursor: pointer;
}

.card-interactive:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-interactive:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

.card-interactive.selected {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: var(--shadow-lg);
}
```

### **AI Element States**
```css
/* AI Processing State */
.ai-processing {
  position: relative;
  overflow: hidden;
}

.ai-processing::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent);
  animation: ai-processing 2s infinite;
}

@keyframes ai-processing {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* AI Success State */
.ai-success {
  border-color: var(--success);
  box-shadow: var(--glow-ai);
  animation: ai-success 0.5s ease;
}

@keyframes ai-success {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* AI Error State */
.ai-error {
  border-color: var(--error);
  box-shadow: var(--glow-error);
  animation: ai-error 0.5s ease;
}

@keyframes ai-error {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
```

---

## 🧪 **Testing Specifications**

### **Visual Regression Testing**
```css
/* Component Test Classes */
.test-chat-message {
  /* Test chat message rendering */
}

.test-venue-card {
  /* Test venue card layout */
}

.test-ticket-builder {
  /* Test ticket builder form */
}

.test-agenda-timeline {
  /* Test agenda timeline interaction */
}

.test-marketing-dashboard {
  /* Test marketing dashboard layout */
}
```

### **Accessibility Testing**
```css
/* Focus States */
.focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid;
  }
  
  .button {
    border: 2px solid;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 **Design System Integration**

### **shadcn/ui Component Overrides**
```css
/* Button Component Overrides */
.btn {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background;
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.btn-ai {
  @apply bg-ai-accent text-white hover:bg-ai-accent/90;
}

/* Card Component Overrides */
.card {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}

.card-ai {
  @apply border-ai-accent/20 bg-ai-accent/5;
}

.card-interactive {
  @apply cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1;
}
```

### **Custom AI Components**
```css
/* AI Chat Bubble */
.ai-chat-bubble {
  @apply max-w-xs rounded-lg px-4 py-2 text-sm;
}

.ai-chat-bubble.user {
  @apply bg-primary text-primary-foreground ml-auto;
}

.ai-chat-bubble.ai {
  @apply bg-gray-100 text-gray-900 mr-auto;
}

/* AI Status Indicator */
.ai-status {
  @apply inline-flex items-center gap-2 text-sm;
}

.ai-status.processing {
  @apply text-ai-accent;
}

.ai-status.error {
  @apply text-error;
}

.ai-status.success {
  @apply text-success;
}
```

---

**🧩 These component specifications provide Lovable with detailed design requirements for creating beautiful, functional UI components that integrate seamlessly with the EventOS AI Event Wizard while maintaining consistency with the existing design system.**
