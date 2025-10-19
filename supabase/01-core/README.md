# 🎯 EventOS Core Database Schema

**Version:** 1.0  
**Status:** Core Implementation Phase  
**Target:** 15 Essential Tables for MVP Launch

---

## 📁 **Schema Files Overview**

This directory contains the core database schema for EventOS, consisting of 15 essential tables designed for multi-tenant event management with integrated CRM capabilities.

### **Core Tables (15 Files):**

| # | Table | File | Purpose | Priority |
|---|-------|------|---------|----------|
| 1 | `accounts` | [01-accounts.sql](01-accounts.sql) | Multi-tenant foundation | **Critical** |
| 2 | `users` | [02-users.sql](02-users.sql) | User management | **Critical** |
| 3 | `events` | [03-events.sql](03-events.sql) | Event management | **Critical** |
| 4 | `venues` | [04-venues.sql](04-venues.sql) | Location management | **High** |
| 5 | `attendees` | [05-attendees.sql](05-attendees.sql) | Attendee management | **Critical** |
| 6 | `tickets` | [06-tickets.sql](06-tickets.sql) | Ticket management | **Critical** |
| 7 | `orders` | [07-orders.sql](07-orders.sql) | Order management | **Critical** |
| 8 | `contacts` | [08-contacts.sql](08-contacts.sql) | CRM contact management | **High** |
| 9 | `activities` | [09-activities.sql](09-activities.sql) | CRM activity tracking | **High** |
| 10 | `account_users` | [10-account-users.sql](10-account-users.sql) | Team management | **Critical** |
| 11 | `sessions` | [11-sessions.sql](11-sessions.sql) | Event sessions | **Medium** |
| 12 | `campaigns` | [12-campaigns.sql](12-campaigns.sql) | Marketing campaigns | **Medium** |
| 13 | `analytics` | [13-analytics.sql](13-analytics.sql) | Analytics & reporting | **Medium** |
| 14 | `integrations` | [14-integrations.sql](14-integrations.sql) | Third-party integrations | **Low** |
| 15 | `notifications` | [15-notifications.sql](15-notifications.sql) | Notification system | **Low** |

---

## 🚀 **Quick Start Guide**

### **1. Database Setup**
```bash
# Create Supabase project
# Configure environment variables
# Set up Row Level Security (RLS)
```

### **2. Schema Deployment**
```bash
# Run migration scripts in order
psql -f 01-accounts.sql
psql -f 02-users.sql
psql -f 03-events.sql
# ... continue for all 15 tables
```

### **3. Verification**
```sql
-- Verify all tables are created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
ORDER BY tablename, policyname;
```

---

## 🏗️ **Schema Architecture**

### **Multi-Tenant Design**
- **Account-based isolation** via `accounts` table
- **Row Level Security (RLS)** for data protection
- **Scalable SaaS architecture** for growth

### **Event-Centric CRM**
- **Event management** as core business entity
- **CRM integration** for customer relationship management
- **Marketing automation** for event promotion

### **Revenue-First Approach**
- **Direct revenue drivers:** events, tickets, orders, attendees
- **Indirect revenue drivers:** contacts, campaigns, analytics
- **Performance optimization** for $75K/month target

---

## 🔗 **Key Relationships**

### **Primary Relationships:**
```
accounts (1) → (M) users
accounts (1) → (M) events
events (1) → (M) attendees
events (1) → (M) tickets
events (1) → (M) orders
accounts (1) → (M) contacts
contacts (1) → (M) activities
```

### **Secondary Relationships:**
```
events (M) → (1) venues
events (1) → (M) sessions
accounts (1) → (M) campaigns
accounts (1) → (M) integrations
users (1) → (M) notifications
```

---

## 📊 **Implementation Phases**

### **Phase 1: MVP Foundation (Month 1-2)**
**Priority: Critical**
- ✅ `accounts` - Multi-tenant foundation
- ✅ `users` - User management
- ✅ `events` - Core event functionality
- ✅ `attendees` - Basic attendee management
- ✅ `tickets` - Ticket sales
- ✅ `orders` - Payment processing
- ✅ `account_users` - Team management

