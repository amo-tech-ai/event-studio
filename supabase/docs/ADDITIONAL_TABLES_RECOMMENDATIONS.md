# 🎯 Additional Database Tables for EventOS Platform

**Based on:** Comprehensive web research of real-world event management systems (Eventbrite, Cvent, Bizzabo, Attendease)
**Current Schema:** 6 tables (profiles, events, venues, orders, attendees, tickets)
**Recommendation:** Add 12 additional tables for enterprise-grade event management

---

## 📊 Current Schema Analysis

### ✅ **Already Implemented (6 tables):**
- **profiles** - User management ✅
- **events** - Core event data ✅
- **venues** - Location management ✅
- **orders** - Payment processing ✅
- **attendees** - Attendee registration ✅
- **tickets** - Ticket instances ✅

### 🎯 **Missing Critical Tables (12 tables):**

---

## 🚀 **Recommended Additional Tables**

### **1. SPEAKERS & PRESENTERS**
```sql
-- speakers table
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Speaker details
  bio TEXT,
  expertise_areas TEXT[],
  social_links JSONB,
  headshot_url TEXT,
  
  -- Presentation info
  presentation_title TEXT,
  presentation_description TEXT,
  presentation_duration INTEGER, -- minutes
  presentation_slides_url TEXT,
  
  -- Status & metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  speaker_fee DECIMAL(10,2),
  travel_arrangements TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **2. SESSIONS & WORKSHOPS**
```sql
-- sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES speakers(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  
  -- Session details
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT CHECK (session_type IN ('keynote', 'workshop', 'panel', 'networking', 'break')),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  
  -- Scheduling
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))/60) STORED,
  
  -- Capacity & registration
  max_attendees INTEGER,
  current_registrations INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMPTZ,
  
  -- Resources
  materials_urls TEXT[],
  recording_url TEXT,
  chat_enabled BOOLEAN DEFAULT true,
  
  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **3. SPONSORS & PARTNERS**
```sql
-- sponsors table
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- Company details
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Sponsorship details
  sponsorship_tier TEXT CHECK (sponsorship_tier IN ('platinum', 'gold', 'silver', 'bronze', 'partner')),
  sponsorship_amount DECIMAL(10,2),
  benefits_included TEXT[],
  
  -- Marketing assets
  logo_url TEXT,
  website_url TEXT,
  marketing_materials JSONB,
  social_media_links JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **4. EVENT FEEDBACK & RATINGS**
```sql
-- event_feedback table
CREATE TABLE event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  
  -- Ratings (1-5 scale)
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  content_rating INTEGER CHECK (content_rating BETWEEN 1 AND 5),
  speaker_rating INTEGER CHECK (speaker_rating BETWEEN 1 AND 5),
  venue_rating INTEGER CHECK (venue_rating BETWEEN 1 AND 5),
  organization_rating INTEGER CHECK (organization_rating BETWEEN 1 AND 5),
  
  -- Written feedback
  comments TEXT,
  suggestions TEXT,
  best_aspects TEXT,
  improvement_areas TEXT,
  
  -- Anonymous option
  is_anonymous BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **5. NETWORKING & CONNECTIONS**
```sql
-- networking_connections table
CREATE TABLE networking_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  target_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  
  -- Connection details
  connection_type TEXT CHECK (connection_type IN ('business', 'collaboration', 'mentorship', 'friendship')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  message TEXT,
  
  -- Meeting preferences
  meeting_requested BOOLEAN DEFAULT false,
  meeting_scheduled TIMESTAMPTZ,
  meeting_location TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, requester_id, target_id)
);
```

### **6. EVENT CHECK-INS**
```sql
-- event_checkins table
CREATE TABLE event_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  
  -- Check-in details
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  check_out_time TIMESTAMPTZ,
  location TEXT, -- GPS coordinates or venue area
  
  -- QR Code scanning
  qr_code_scanned TEXT,
  check_in_method TEXT CHECK (check_in_method IN ('qr_code', 'manual', 'nfc', 'app')),
  
  -- Attendance tracking
  attendance_duration INTEGER, -- minutes
  is_present BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **7. EVENT MATERIALS & RESOURCES**
```sql
-- event_materials table
CREATE TABLE event_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Material details
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT CHECK (material_type IN ('presentation', 'document', 'video', 'audio', 'image', 'link')),
  
  -- File information
  file_url TEXT,
  file_size BIGINT,
  file_format TEXT,
  download_count INTEGER DEFAULT 0,
  
  -- Access control
  access_level TEXT DEFAULT 'public' CHECK (access_level IN ('public', 'attendees_only', 'speakers_only', 'sponsors_only')),
  requires_download BOOLEAN DEFAULT true,
  
  -- Metadata
  tags TEXT[],
  language TEXT DEFAULT 'en',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **8. EVENT ANNOUNCEMENTS**
