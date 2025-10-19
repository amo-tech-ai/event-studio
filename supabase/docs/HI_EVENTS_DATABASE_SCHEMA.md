# 🎯 Hi.Events Database Schema Documentation

**Platform:** Hi.Events - Event Management & Ticketing Platform  
**Database:** PostgreSQL with Laravel Migrations  
**Version:** Production Schema (2025)  
**Total Tables:** 45+ tables across multiple domains  

---

## 📊 **Schema Overview**

Hi.Events is a comprehensive event management platform with a sophisticated database schema supporting:

- **Multi-tenant Architecture** (Accounts & Organizations)
- **Event Management** (Events, Products/Tickets, Orders)
- **User Management** (Users, Roles, Permissions)
- **Payment Processing** (Stripe Integration, Invoicing)
- **Marketing & Communication** (Campaigns, Messages, Templates)
- **Analytics & Reporting** (Statistics, Tracking)
- **Advanced Features** (Check-ins, Webhooks, Affiliates)

---

## 🏗️ **CORE ARCHITECTURE TABLES**

### **1. accounts**
*Multi-tenant account management*
```sql
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY,
    currency_code VARCHAR(3) DEFAULT 'USD' NOT NULL,
    timezone VARCHAR(255),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    stripe_account_id VARCHAR(50),
    short_id VARCHAR(20) NOT NULL,
    stripe_connect_setup_complete BOOLEAN DEFAULT false,
    account_verified_at TIMESTAMP,
    is_manually_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **2. account_users**
*User-account relationships with roles*
```sql
CREATE TABLE account_users (
    id BIGINT PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100),
    is_account_owner BOOLEAN DEFAULT false NOT NULL,
    invited_by_user_id BIGINT REFERENCES users(id),
    last_login_at TIMESTAMP,
    status VARCHAR(40) DEFAULT 'INVITED' NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(account_id, user_id, role)
);
```

### **3. users**
*Core user management*
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP(0),
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100),
    first_name VARCHAR NOT NULL,
    last_name VARCHAR,
    pending_email VARCHAR,
    timezone VARCHAR NOT NULL,
    locale VARCHAR(20) DEFAULT config('app.locale'),
    created_at TIMESTAMP(0),
    updated_at TIMESTAMP(0),
    deleted_at TIMESTAMP
);
```

### **4. roles**
*Role-based access control*
```sql
CREATE TABLE roles (
    id BIGINT PRIMARY KEY,
    name VARCHAR,
    permissions JSONB NOT NULL,
    account_id BIGINT REFERENCES accounts(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 🎪 **EVENT MANAGEMENT TABLES**

### **5. events**
*Core event information*
```sql
CREATE TABLE events (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organizer_id BIGINT REFERENCES organizers(id),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    description TEXT,
    status VARCHAR,
    location_details JSONB,
    location VARCHAR(255),
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    timezone VARCHAR,
    attributes JSONB,
    short_id VARCHAR(32) NOT NULL,
    ticket_quantity_available INTEGER,
    category VARCHAR DEFAULT 'OTHER',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);
```

### **6. organizers**
*Event organizer profiles*
```sql
CREATE TABLE organizers (
    id BIGINT PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(255),
    description TEXT,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    timezone VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);
