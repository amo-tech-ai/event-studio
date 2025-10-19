# 03 - User Journey: Event Organizer

## 🎭 User Persona

**Sarah - Corporate Event Planner**
- Works for a mid-size tech company
- Manages 10-15 events per year
- Wants to automate repetitive tasks
- Needs professional landing pages quickly

## 🗺️ Complete User Journey

```mermaid
journey
    title Event Organizer Journey - From Login to Event Launch
    section Discovery
      Visit Platform: 5: Organizer
      View Demo/Features: 4: Organizer
    section Onboarding
      Sign Up (Email): 3: Organizer
      Complete Profile: 4: Organizer
    section Event Creation
      Start AI Chat: 5: Organizer
      Describe Event: 5: Organizer
      AI Generates Details: 5: AI Agent
      Review & Refine: 4: Organizer
      Approve Landing Page: 5: Organizer
    section Configuration
      Set Ticket Types: 4: Organizer
      Configure Pricing: 4: Organizer
      Add Branding: 5: Organizer
    section Launch
      Connect Stripe: 3: Organizer
      Preview Event: 5: Organizer
      Publish Event: 5: Organizer
      Share Link: 5: Organizer
    section Management
      Monitor Dashboard: 4: Organizer
      Track Sales: 5: Organizer
      Manage Attendees: 4: Organizer
```

## 💬 AI Conversation Flow

```mermaid
sequenceDiagram
    participant O as Organizer
    participant UI as Chat Interface
    participant EF as Edge Function
    participant AI as Lovable AI Gateway
    participant DB as Database
    
    O->>UI: "I want to create a tech conference"
    UI->>EF: POST /chat-with-ai
    EF->>DB: Fetch conversation history
    DB-->>EF: Previous messages
    EF->>AI: Send messages + tools
    AI-->>EF: Stream response with tool calls
    
    Note over AI: Structured output extraction
    AI->>AI: Extract: name, date, venue, capacity
    
    EF->>DB: Save ai_event (draft)
    EF->>DB: Generate ai_tasks
    EF-->>UI: Stream AI response
    UI-->>O: "I've created 'Tech Summit 2025'..."
    
    O->>UI: "Generate a landing page"
    UI->>EF: POST /chat-with-ai
    EF->>AI: Request with event context
    AI-->>EF: landing_page_config JSON
    EF->>DB: Update ai_events.landing_page_config
    EF-->>UI: "Landing page ready! Preview link..."
    UI-->>O: Show preview + edit options
```

## 🎯 Key Touchpoints

### 1. First Interaction (Onboarding)
```mermaid
graph LR
    A[Land on Homepage] --> B[Click 'Try AI Demo']
    B --> C[Chat: 'What event?']
    C --> D[User describes event]
    D --> E[AI generates preview]
    E --> F[Sign up to save]
```

### 2. Event Creation
```mermaid
stateDiagram-v2
    [*] --> Conversation
    Conversation --> EventDraft: AI extracts details
    EventDraft --> LandingPageDraft: AI generates config
    LandingPageDraft --> Review: Organizer reviews
    Review --> Refine: Request changes
    Refine --> LandingPageDraft
    Review --> TicketSetup: Approve
    TicketSetup --> StripeConnect: Add pricing
    StripeConnect --> Published: Activate
    Published --> [*]
```

### 3. Dashboard Management
```mermaid
graph TB
    subgraph "Real-time Dashboard"
        KPI[KPI Cards]
        Chart[Revenue Chart]
        List[Attendee List]
        Tasks[AI Task Queue]
    end
    
    subgraph "Actions"
        Email[Send Emails]
        Check[Check-in Attendees]
        Export[Export Data]
        Edit[Edit Event]
    end
    
    KPI --> Actions
    Chart --> Actions
    List --> Check
    Tasks --> Email
```

## 📋 AI Task Automation Examples

| Trigger | AI Task Generated | Status |
|---------|------------------|---------|
| Event created | Generate email welcome series | Pending |
| 7 days before | Send reminder to attendees | Scheduled |
| Day of event | Send check-in instructions | Scheduled |
| Low ticket sales | Suggest marketing tactics | Suggested |
| Venue capacity 80% | Alert organizer | Completed |

## 🎨 Landing Page Customization

```mermaid
graph LR
    A[AI Generates Base] --> B[Organizer Reviews]
    B --> C{Satisfied?}
    C -->|No| D[Chat: 'Make it more professional']
    D --> E[AI Updates Config]
    E --> B
    C -->|Yes| F[Publish]
    F --> G[Share URL]
```

## ✅ Success Metrics

- **Time to First Event**: < 10 minutes
- **AI Accuracy**: 90%+ correct extraction
- **Organizer Satisfaction**: Review/edit ratio < 3 iterations
- **Task Completion**: 80%+ automated tasks completed