```sql
-- event_announcements table
CREATE TABLE event_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Announcement content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Targeting
  target_audience TEXT CHECK (target_audience IN ('all', 'attendees', 'speakers', 'sponsors', 'organizers')),
  target_sessions UUID[] REFERENCES sessions(id),
  
  -- Delivery
  delivery_method TEXT[] CHECK (delivery_method <@ ARRAY['email', 'push', 'in_app', 'sms']),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **9. EVENT ANALYTICS & METRICS**
```sql
-- event_analytics table
CREATE TABLE event_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  
  -- Metrics
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4),
  metric_unit TEXT,
  
  -- Context
  measurement_time TIMESTAMPTZ DEFAULT NOW(),
  data_source TEXT, -- 'registration', 'check_in', 'feedback', 'engagement'
  
  -- Dimensions
  dimension_1 TEXT, -- e.g., 'age_group', 'industry', 'session_type'
  dimension_2 TEXT,
  dimension_3 TEXT,
  
  -- Raw data (for complex metrics)
  raw_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **10. EVENT WAITLISTS**
```sql
-- event_waitlists table
CREATE TABLE event_waitlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  
  -- Waitlist details
  waitlist_position INTEGER,
  waitlist_reason TEXT, -- 'event_full', 'session_full', 'registration_closed'
  
  -- Notification preferences
  notify_on_availability BOOLEAN DEFAULT true,
  notification_sent_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'offered', 'converted', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **11. EVENT EXPENSES & BUDGET**
```sql
-- event_expenses table
CREATE TABLE event_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Expense details
  expense_name TEXT NOT NULL,
  expense_category TEXT CHECK (expense_category IN ('venue', 'catering', 'speakers', 'marketing', 'technology', 'travel', 'miscellaneous')),
  description TEXT,
  
  -- Financial details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  vendor_name TEXT,
  invoice_number TEXT,
  
  -- Approval workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  payment_date DATE,
  
  -- Attachments
  receipt_url TEXT,
  invoice_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **12. EVENT TEAMS & ROLES**
```sql
-- event_teams table
CREATE TABLE event_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Role details
  role TEXT NOT NULL CHECK (role IN ('organizer', 'coordinator', 'volunteer', 'speaker_liaison', 'tech_support', 'registration', 'marketing')),
  permissions TEXT[] CHECK (permissions <@ ARRAY['manage_event', 'manage_sessions', 'manage_attendees', 'view_analytics', 'manage_materials', 'send_announcements']),
  
  -- Assignment details
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, member_id)
);
```

---

## 🎯 **Implementation Priority**

### **Phase 1: Core Event Management (Immediate)**
1. **sessions** - Essential for multi-session events
2. **speakers** - Required for professional events
3. **event_checkins** - Basic attendance tracking
4. **event_materials** - Resource sharing

### **Phase 2: Engagement & Feedback (Short-term)**
5. **event_feedback** - Post-event analysis
6. **networking_connections** - Professional networking
7. **event_announcements** - Communication
8. **sponsors** - Revenue generation

### **Phase 3: Advanced Features (Medium-term)**
9. **event_analytics** - Data-driven insights
10. **event_waitlists** - Capacity management
11. **event_expenses** - Budget tracking
12. **event_teams** - Team collaboration

---

## 📊 **Real-World Usage Examples**

### **Conference Management (NBC Universal style)**
- **sessions**: Multiple tracks, workshops, keynotes
- **speakers**: International speakers with bios and materials
- **sponsors**: Tiered sponsorship with benefits
- **event_analytics**: Real-time engagement metrics

### **Corporate Training (HubSpot style)**
- **event_materials**: Training resources and recordings
- **event_feedback**: Learning effectiveness measurement
- **event_teams**: Training coordinators and facilitators
- **networking_connections**: Professional development networking

### **Music Festivals (Large-scale events)**
- **sessions**: Multiple stages and performance slots
- **event_checkins**: RFID/NFC check-ins
- **event_announcements**: Real-time updates and safety alerts
- **event_expenses**: Vendor management and budget tracking

---

## 🔧 **Technical Considerations**

### **Performance Optimizations**
- Add indexes on frequently queried columns
- Use partial indexes for status-based queries
- Consider materialized views for complex analytics

### **Security Enhancements**
- Implement RLS policies for all new tables
- Add audit trails for sensitive operations
- Use triggers for data consistency

### **Scalability Features**
- Partition large tables by date/event
- Implement soft deletes for data retention
- Add archiving strategies for old events

---

## 🚀 **Next Steps**

1. **Review and prioritize** tables based on your immediate needs
2. **Design RLS policies** for each new table
3. **Create migration scripts** following your existing pattern
4. **Update API endpoints** to support new functionality
5. **Test with real event data** before production deployment

This comprehensive schema will transform EventOS into an enterprise-grade event management platform capable of handling complex, multi-day events with thousands of attendees! 🎉
