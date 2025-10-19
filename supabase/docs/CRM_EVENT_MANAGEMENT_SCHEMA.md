# 🎯 CRM + Event Management Database Schema

**Based on:** Fourvenues analysis + industry CRM/event management best practices  
**Integration:** EventOS existing schema + advanced CRM capabilities  
**Target:** Enterprise-grade CRM + event management platform  

---

## 📊 **Schema Overview**

### **Current EventOS Schema (6 tables):**
- ✅ **profiles** - User profiles extending auth.users
- ✅ **events** - Corporate events (conferences, seminars, workshops, networking)
- ✅ **venues** - Event locations in Toronto
- ✅ **orders** - Payment transactions with Stripe integration
- ✅ **attendees** - Event attendee information
- ✅ **tickets** - Individual ticket instances with QR codes

### **Proposed CRM + Event Schema (28 additional tables):**
- **Core CRM Tables (12)** - Foundation CRM functionality
- **Advanced CRM Tables (8)** - Rich CRM features
- **Event Enhancement Tables (8)** - Advanced event management

---

## 🏗️ **CORE CRM + EVENT TABLES**

*Foundation tables for basic CRM + event management functionality*

### **1. contacts**
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Address Information
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Canada',
  
  -- CRM Classification
  contact_type TEXT DEFAULT 'individual' CHECK (contact_type IN ('individual', 'business', 'vip')),
  lead_source TEXT, -- 'website', 'referral', 'social_media', 'event', 'cold_call'
  lead_score INTEGER DEFAULT 0 CHECK (lead_score BETWEEN 0 AND 100),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked', 'deleted')),
  
  -- Business Information
  job_title TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  industry TEXT,
  annual_income_range TEXT,
  
  -- Marketing Preferences
  marketing_consent BOOLEAN DEFAULT false,
  email_consent BOOLEAN DEFAULT false,
  sms_consent BOOLEAN DEFAULT false,
  phone_consent BOOLEAN DEFAULT false,
  
  -- CRM Metadata
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  last_contacted_at TIMESTAMPTZ,
  last_event_attended_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **2. companies**
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company Information
  name TEXT NOT NULL,
  legal_name TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  
  -- Contact Information
  website TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Canada',
  
  -- Business Details
  annual_revenue DECIMAL(15,2),
  employee_count INTEGER,
  founded_year INTEGER,
  tax_id TEXT,
  
  -- CRM Classification
  account_type TEXT DEFAULT 'prospect' CHECK (account_type IN ('prospect', 'customer', 'partner', 'vendor')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Relationship Management
  primary_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **3. leads**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Lead Information
  lead_source TEXT NOT NULL, -- 'website', 'referral', 'social_media', 'event', 'cold_call'
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  lead_score INTEGER DEFAULT 0 CHECK (lead_score BETWEEN 0 AND 100),
  
  -- Opportunity Details
  estimated_value DECIMAL(10,2),
  probability_percentage INTEGER CHECK (probability_percentage BETWEEN 0 AND 100),
  expected_close_date DATE,
  
  -- Lead Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Lead Qualification
  budget_range TEXT,
  decision_timeline TEXT,
  decision_makers TEXT[],
  pain_points TEXT[],
  requirements TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **4. opportunities**
```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Opportunity Details
  name TEXT NOT NULL,
  description TEXT,
  stage TEXT DEFAULT 'prospecting' CHECK (stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  
  -- Financial Information
  amount DECIMAL(10,2),
  probability INTEGER CHECK (probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  actual_close_date DATE,
  
  -- Sales Process
  sales_methodology TEXT,
  competitor TEXT,
  win_reason TEXT,
  loss_reason TEXT,
  
  -- Assignment & Ownership
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **5. interactions**
```sql
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  
  -- Interaction Details
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email', 'phone', 'sms', 'meeting', 'demo', 'proposal', 'follow_up', 'complaint')),
  subject TEXT,
  content TEXT,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  
  -- Outcomes
  outcome TEXT,
  next_action TEXT,
  next_action_date DATE,
  
  -- Assignment
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **6. campaigns**
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Campaign Details
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT CHECK (campaign_type IN ('email', 'sms', 'social_media', 'paid_ads', 'direct_mail', 'event_promotion')),
  
  -- Scheduling
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
  
  -- Budget & Performance
  budget DECIMAL(10,2),
  cost_per_click DECIMAL(8,2),
  cost_per_impression DECIMAL(8,4),
  cost_per_acquisition DECIMAL(8,2),
  
  -- Campaign Settings
  target_audience JSONB, -- Segmentation criteria
  creative_assets JSONB, -- Images, copy, links
  automation_rules JSONB, -- Trigger conditions
  
  -- Ownership
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **7. campaign_recipients**
```sql
CREATE TABLE campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Delivery Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'complained')),
  
  -- Engagement Metrics
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  
  -- Tracking
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  unique_opens INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(campaign_id, contact_id)
);
```

### **8. tasks**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Task Details
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT CHECK (task_type IN ('call', 'email', 'meeting', 'follow_up', 'proposal', 'demo', 'admin', 'research')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Scheduling
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- Relationships
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT false,
  reminder_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **9. notes**
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Note Content
  title TEXT,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'meeting', 'call', 'email', 'internal', 'customer_feedback')),
  
  -- Privacy
  is_private BOOLEAN DEFAULT false,
  is_important BOOLEAN DEFAULT false,
  
  -- Relationships
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  interaction_id UUID REFERENCES interactions(id) ON DELETE SET NULL,
  
  -- Ownership
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **10. users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- User Details
  username TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  
  -- Authentication
  password_hash TEXT,
  last_login_at TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  
  -- Role & Permissions
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  department TEXT,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Preferences
  timezone TEXT DEFAULT 'America/Toronto',
  language TEXT DEFAULT 'en',
  notification_preferences JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **11. roles**
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Role Details
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  level INTEGER DEFAULT 1, -- Hierarchy level
  
  -- Permissions (JSONB for flexibility)
  permissions JSONB NOT NULL DEFAULT '{}',
  
  -- Example permissions structure:
  -- {
  --   "contacts": {"read": true, "write": true, "delete": false},
  --   "events": {"read": true, "write": true, "delete": false},
  --   "campaigns": {"read": true, "write": false, "delete": false},
  --   "analytics": {"read": true, "write": false, "delete": false}
  -- }
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **12. ticket_types**
```sql
CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- Ticket Type Details
  name TEXT NOT NULL,
  description TEXT,
  ticket_category TEXT CHECK (ticket_category IN ('general', 'vip', 'early_bird', 'student', 'group', 'sponsor', 'speaker')),
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  tax_rate DECIMAL(5,2) DEFAULT 0.13, -- HST in Ontario
  
  -- Capacity & Availability
  total_capacity INTEGER,
  sold_count INTEGER DEFAULT 0,
  reserved_count INTEGER DEFAULT 0,
  
  -- Sales Windows
  sale_start_date TIMESTAMPTZ,
  sale_end_date TIMESTAMPTZ,
  
  -- Features & Benefits
  features TEXT[], -- 'access_to_vip_area', 'complimentary_drinks', 'priority_seating'
  benefits TEXT[],
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 **ADVANCED CRM TABLES**

*Rich CRM functionality for enterprise features*

### **13. check_ins**
```sql
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  
  -- Check-in Details
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ,
  check_in_method TEXT CHECK (check_in_method IN ('qr_code', 'manual', 'nfc', 'app', 'kiosk')),
  
  -- Location & Device
  check_in_location TEXT,
  device_id TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Validation
  validated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  validation_notes TEXT,
  
  -- Attendance Tracking
  duration_minutes INTEGER,
  is_present BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **14. seat_maps**