### **Phase 2: CRM Integration (Month 3-4)**
**Priority: High**
- ✅ `contacts` - Customer management
- ✅ `activities` - Interaction tracking
- ✅ `venues` - Location management

### **Phase 3: Advanced Features (Month 5-6)**
**Priority: Medium/Low**
- ✅ `sessions` - Event content management
- ✅ `campaigns` - Marketing automation
- ✅ `analytics` - Reporting and insights
- ✅ `integrations` - Third-party connections
- ✅ `notifications` - Communication system

---

## 🔒 **Security Features**

### **Row Level Security (RLS)**
- **Multi-tenant isolation** via account-based policies
- **User-specific access** for personal data
- **Role-based permissions** for team management

### **Data Protection**
- **Encrypted sensitive data** (credentials, payment info)
- **Audit trails** for sensitive operations
- **GDPR compliance** with data retention policies

### **Access Control**
- **Role hierarchy:** owner > admin > manager > member > viewer
- **Granular permissions** via JSONB configuration
- **Secure API key management** for integrations

---

## 📈 **Performance Optimizations**

### **Indexing Strategy**
- **Primary indexes** on foreign keys and unique constraints
- **Composite indexes** for common query patterns
- **GIN indexes** for JSONB and array fields
- **Full-text search indexes** for content search

### **Query Optimization**
- **Computed columns** for frequently accessed data
- **Materialized views** for complex aggregations
- **Connection pooling** for high concurrency
- **Query caching** for repeated operations

---

## 🧪 **Testing Strategy**

### **Unit Testing**
- **Table creation** and constraint validation
- **Trigger functionality** and computed columns
- **RLS policy enforcement** and access control

### **Integration Testing**
- **Cross-table relationships** and foreign key constraints
- **Multi-tenant isolation** and data security
- **Performance benchmarks** and scalability testing

### **Data Validation**
- **Sample data insertion** and verification
- **Business logic validation** and edge cases
- **Error handling** and constraint violations

---

## 📚 **Documentation**

### **Schema Documentation**
- [Core Schema Summary](CORE_SCHEMA_SUMMARY.md) - Overview and business impact
- [Core Schema Design](CORE_SCHEMA_DESIGN.md) - Detailed design principles
- Individual table files with comprehensive comments

### **Related Documentation**
- [Database Migration Guide](../MIGRATION_GUIDE.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Security Guidelines](../SECURITY_GUIDELINES.md)

---

## 🛠️ **Development Workflow**

### **Schema Changes**
1. **Design** - Plan changes in design documents
2. **Implement** - Create/modify SQL files
3. **Test** - Validate with sample data
4. **Document** - Update documentation
5. **Deploy** - Apply to development/staging/production

### **Version Control**
- **Git tracking** for all schema changes
- **Migration scripts** for incremental updates
- **Rollback procedures** for failed deployments
- **Environment parity** across dev/staging/prod

---

## 🎯 **Success Metrics**

### **Technical Metrics**
- **Query Performance:** <100ms average response time
- **Database Uptime:** 99.9% availability
- **Security:** Zero data breaches
- **Scalability:** Linear scaling with user growth

### **Business Metrics**
- **Revenue Target:** $75K/month by Month 12
- **Customer Growth:** 1,000+ accounts by Year 1
- **Event Volume:** 10,000+ events by Year 1
- **User Engagement:** 80%+ monthly active users

---

## 🤝 **Contributing**

### **Schema Guidelines**
- Follow PostgreSQL best practices
- Include comprehensive comments
- Add sample data for testing
- Implement proper indexing
- Ensure RLS policy coverage

### **Review Process**
1. **Design Review** - Architecture and business impact
2. **Code Review** - SQL quality and performance
3. **Testing Review** - Validation and edge cases
4. **Documentation Review** - Clarity and completeness

---

*This core schema provides the foundation for EventOS to become a leading event management platform with integrated CRM capabilities, driving toward the $75K/month revenue target.*
