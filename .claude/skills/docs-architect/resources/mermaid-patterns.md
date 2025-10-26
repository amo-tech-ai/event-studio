# Mermaid Diagram Patterns

Quick reference for common diagram types used in EventOS documentation.

---

## Sequence Diagrams (User Flows)

### Basic Pattern
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database

    User->>Frontend: Click Button
    Frontend->>API: POST /endpoint
    API->>Database: Query
    Database->>API: Result
    API->>Frontend: JSON Response
    Frontend->>User: Update UI
```

### With Alternative Paths
```mermaid
sequenceDiagram
    participant User
    participant App
    participant Auth

    User->>App: Login
    App->>Auth: Verify Credentials

    alt Success
        Auth->>App: Token
        App->>User: Dashboard
    else Failure
        Auth->>App: Error
        App->>User: Error Message
    end
```

### With Parallel Operations
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB1
    participant DB2

    Client->>API: Request

    par Fetch Data
        API->>DB1: Query 1
        DB1->>API: Result 1
    and
        API->>DB2: Query 2
        DB2->>API: Result 2
    end

    API->>Client: Combined Results
```

---

## Architecture Diagrams (System Structure)

### Layered Architecture
```mermaid
graph TB
    subgraph "Client Layer"
        A[React App]
        B[State Management]
    end

    subgraph "API Layer"
        C[Supabase Client]
        D[RLS Policies]
    end

    subgraph "Data Layer"
        E[PostgreSQL]
        F[Storage]
    end

    A --> C
    B --> C
    C --> E
    C --> F
```

### Microservices Architecture
```mermaid
graph LR
    A[Client] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[Event Service]
    B --> E[Payment Service]

    C --> F[(User DB)]
    D --> G[(Event DB)]
    E --> H[(Payment DB)]

    E --> I[Stripe API]
```

---

## Entity Relationship Diagrams (Database)

### Basic ERD
```mermaid
erDiagram
    USERS ||--o{ EVENTS : creates
    EVENTS ||--o{ TICKETS : has
    USERS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_ITEMS : contains
    TICKETS ||--o{ ORDER_ITEMS : references

    USERS {
        uuid id PK
        string email
        string name
        timestamp created_at
    }

    EVENTS {
        uuid id PK
        uuid organizer_id FK
        string title
        timestamp start_at
    }
```

---

## Flow Charts (Process Logic)

### Decision Tree
```mermaid
flowchart TD
    A[Start] --> B{Authenticated?}
    B -->|Yes| C[Load Dashboard]
    B -->|No| D[Show Login]
    D --> E[Submit Credentials]
    E --> F{Valid?}
    F -->|Yes| C
    F -->|No| D
    C --> G[End]
```

### Process Flow
```mermaid
flowchart LR
    A[Create Event] --> B[Add Details]
    B --> C[Select Venue]
    C --> D[Set Pricing]
    D --> E[Review]
    E --> F{Approve?}
    F -->|Yes| G[Publish]
    F -->|No| B
    G --> H[Complete]
```

---

## State Diagrams (State Machines)

### Order State Machine
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: Submit
    Pending --> Confirmed: Payment Success
    Pending --> Failed: Payment Failed
    Confirmed --> Completed: Event Finished
    Failed --> Pending: Retry Payment
    Confirmed --> Refunded: Cancel Order
    Completed --> [*]
    Refunded --> [*]
```

---

## Timeline Diagrams (Project Phases)

### Gantt Chart
```mermaid
gantt
    title MVP Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Database Setup          :2025-01-01, 3d
    Auth Implementation     :2025-01-04, 5d
    section Phase 2
    Event Wizard            :2025-01-09, 7d
    Dashboard               :2025-01-16, 5d
    section Phase 3
    Booking System          :2025-01-21, 7d
    Testing                 :2025-01-28, 5d
```

---

## Class Diagrams (Code Structure)

### Component Hierarchy
```mermaid
classDiagram
    class BaseComponent {
        +props: Props
        +state: State
        +render()
    }

    class DashboardPage {
        +useEvents()
        +handleCreate()
    }

    class EventCard {
        +event: Event
        +onClick()
    }

    BaseComponent <|-- DashboardPage
    BaseComponent <|-- EventCard
    DashboardPage --> EventCard : contains
```

---

## Best Practices

### Clarity
- **Limit nodes**: 5-7 per diagram (split complex flows)
- **Clear labels**: Use descriptive names, avoid abbreviations
- **Legend**: Add legend for colors/shapes if needed

### Layout
- **Direction**: Left-to-right (LR) for processes, Top-to-bottom (TB) for hierarchies
- **Grouping**: Use subgraphs for related components
- **Spacing**: Don't overcrowd, break into multiple diagrams if needed

### Consistency
- **Naming**: Use consistent names across all diagrams
- **Colors**: Use same colors for similar types (e.g., databases always green)
- **Styles**: Keep diagram styles consistent within same doc

---

## EventOS Diagram Standards

### Colors
- **Frontend**: Blue (#3B82F6)
- **Backend**: Green (#10B981)
- **Database**: Purple (#8B5CF6)
- **External**: Orange (#F59E0B)

### Actors
- **User**: person icon
- **System**: box
- **Database**: cylinder
- **External Service**: cloud shape

### Arrows
- **Synchronous**: solid line (-->)
- **Asynchronous**: dashed line (--)
- **Data flow**: thick arrow (==>)
- **Inheritance**: dotted arrow (.->)

---

**Quick Reference**:
```markdown
# Most common diagrams in EventOS docs
1. Sequence: User flows, API interactions
2. Architecture: System components, layers
3. ERD: Database relationships
4. Flowchart: Decision logic, processes
```