```

### **7. organizer_settings**
*Organizer-specific configuration*
```sql
CREATE TABLE organizer_settings (
    id BIGINT PRIMARY KEY,
    organizer_id BIGINT NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
    social_media_handles JSONB,
    website_url VARCHAR(255),
    homepage_theme_settings JSONB,
    homepage_visibility VARCHAR DEFAULT 'PUBLIC',
    homepage_password VARCHAR(255),
    seo_keywords VARCHAR(255),
    seo_title VARCHAR(355),
    seo_description TEXT,
    allow_search_engine_indexing BOOLEAN DEFAULT true,
    location_details JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 🎫 **PRODUCT & TICKET MANAGEMENT**

### **8. products** (formerly tickets)
*Product/ticket definitions*
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    product_type VARCHAR DEFAULT 'TICKET' NOT NULL,
    title VARCHAR(255) NOT NULL,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    product_category_id BIGINT REFERENCES product_categories(id) ON DELETE SET NULL,
    sale_start_date TIMESTAMP,
    sale_end_date TIMESTAMP,
    max_per_order INTEGER,
    min_per_order INTEGER,
    description TEXT,
    sales_volume NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    sales_tax_volume NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    hide_before_sale_start_date BOOLEAN DEFAULT false NOT NULL,
    hide_after_sale_end_date BOOLEAN DEFAULT false NOT NULL,
    hide_when_sold_out BOOLEAN DEFAULT false NOT NULL,
    show_quantity_remaining BOOLEAN DEFAULT false NOT NULL,
    is_hidden_without_promo_code BOOLEAN DEFAULT false NOT NULL,
    start_collapsed BOOLEAN DEFAULT false,
    "order" INTEGER NOT NULL,
    type VARCHAR(20) DEFAULT 'PAID' NOT NULL,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **9. product_categories**
*Product categorization*
```sql
CREATE TABLE product_categories (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT,
    no_products_message VARCHAR,
    is_hidden BOOLEAN DEFAULT false,
    "order" TINYINT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **10. product_prices** (formerly ticket_prices)
*Pricing tiers for products*
```sql
CREATE TABLE product_prices (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price NUMERIC(14,2) NOT NULL,
    label VARCHAR(255),
    sale_start_date TIMESTAMP,
    sale_end_date TIMESTAMP,
    initial_quantity_available INTEGER,
    quantity_available INTEGER,
    quantity_sold INTEGER DEFAULT 0 NOT NULL,
    is_hidden BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    CHECK (price >= 0)
);
```

---

## 🛒 **ORDER & PAYMENT MANAGEMENT**

### **11. orders**
*Order transactions*
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    short_id VARCHAR(20) NOT NULL,
    event_id INTEGER NOT NULL REFERENCES events(id),
    total_before_additions NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_refunded NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_gross NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    currency VARCHAR(3) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR NOT NULL,
    payment_status VARCHAR,
    refund_status VARCHAR,
    payment_provider VARCHAR,
    reserved_until TIMESTAMP(0),
    is_manually_created BOOLEAN DEFAULT false NOT NULL,
    session_id VARCHAR(40),
    public_id VARCHAR NOT NULL UNIQUE,
    point_in_time_data JSONB,
    payment_gateway VARCHAR,
    promo_code_id INTEGER REFERENCES promo_codes(id),
    promo_code VARCHAR,
    affiliate_id BIGINT REFERENCES affiliates(id) ON DELETE SET NULL,
    address JSONB,
    taxes_and_fees_rollup JSONB,
    total_tax NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_fee NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    notes TEXT,
    statistics_decremented_at TIMESTAMP,
    locale VARCHAR(20) DEFAULT config('app.locale'),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **12. order_items**
*Individual items within orders*
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_price_id INTEGER NOT NULL REFERENCES product_prices(id),
    product_type VARCHAR DEFAULT 'TICKET' NOT NULL,
    total_before_additions NUMERIC(14,2) NOT NULL,
    quantity INTEGER NOT NULL,
    item_name VARCHAR,
    price NUMERIC(14,2) NOT NULL,
    price_before_discount NUMERIC(14,2),
    total_tax NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_gross NUMERIC(14,2),
    total_service_fee NUMERIC(14,2) DEFAULT 0.00,
    taxes_and_fees_rollup JSONB,
    deleted_at TIMESTAMP
);
```

### **13. attendees**
*Event attendees*
```sql
CREATE TABLE attendees (
    id BIGINT PRIMARY KEY,
    short_id VARCHAR NOT NULL,
    first_name VARCHAR(255) DEFAULT '' NOT NULL,
    last_name VARCHAR(255) DEFAULT '' NOT NULL,
    email VARCHAR(255) NOT NULL,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_price_id BIGINT NOT NULL REFERENCES product_prices(id),
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    public_id VARCHAR NOT NULL,
    status VARCHAR(20) NOT NULL,
    checked_in_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMP,
    checked_out_by BIGINT REFERENCES users(id),
    locale VARCHAR(20) DEFAULT config('app.locale'),
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);
```

---

## 💳 **PAYMENT & STRIPE INTEGRATION**

### **14. stripe_payments**
*Stripe payment records*
```sql
CREATE TABLE stripe_payments (
    id BIGINT PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    payment_intent_id VARCHAR NOT NULL,
    charge_id VARCHAR,
    payment_method_id VARCHAR,
    amount_received BIGINT,
    connected_account_id VARCHAR(50),
    stripe_platform VARCHAR(2),
    application_fee BIGINT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    last_error JSON
);
```

### **15. stripe_customers**
*Stripe customer records*
```sql
CREATE TABLE stripe_customers (
    id BIGINT PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    stripe_customer_id VARCHAR NOT NULL,
    stripe_account_id VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **16. account_stripe_platforms**
*Multi-platform Stripe support*
```sql
CREATE TABLE account_stripe_platforms (
    id BIGINT PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    stripe_connect_account_type VARCHAR,
    stripe_connect_platform VARCHAR(2),
    stripe_account_id VARCHAR UNIQUE,
    stripe_setup_completed_at TIMESTAMP,
    stripe_account_details JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **17. invoices**
*Invoice management*
```sql
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    total_amount DECIMAL(14,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    items JSONB NOT NULL,
    taxes_and_fees JSONB,
    uuid UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **18. order_refunds**
*Refund tracking*
```sql
CREATE TABLE order_refunds (
    id INTEGER PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_provider VARCHAR NOT NULL,
    refund_id VARCHAR NOT NULL COMMENT 'The refund ID from the payment provider',
    amount DECIMAL(14,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20),
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 🎯 **MARKETING & PROMOTION**

### **19. promo_codes**
*Discount codes and promotions*
```sql
CREATE TABLE promo_codes (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    code VARCHAR(50) NOT NULL,
    discount NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    applicable_product_ids JSONB,
    discount_type VARCHAR,
    expiry_date TIMESTAMP WITH TIME ZONE,
    attendee_usage_count INTEGER DEFAULT 0 NOT NULL,
    order_usage_count INTEGER DEFAULT 0 NOT NULL,
    max_allowed_usages INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **20. affiliates**
*Affiliate marketing*
```sql
CREATE TABLE affiliates (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    code VARCHAR(50) NOT NULL,
    email VARCHAR,
    total_sales INTEGER DEFAULT 0,
    total_sales_gross FLOAT DEFAULT 0,
    status VARCHAR DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **21. campaigns**
*Marketing campaigns*
```sql
CREATE TABLE campaigns (
    id BIGINT PRIMARY KEY,
    event_id BIGINT REFERENCES events(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    description TEXT,
    campaign_type VARCHAR,
    start_date DATE,
    end_date DATE,
    status VARCHAR DEFAULT 'draft',
    budget DECIMAL(10,2),
    cost_per_click DECIMAL(8,2),
    cost_per_impression DECIMAL(8,4),
    cost_per_acquisition DECIMAL(8,2),
    target_audience JSONB,
    creative_assets JSONB,
    automation_rules JSONB,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📧 **COMMUNICATION & MESSAGING**

### **22. messages**
*Event messaging system*
```sql
CREATE TABLE messages (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(40) NOT NULL,
    recipient_ids JSONB,
    attendee_ids JSONB,
    product_ids JSONB,
    order_id BIGINT REFERENCES orders(id),
    sent_by_user_id BIGINT NOT NULL REFERENCES users(id),
    sent_at TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    send_data JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **23. email_templates**
*Email template management*
```sql
CREATE TABLE email_templates (
    id BIGINT PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    organizer_id BIGINT REFERENCES organizers(id) ON DELETE CASCADE,
    event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
    template_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    cta JSON,
    engine VARCHAR(20) DEFAULT 'liquid',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **24. outgoing_messages**
*Message delivery tracking*
```sql
CREATE TABLE outgoing_messages (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    subject VARCHAR NOT NULL,
    recipient VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 📊 **ANALYTICS & STATISTICS**

### **25. event_statistics**
*Event performance metrics*
```sql
CREATE TABLE event_statistics (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    unique_views BIGINT DEFAULT 0 NOT NULL,
    total_views BIGINT DEFAULT 0 NOT NULL,
    sales_total_gross NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_tax NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    sales_total_before_additions NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_fee NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    products_sold INTEGER DEFAULT 0 NOT NULL,
    attendees_registered INTEGER DEFAULT 0,
    orders_created INTEGER DEFAULT 0 NOT NULL,
    orders_cancelled INTEGER DEFAULT 0,
    total_refunded NUMERIC(14,2) DEFAULT 0 NOT NULL,
    version INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### **26. event_daily_statistics**
*Daily event metrics*
```sql
CREATE TABLE event_daily_statistics (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    date DATE NOT NULL,
    sales_total_gross NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_tax NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    sales_total_before_additions NUMERIC(14,2) DEFAULT 0.00 NOT NULL,
    total_fee NUMERIC(14,2) DEFAULT 0 NOT NULL,
    products_sold INTEGER DEFAULT 0 NOT NULL,
    attendees_registered INTEGER DEFAULT 0,
    orders_created INTEGER DEFAULT 0 NOT NULL,
    orders_cancelled INTEGER DEFAULT 0,
    total_refunded NUMERIC(14,2) DEFAULT 0 NOT NULL,
    total_views BIGINT DEFAULT 0 NOT NULL,
    version INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## ✅ **CHECK-IN & ATTENDANCE**

### **27. check_in_lists**
*Check-in list management*
```sql
CREATE TABLE check_in_lists (
    id BIGINT PRIMARY KEY,
    short_id VARCHAR NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    expires_at TIMESTAMP,
    activates_at TIMESTAMP,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **28. attendee_check_ins**
*Check-in records*
```sql
CREATE TABLE attendee_check_ins (
    id BIGINT PRIMARY KEY,
    short_id VARCHAR NOT NULL,
    check_in_list_id BIGINT NOT NULL REFERENCES check_in_lists(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attendee_id BIGINT NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES orders(id),
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ip_address INET,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 🔧 **SYSTEM & CONFIGURATION**

### **29. event_settings**
*Event-specific configuration*
```sql
CREATE TABLE event_settings (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    pre_checkout_message TEXT,
    post_checkout_message TEXT,
    product_page_message TEXT,
    continue_button_text VARCHAR(100),
    email_footer_message TEXT,
    support_email VARCHAR(255),
    require_attendee_details BOOLEAN DEFAULT true NOT NULL,
    order_timeout_in_minutes INTEGER DEFAULT 15 NOT NULL,
    website_url VARCHAR(400),
    maps_url VARCHAR(400),
    homepage_background_color VARCHAR(20),
    homepage_primary_text_color VARCHAR(20),
    homepage_primary_color VARCHAR(20),
    homepage_secondary_text_color VARCHAR(20),
    homepage_secondary_color VARCHAR(20),
    homepage_body_background_color VARCHAR(100),
    homepage_background_type VARCHAR(30) DEFAULT 'COLOR',
    location_details JSONB,
    online_event_connection_details TEXT,
    is_online_event BOOLEAN DEFAULT false NOT NULL,
    allow_search_engine_indexing BOOLEAN DEFAULT true NOT NULL,
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    social_media_handles JSONB,
    show_social_media_handles BOOLEAN,
    seo_keywords VARCHAR(255),
    notify_organizer_of_new_orders BOOLEAN DEFAULT true NOT NULL,
    price_display_mode VARCHAR(255) DEFAULT 'INCLUSIVE' NOT NULL,
    hide_getting_started_page BOOLEAN DEFAULT false NOT NULL,
    show_share_buttons BOOLEAN DEFAULT true NOT NULL,
    enable_invoicing BOOLEAN DEFAULT false,
    invoice_label VARCHAR,
    invoice_prefix VARCHAR,
    invoice_start_number INTEGER DEFAULT 1,
    require_billing_address BOOLEAN DEFAULT true,
    organization_name VARCHAR,
    organization_address TEXT,
    invoice_tax_details TEXT,
    payment_providers JSONB,
    offline_payment_instructions TEXT,
    invoice_payment_terms_days INTEGER,
    invoice_notes TEXT,
    allow_orders_awaiting_offline_payment_to_check_in BOOLEAN DEFAULT false,
    ticket_design_settings JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);
```

### **30. taxes_and_fees**
*Tax and fee configuration*
```sql
CREATE TABLE taxes_and_fees (
    id BIGINT PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    name VARCHAR(255) NOT NULL,
    calculation_type VARCHAR(20) NOT NULL CHECK (calculation_type IN ('FIXED', 'PERCENTAGE')),
    rate NUMERIC(10,3) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TAX', 'FEE')),
    description TEXT,
    created_at TIMESTAMP,
    deleted_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### **31. capacity_assignments**
*Capacity management*
```sql
CREATE TABLE capacity_assignments (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    capacity INTEGER,
    used_capacity INTEGER DEFAULT 0,
    applies_to VARCHAR DEFAULT 'EVENT',
    status VARCHAR DEFAULT 'ACTIVE',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 🔗 **INTEGRATION & WEBHOOKS**

### **32. webhooks**
*Webhook configuration*
```sql
CREATE TABLE webhooks (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    url VARCHAR NOT NULL,
    event_types JSONB NOT NULL,
    last_response_code INTEGER,
    last_response_body TEXT,
    last_triggered_at TIMESTAMP,
    status VARCHAR DEFAULT 'ENABLED',
    secret VARCHAR NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### **33. webhook_logs**
*Webhook delivery logs*
```sql
CREATE TABLE webhook_logs (
    id BIGINT PRIMARY KEY,
    webhook_id BIGINT NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    payload TEXT NOT NULL,
    event_type VARCHAR NOT NULL,
    response_code INTEGER,
    response_body TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 📋 **QUESTIONS & FORMS**

### **34. questions**
*Custom form questions*
```sql
CREATE TABLE questions (
    id BIGINT PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    title TEXT NOT NULL,
    description TEXT,
    required BOOLEAN DEFAULT false NOT NULL,
    type VARCHAR,
    options JSONB,
    belongs_to VARCHAR NOT NULL,
    "order" INTEGER DEFAULT 1 NOT NULL,
    is_hidden BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);
```

### **35. question_answers**
*Question responses*
```sql
CREATE TABLE question_answers (
    id BIGINT PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    order_id INTEGER NOT NULL REFERENCES orders(id),
    attendee_id INTEGER REFERENCES attendees(id),
    product_id INTEGER REFERENCES products(id),
    answer JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);
```

---

## 🖼️ **MEDIA & ASSETS**

### **36. images**
*File and image management*
```sql
CREATE TABLE images (
    id BIGINT PRIMARY KEY,
    entity_id BIGINT,
    entity_type VARCHAR(120),
    account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
    type VARCHAR(40),
    filename VARCHAR(255),
    disk VARCHAR(20),
    path TEXT,
    size INTEGER,
    mime_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

## 🔄 **SYSTEM TABLES**

### **37. migrations**
*Laravel migration tracking*
```sql
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);
```

### **38. personal_access_tokens**
*API authentication*
```sql
CREATE TABLE personal_access_tokens (
    id BIGINT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT,
    last_used_at TIMESTAMP(0),
    expires_at TIMESTAMP(0),
    created_at TIMESTAMP(0),
    updated_at TIMESTAMP(0)
);
```

### **39. failed_jobs**
*Queue job failures*
```sql
CREATE TABLE failed_jobs (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### **40. job_batches**
*Batch job tracking*
```sql
CREATE TABLE job_batches (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT,
    cancelled_at INTEGER,
    created_at INTEGER NOT NULL,
    finished_at INTEGER
);
```

---

## 📊 **DATABASE VIEWS**

### **question_and_answer_views**
*Unified question and answer data*
```sql
CREATE VIEW question_and_answer_views AS
SELECT 
    qa.id AS question_answer_id,
    p.id AS product_id,
    p.title AS product_title,
    q.id AS question_id,
    q.event_id,
    q.belongs_to,
    q.type AS question_type,
    a.first_name,
    a.last_name,
    a.public_id AS attendee_public_id,
    a.email AS attendee_email,
    a.id AS attendee_id,
    o.id AS order_id,
    o.public_id AS order_public_id,
    o.first_name AS order_first_name,
    o.last_name AS order_last_name,
    o.email AS order_email,
    q.title,
    q.description AS question_description,
    q.required AS question_required,
    q.options AS question_options,
    qa.answer
FROM question_answers qa
LEFT JOIN attendees a ON a.id = qa.attendee_id
LEFT JOIN products p ON p.id = qa.product_id
LEFT JOIN orders o ON qa.order_id = o.id
JOIN questions q ON q.id = qa.question_id;
```

---

## 🔗 **KEY RELATIONSHIPS**

### **Core Event Flow:**
```
accounts → events → products → product_prices → orders → order_items → attendees
    ↓        ↓        ↓           ↓            ↓          ↓           ↓
organizers settings  categories  check_ins   payments   questions   statistics
```

### **Multi-tenant Architecture:**
```
accounts (tenant)
    ↓
account_users (user-tenant relationships)
    ↓
users (shared across tenants)
    ↓
roles (tenant-specific permissions)
```

### **Payment Processing:**
```
orders → stripe_payments → stripe_customers
   ↓           ↓               ↓
invoices → order_refunds → account_stripe_platforms
```

---

## 📈 **SCHEMA EVOLUTION**

### **Major Schema Changes:**
1. **2024-09-20**: Renamed `tickets` → `products` (ticket-centric to product-centric)
2. **2025-01-03**: Added comprehensive invoicing system
3. **2025-02-09**: Added webhook system for integrations
4. **2025-05-22**: Added organizer settings and branding
5. **2025-06-18**: Recreated affiliates system
6. **2025-10-02**: Added multi-platform Stripe support

### **Key Features Added:**
- Multi-tenant architecture with account isolation
- Comprehensive product/ticket management
- Advanced payment processing with Stripe
- Marketing automation and campaigns
- Check-in and attendance tracking
- Webhook system for integrations
- Email template management
- Affiliate marketing system
- Comprehensive analytics and reporting

---

## 🎯 **BUSINESS CAPABILITIES SUPPORTED**

### **Event Management:**
- Multi-event organizations
- Complex product/ticket structures
- Pricing tiers and promotions
- Check-in and attendance tracking
- Custom forms and questions

### **E-commerce:**
- Order processing and management
- Payment integration (Stripe)
- Invoice generation
- Refund handling
- Tax and fee calculation

### **Marketing:**
- Promo codes and discounts
- Affiliate marketing
- Email campaigns
- Template management
- Analytics and reporting

### **Multi-tenancy:**
- Account isolation
- Role-based access control
- User management
- Organizer branding
- Custom settings

This comprehensive schema supports a full-featured event management platform capable of handling everything from simple ticketing to complex multi-event organizations with advanced marketing and analytics capabilities! 🚀