```sql
CREATE TABLE seat_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  
  -- Map Details
  name TEXT NOT NULL,
  description TEXT,
  map_type TEXT CHECK (map_type IN ('theater', 'banquet', 'cocktail', 'standing', 'mixed')),
  
  -- Visual Representation
  svg_content TEXT, -- SVG markup for interactive seat map
  map_image_url TEXT,
  
  -- Dimensions & Layout
  total_capacity INTEGER,
  rows INTEGER,
  seats_per_row INTEGER,
  
  -- Configuration
  seat_pricing JSONB, -- Different pricing per section
  section_names TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **15. seat_assignments**
```sql
CREATE TABLE seat_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_map_id UUID REFERENCES seat_maps(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  
  -- Seat Details
  row_number INTEGER,
  seat_number INTEGER,
  section_name TEXT,
  seat_label TEXT, -- e.g., "A12", "VIP-3"
  
  -- Assignment Details
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Special Requirements
  accessibility_needs TEXT[],
  dietary_restrictions TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(seat_map_id, row_number, seat_number),
  UNIQUE(ticket_id)
);
```

### **16. bundles**
```sql
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- Bundle Details
  name TEXT NOT NULL,
  description TEXT,
  bundle_type TEXT CHECK (bundle_type IN ('ticket_package', 'experience_package', 'corporate_package')),
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  discount_amount DECIMAL(10,2) DEFAULT 0,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Availability
  total_quantity INTEGER,
  sold_quantity INTEGER DEFAULT 0,
  sale_start_date TIMESTAMPTZ,
  sale_end_date TIMESTAMPTZ,
  
  -- Benefits
  benefits TEXT[],
  exclusive_access TEXT[],
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **17. bundle_items**
```sql
CREATE TABLE bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE CASCADE,
  
  -- Item Details
  quantity INTEGER NOT NULL DEFAULT 1,
  included_features TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(bundle_id, ticket_type_id)
);
```

