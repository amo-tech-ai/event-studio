# 003 - EventOS Setup Guide

**Purpose:** Complete environment setup, Supabase configuration, CLI tools, and dependency management for EventOS development.

---

## 🚀 **Prerequisites**

### **System Requirements**
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Git:** Latest version
- **Docker:** For Supabase local development
- **VS Code:** Recommended IDE with extensions

### **Required Accounts**
- **Supabase Account:** [supabase.com](https://supabase.com)
- **Vercel Account:** [vercel.com](https://vercel.com)
- **Stripe Account:** [stripe.com](https://stripe.com)
- **GitHub Account:** [github.com](https://github.com)

---

## 📦 **Environment Setup**

### **Step 1: Clone Repository**
```bash
# Clone the EventOS repository
git clone https://github.com/eventos/event-studio.git
cd event-studio

# Install dependencies
npm install
```

### **Step 2: Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Development Settings
VITE_DISABLE_AUTH=true
NODE_ENV=development

# External Services
STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

---

## 🗄️ **Supabase Setup**

### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose your organization and region
3. Set a strong database password
4. Wait for project initialization (2-3 minutes)

### **Step 2: Install Supabase CLI**
```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref
```

### **Step 3: Local Development Setup**
```bash
# Start Supabase locally
supabase start

# This will output:
# API URL: http://localhost:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
```

### **Step 4: Database Schema Setup**
```bash
# Apply migrations
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts
```

---

## 🛠️ **Development Tools**

### **VS Code Extensions**
Install these recommended extensions:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "supabase.supabase-vscode",
    "ms-playwright.playwright"
  ]
}
```

### **Git Hooks Setup**
```bash
# Install husky for git hooks
npm install --save-dev husky

# Setup pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-push "npm run test"
```

---

## 🔧 **Development Commands**

### **Daily Development Workflow**
```bash
# Start development server
npm run dev

# Start Supabase locally (in separate terminal)
supabase start

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

### **Database Management**
```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Reset database
supabase db reset

# Generate types
supabase gen types typescript --local > src/types/database.ts
```

---

## 🧪 **Testing Setup**

### **Unit Testing (Jest)**
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### **E2E Testing (Playwright)**
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run tests in headed mode
npx playwright test --headed

# Generate test report
npx playwright show-report
```

---

## 📊 **Development Architecture**

### **Project Structure**
```
event-studio/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── features/           # Feature-specific modules
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── integrations/       # External service integrations
├── supabase/
│   ├── migrations/         # Database migrations
│   ├── functions/          # Edge functions
│   └── seed.sql           # Sample data
├── tests/
│   ├── unit/              # Unit tests
│   └── e2e/               # E2E tests
└── docs/                  # Documentation
```

### **Feature Module Structure**
```
src/features/events/
├── components/            # Event-specific components
├── hooks/                # Event-related hooks
├── types/                # Event type definitions
├── utils/                # Event utility functions
└── index.ts              # Public API exports
```

---

## 🔒 **Security Configuration**

### **Authentication Setup**
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### **Row Level Security (RLS)**
```sql
-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for event access
CREATE POLICY "Users can view published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their own events" ON events
  FOR ALL USING (auth.uid() = organizer_id);
```

---

## 🚀 **Deployment Setup**

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### **Production Database**
```bash
# Deploy migrations to production
supabase db push

# Generate production types
supabase gen types typescript --project-ref your-project-ref > src/types/database.ts
```

---

## ✅ **Setup Validation**

### **Health Checks**
```bash
# Check Supabase connection
curl -I http://localhost:54321/health

# Check development server
curl -I http://localhost:5173

# Run all tests
npm run test:all

# Check TypeScript compilation
npm run type-check
```

### **Success Criteria**
- ✅ Supabase local instance running
- ✅ Development server accessible
- ✅ All tests passing
- ✅ TypeScript compilation successful
- ✅ Database migrations applied
- ✅ Environment variables configured

---

## 🆘 **Troubleshooting**

### **Common Issues**

**Supabase Connection Issues:**
```bash
# Check Supabase status
supabase status

# Restart Supabase
supabase stop
supabase start
```

**Environment Variable Issues:**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL

# Reload environment
source .env
```

**Database Migration Issues:**
```bash
# Reset database
supabase db reset

# Check migration status
supabase migration list
```

---

**Next Step:** Review [004-core-features.md](004-core-features.md) to understand the core MVP functionality.

---

**Generated:** 2025-01-17  
**Version:** MVP 1.0  
**Status:** Setup Complete
