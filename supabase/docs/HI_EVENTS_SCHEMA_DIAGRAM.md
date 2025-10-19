# 🎯 Hi.Events Database Schema Diagram

## Core Architecture Overview

```mermaid
erDiagram
    %% Core Multi-tenant Architecture
    accounts ||--o{ account_users : "has users"
    accounts ||--o{ events : "owns events"
    accounts ||--o{ organizers : "has organizers"
    accounts ||--o{ account_stripe_platforms : "payment platforms"
    
    users ||--o{ account_users : "belongs to accounts"
    users ||--o{ events : "creates events"
    users ||--o{ messages : "sends messages"
    users ||--o{ roles : "has roles"
    
    %% Event Management Core
    events ||--o{ products : "has products/tickets"
    events ||--o{ orders : "receives orders"
    events ||--o{ event_settings : "has settings"
    events ||--o{ event_statistics : "tracked by stats"
    events ||--o{ questions : "has custom questions"
    events ||--o{ check_in_lists : "has check-in lists"
    events ||--o{ campaigns : "has marketing campaigns"
    events ||--o{ promo_codes : "has discount codes"
    events ||--o{ affiliates : "has affiliates"
    
    organizers ||--o{ events : "organizes events"
    organizers ||--|| organizer_settings : "has settings"
    organizers ||--o{ email_templates : "has templates"
    
    %% Product & Ticket Management
    products ||--o{ product_prices : "has price tiers"
    products ||--o{ order_items : "purchased as items"
    products ||--o{ attendees : "generates attendees"
    products ||--o{ attendee_check_ins : "checked in"
    
    product_categories ||--o{ products : "categorizes products"
    
    %% Order & Payment Flow
    orders ||--o{ order_items : "contains items"
    orders ||--o{ attendees : "generates attendees"
    orders ||--o{ stripe_payments : "processed payments"
    orders ||--o{ invoices : "generates invoices"
    orders ||--o{ order_refunds : "has refunds"
    orders ||--o{ question_answers : "has answers"
    orders ||--o{ attendee_check_ins : "check-in records"
    
    orders }o--|| promo_codes : "uses promo code"
    orders }o--|| affiliates : "attributed to affiliate"
    
    %% Payment Processing
    stripe_payments }o--|| stripe_customers : "customer payment"
    account_stripe_platforms ||--o{ stripe_payments : "platform payments"
    
    %% Check-in & Attendance
    check_in_lists ||--o{ attendee_check_ins : "manages check-ins"
    attendees ||--o{ attendee_check_ins : "checked in"
    attendees ||--o{ question_answers : "answers questions"
    
    %% Marketing & Communication
    campaigns ||--o{ messages : "sends messages"
    email_templates ||--o{ messages : "template for messages"
    
    %% Analytics & Statistics
    events ||--|| event_statistics : "aggregate stats"
    events ||--o{ event_daily_statistics : "daily breakdown"
    
    %% Questions & Forms
    questions ||--o{ question_answers : "has answers"
    questions }o--|| events : "belongs to event"
    
    %% Webhooks & Integrations
    events ||--o{ webhooks : "has webhooks"
    webhooks ||--o{ webhook_logs : "delivery logs"
    
    %% Media & Assets
    accounts ||--o{ images : "owns images"
    events }o--o{ images : "event images"
    products }o--o{ images : "product images"
    
    %% Core Entity Definitions
    accounts {
        bigint id PK
        varchar currency_code
        varchar timezone
        varchar name
        varchar email
        varchar stripe_account_id
        varchar short_id
        boolean stripe_connect_setup_complete
        timestamp account_verified_at
        boolean is_manually_verified
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    users {
        bigint id PK
        varchar email
        timestamp email_verified_at
        varchar password
        varchar remember_token
        varchar first_name
        varchar last_name
        varchar pending_email
        varchar timezone
        varchar locale
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    events {
        bigint id PK
        varchar title
        bigint account_id FK
        bigint user_id FK
        bigint organizer_id FK
        timestamp start_date
        timestamp end_date
        text description
        varchar status
        jsonb location_details
        varchar location
        varchar currency
        varchar timezone
        jsonb attributes
        varchar short_id
        integer ticket_quantity_available
        varchar category
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    products {
        bigint id PK
        varchar product_type
        varchar title
        bigint event_id FK
        bigint product_category_id FK
        timestamp sale_start_date
        timestamp sale_end_date
        integer max_per_order
        integer min_per_order
        text description
        numeric sales_volume
        numeric sales_tax_volume
        boolean hide_before_sale_start_date
        boolean hide_after_sale_end_date
        boolean hide_when_sold_out
        boolean show_quantity_remaining
        boolean is_hidden_without_promo_code
        boolean start_collapsed
        integer order
        varchar type
        boolean is_hidden
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    orders {
        bigint id PK
        varchar short_id
        bigint event_id FK
        numeric total_before_additions
        numeric total_refunded
        numeric total_gross
        varchar currency
        varchar first_name
        varchar last_name
        varchar email
        varchar status
        varchar payment_status
        varchar refund_status
        varchar payment_provider
        timestamp reserved_until
        boolean is_manually_created
        varchar session_id
        varchar public_id
        jsonb point_in_time_data
        varchar payment_gateway
        bigint promo_code_id FK
        varchar promo_code
        bigint affiliate_id FK
        jsonb address
        jsonb taxes_and_fees_rollup
        numeric total_tax
        numeric total_fee
        text notes
        timestamp statistics_decremented_at
        varchar locale
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    attendees {
        bigint id PK
        varchar short_id
        varchar first_name
        varchar last_name
        varchar email
        bigint order_id FK
        bigint product_id FK
        bigint product_price_id FK
        bigint event_id FK
        varchar public_id
        varchar status
        bigint checked_in_by FK
        timestamp checked_in_at
        bigint checked_out_by FK
        varchar locale
        text notes
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
```