### **18. vouchers**
```sql
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Voucher Details
  code TEXT UNIQUE NOT NULL,
  name TEXT,
  description TEXT,
  
  -- Discount Configuration
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_ticket')),
  discount_value DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  min_purchase_amount DECIMAL(10,2),
  
  -- Usage Limits
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_customer INTEGER DEFAULT 1,
  
  -- Validity Period
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  
  -- Targeting
  applicable_ticket_types UUID[] REFERENCES ticket_types(id),
  customer_restrictions JSONB, -- Segment targeting
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'exhausted')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **19. promoters**
```sql
CREATE TABLE promoters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Promoter Details
  promoter_code TEXT UNIQUE NOT NULL,
  company_name TEXT,
  tax_id TEXT,
  
  -- Contact Information
  phone TEXT,
  email TEXT,
  address TEXT,
  
  -- Commission Structure
  commission_type TEXT CHECK (commission_type IN ('percentage', 'fixed_amount')),
  commission_rate DECIMAL(5,2), -- Percentage or fixed amount
  commission_cap DECIMAL(10,2),
  
  -- Performance Tracking
  total_sales DECIMAL(12,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  
  -- Status & Permissions
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  permissions JSONB DEFAULT '{}',
  
  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **20. promoter_commissions**
```sql
CREATE TABLE promoter_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_id UUID REFERENCES promoters(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  
  -- Commission Details
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2),
  base_amount DECIMAL(10,2), -- Amount commission was calculated on
  
  -- Payment Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at TIMESTAMPTZ,
  payment_reference TEXT,
  
  -- Approval Process
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎪 **EVENT ENHANCEMENT TABLES**

*Advanced event management features*

### **21. sessions**
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES speakers(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  
  -- Session Details
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT CHECK (session_type IN ('keynote', 'workshop', 'panel', 'networking', 'break', 'lunch', 'demo')),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  -- Scheduling
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))/60) STORED,
  
  -- Capacity & Registration
  max_attendees INTEGER,
  current_registrations INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMPTZ,
  waitlist_enabled BOOLEAN DEFAULT false,
  
  -- Resources
  materials_urls TEXT[],
  recording_url TEXT,
  chat_enabled BOOLEAN DEFAULT true,
  qa_enabled BOOLEAN DEFAULT true,
  
  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled', 'postponed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **22. speakers**
```sql
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Speaker Details
  bio TEXT,
  expertise_areas TEXT[],
  years_experience INTEGER,
  certifications TEXT[],
  
  -- Presentation Information
  presentation_title TEXT,
  presentation_description TEXT,
  presentation_duration INTEGER, -- minutes
  presentation_slides_url TEXT,
  handout_materials TEXT[],
  
  -- Social & Professional Links
  website_url TEXT,
  linkedin_url TEXT,
  twitter_handle TEXT,
  company_affiliation TEXT,
  
  -- Logistics
  speaker_fee DECIMAL(10,2),
  travel_arrangements TEXT,
  accommodation_needs TEXT,
  dietary_restrictions TEXT[],
  
  -- Media Assets
  headshot_url TEXT,
  bio_image_url TEXT,
  video_intro_url TEXT,
  
  -- Status & Management
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'replaced')),
  confirmation_date TIMESTAMPTZ,
  contract_signed BOOLEAN DEFAULT false,
  
  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **23. sponsors**
```sql
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  
  -- Sponsorship Details
  sponsorship_tier TEXT CHECK (sponsorship_tier IN ('title', 'platinum', 'gold', 'silver', 'bronze', 'partner', 'media')),
  sponsorship_amount DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
  
  -- Benefits & Deliverables
  benefits_included TEXT[],
  deliverables TEXT[],
  logo_placement TEXT[],
  speaking_opportunities TEXT[],
  
  -- Marketing Assets
  logo_url TEXT,
  website_url TEXT,
  marketing_materials JSONB,
  social_media_links JSONB,
  
  -- Contract Details
  contract_signed BOOLEAN DEFAULT false,
  contract_url TEXT,
  payment_schedule JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **24. event_feedback**
```sql
CREATE TABLE event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  
  -- Overall Event Ratings (1-5 scale)
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  content_rating INTEGER CHECK (content_rating BETWEEN 1 AND 5),
  speaker_rating INTEGER CHECK (speaker_rating BETWEEN 1 AND 5),
  venue_rating INTEGER CHECK (venue_rating BETWEEN 1 AND 5),
  organization_rating INTEGER CHECK (organization_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  
  -- Detailed Feedback
  comments TEXT,
  suggestions TEXT,
  best_aspects TEXT,
  improvement_areas TEXT,
  would_recommend BOOLEAN,
  would_attend_again BOOLEAN,
  
  -- Session-Specific Feedback
  session_rating INTEGER CHECK (session_rating BETWEEN 1 AND 5),
  session_comments TEXT,
  
  -- Anonymous Option
  is_anonymous BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **25. networking_connections**
```sql
CREATE TABLE networking_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  target_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  
  -- Connection Details
  connection_type TEXT CHECK (connection_type IN ('business', 'collaboration', 'mentorship', 'friendship', 'partnership')),
  connection_reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  message TEXT,
  
  -- Meeting Arrangements
  meeting_requested BOOLEAN DEFAULT false,
  meeting_scheduled TIMESTAMPTZ,
  meeting_location TEXT,
  meeting_notes TEXT,
  
  -- Follow-up
  follow_up_scheduled BOOLEAN DEFAULT false,
  follow_up_date DATE,
  follow_up_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, requester_id, target_id)
);
```

### **26. event_materials**
```sql
CREATE TABLE event_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Material Details
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT CHECK (material_type IN ('presentation', 'document', 'video', 'audio', 'image', 'link', 'handout')),
  
  -- File Information
  file_url TEXT,
  file_size BIGINT,
  file_format TEXT,
  file_duration INTEGER, -- For video/audio files (seconds)
  download_count INTEGER DEFAULT 0,
  
  -- Access Control
  access_level TEXT DEFAULT 'attendees_only' CHECK (access_level IN ('public', 'attendees_only', 'speakers_only', 'sponsors_only', 'organizers_only')),
  requires_download BOOLEAN DEFAULT true,
  password_protected BOOLEAN DEFAULT false,
  
  -- Organization
  tags TEXT[],
  language TEXT DEFAULT 'en',
  category TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **27. event_announcements**
```sql
CREATE TABLE event_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Announcement Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Targeting
  target_audience TEXT CHECK (target_audience IN ('all', 'attendees', 'speakers', 'sponsors', 'organizers', 'vip')),
  target_segments JSONB, -- Advanced targeting criteria
  
  -- Delivery
  delivery_method TEXT[] CHECK (delivery_method <@ ARRAY['email', 'push', 'in_app', 'sms', 'website']),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
  
  -- Analytics
  delivery_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **28. event_analytics**
```sql
CREATE TABLE event_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  
  -- Metric Information
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4),
  metric_unit TEXT,
  
  -- Context
  measurement_time TIMESTAMPTZ DEFAULT NOW(),
  data_source TEXT, -- 'registration', 'check_in', 'feedback', 'engagement', 'revenue'
  
  -- Dimensions for Segmentation
  dimension_1 TEXT, -- e.g., 'age_group', 'industry', 'session_type', 'ticket_type'
  dimension_2 TEXT,
  dimension_3 TEXT,
  
  -- Raw Data
  raw_data JSONB,
  
  -- Calculation Metadata
  calculation_method TEXT,
  calculation_period TEXT, -- 'daily', 'hourly', 'total', 'average'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔗 **KEY RELATIONSHIPS & INTEGRATIONS**

### **CRM Flow Integration:**
```
contacts → leads → opportunities → orders → attendees → tickets
    ↓         ↓         ↓          ↓         ↓         ↓
companies  campaigns  tasks     events   sessions  feedback
```

### **Event Management Flow:**
```
events → sessions → speakers → materials
   ↓        ↓         ↓         ↓
venues  check_ins  sponsors  analytics
```

### **Fourvenues Feature Mapping:**
- **Customer Database** → `contacts` + `companies` + behavior tracking
- **VIP Bookings** → `seat_maps` + `seat_assignments` + `ticket_types`
- **Promoter Management** → `promoters` + `promoter_commissions`
- **Marketing Campaigns** → `campaigns` + `campaign_recipients`
- **Team Management** → `users` + `roles` + `tasks`

---

## 🎯 **IMPLEMENTATION PRIORITY**

### **Phase 1: Core CRM (Immediate)**
1. **contacts** - Customer database foundation
2. **companies** - Business account management
3. **interactions** - Communication tracking
4. **campaigns** - Marketing automation

### **Phase 2: Event Enhancement (Short-term)**
5. **sessions** - Multi-session event support
6. **speakers** - Professional speaker management
7. **check_ins** - Advanced attendance tracking
8. **ticket_types** - Flexible ticket management

### **Phase 3: Advanced Features (Medium-term)**
9. **promoters** + **promoter_commissions** - Affiliate management
10. **bundles** + **vouchers** - Promotional features
11. **seat_maps** + **seat_assignments** - VIP seating
12. **event_analytics** - Data-driven insights

---

## 📊 **REAL-WORLD USE CASES SUPPORTED**

### **Corporate Events (NBC Universal style):**
- Multi-event customer database with behavior tracking
- Integrated marketing campaigns across events
- Team collaboration with role-based permissions
- Comprehensive analytics and reporting

### **Music Festivals & Nightlife (Fourvenues style):**
- VIP table bookings with interactive seat maps
- Promoter commission tracking and management
- Real-time check-ins and attendance analytics
- Customer segmentation for targeted marketing

### **Conferences & Training (HubSpot style):**
- Session-based event management with speaker coordination
- Material sharing and access control
- Networking facilitation and connection tracking
- Post-event feedback and improvement analysis

This comprehensive CRM + Event schema transforms EventOS into an enterprise-grade platform capable of handling complex business relationships, sophisticated event management, and data-driven marketing automation! 🚀