## Business Flow Diagram

```mermaid
flowchart TD
    A[Account Creation] --> B[User Registration]
    B --> C[Event Creation]
    C --> D[Product/Ticket Setup]
    D --> E[Pricing Configuration]
    E --> F[Order Processing]
    F --> G[Payment Processing]
    G --> H[Attendee Generation]
    H --> I[Check-in Management]
    
    %% Marketing Flow
    C --> J[Promo Codes]
    C --> K[Affiliate Setup]
    C --> L[Email Campaigns]
    
    %% Analytics Flow
    F --> M[Event Statistics]
    G --> N[Payment Analytics]
    I --> O[Attendance Analytics]
    
    %% Communication Flow
    H --> P[Message Templates]
    P --> Q[Email Sending]
    
    %% Integration Flow
    G --> R[Webhook Triggers]
    R --> S[External Integrations]
    
    style A fill:#e1f5fe
    style F fill:#f3e5f5
    style G fill:#e8f5e8
    style I fill:#fff3e0
```

## Data Access Patterns

```mermaid
graph LR
    subgraph "Multi-tenant Isolation"
        A1[Account A] --> A2[Events A]
        A2 --> A3[Orders A]
        A3 --> A4[Attendees A]
        
        B1[Account B] --> B2[Events B]
        B2 --> B3[Orders B]
        B3 --> B4[Attendees B]
    end
    
    subgraph "Cross-tenant Shared"
        C1[Users] --> A1
        C1 --> B1
        C2[Images] --> A2
        C2 --> B2
    end
    
    style A1 fill:#ffebee
    style B1 fill:#e8f5e8
    style C1 fill:#e3f2fd
```

## Key Relationships Summary

### 1. **Multi-tenant Architecture**
- `accounts` → `events` (1:many)
- `accounts` → `account_users` (1:many)
- `users` → `account_users` (1:many)

### 2. **Event Management Flow**
- `events` → `products` → `product_prices` (1:many:many)
- `events` → `orders` → `order_items` (1:many:many)
- `orders` → `attendees` (1:many)

### 3. **Payment Processing**
- `orders` → `stripe_payments` (1:1)
- `stripe_payments` → `stripe_customers` (many:1)
- `orders` → `invoices` (1:1)

### 4. **Marketing & Analytics**
- `events` → `campaigns` → `messages` (1:many:many)
- `events` → `event_statistics` (1:1)
- `events` → `promo_codes` (1:many)

### 5. **Check-in & Attendance**
- `events` → `check_in_lists` → `attendee_check_ins` (1:many:many)
- `attendees` → `attendee_check_ins` (1:many)

This schema supports a comprehensive event management platform with multi-tenancy, complex product structures, payment processing, marketing automation, and detailed analytics! 🚀
