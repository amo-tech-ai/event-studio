# 🚀 Setup and Deployment Guide — EventOS React + Supabase

**Version:** 1.0
**Last Updated:** 2025-10-17
**Target:** Production-ready Vite + React + TypeScript + Supabase

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Creation](#project-creation)
3. [Environment Configuration](#environment-configuration)
4. [Dependencies Installation](#dependencies-installation)
5. [Supabase Client Setup](#supabase-client-setup)
6. [TypeScript Configuration](#typescript-configuration)
7. [Development Workflow](#development-workflow)
8. [Production Deployment](#production-deployment)
9. [Verification Checklist](#verification-checklist)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required Software

```bash
# Node.js 18+ (LTS recommended)
node --version  # Should be v18.0.0 or higher

# npm or pnpm
npm --version   # v9.0.0+ or
pnpm --version  # v8.0.0+

# Git
git --version
```

### Supabase Account Setup

1. **Create Project:**
   - Visit [database.new](https://database.new)
   - Or use existing project: [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **Get Credentials:**
   ```
   Project URL: https://[your-project-ref].supabase.co
   Anon Key: eyJhbGc... (public, safe for client-side)
   ```

3. **Verify Database:**
   - Tables created via migrations (see `/supabase/migrations/`)
   - RLS policies enabled on all tables
   - Sample data loaded (optional)

---

## 🎯 Project Creation

### Step 1: Create React + Vite Project

```bash
# Navigate to your workspace
cd ~/projects/

# Create new Vite project with React + TypeScript
npm create vite@latest event-studio-frontend -- --template react-ts

# Navigate into project
cd event-studio-frontend
```

### Step 2: Install Core Dependencies

```bash
# Install all required packages
npm install @supabase/supabase-js @supabase/auth-helpers-react
npm install @tanstack/react-query
npm install react-router-dom
npm install zustand
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install sonner  # Toast notifications

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node
npm install -D prettier prettier-plugin-tailwindcss
```

### Step 3: Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

**Update `tailwind.config.js`:**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### Step 4: Setup shadcn/ui

```bash
# Install shadcn/ui CLI
npx shadcn-ui@latest init

# Follow prompts:
# ✔ Which style would you like to use? › Default
# ✔ Which color would you like to use as base color? › Slate
# ✔ Would you like to use CSS variables for colors? › yes

# Install essential components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
```

---

## 🔐 Environment Configuration

### Step 1: Create Environment Files

```bash
# Development environment
touch .env.local

# Production environment (for reference)
touch .env.production.local
```

### Step 2: Configure `.env.local`

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://asrzdtpyrdgyggqdfwwl.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
VITE_APP_NAME=EventOS
VITE_APP_URL=http://localhost:5173

# Stripe Configuration (for checkout)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_REALTIME=true
```

### Step 3: Add to `.gitignore`

```bash
# Add to .gitignore
echo ".env*.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### Environment Variables Naming Convention

**✅ CORRECT:**
- `VITE_SUPABASE_URL` (exposed to client)
- `VITE_STRIPE_PUBLISHABLE_KEY` (public key)

**❌ INCORRECT:**
- `SUPABASE_URL` (not exposed by Vite)
- `REACT_APP_*` (Create React App convention)
- `NEXT_PUBLIC_*` (Next.js convention)

---

## 🔧 Supabase Client Setup

### Step 1: Create Client Instance

**File:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce', // Recommended for enhanced security
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'EventOS',
    },
  },
})
```

### Step 2: Generate TypeScript Types

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref asrzdtpyrdgyggqdfwwl

# Generate types
supabase gen types typescript --linked > src/types/database.types.ts
```

**Result:** `src/types/database.types.ts`

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          organizer_id: string
          name: string
          slug: string
          description: string | null
          event_type: 'conference' | 'seminar' | 'workshop' | 'networking'
          start_at: string
          end_at: string
          venue_id: string | null
          capacity: number
          status: 'draft' | 'published' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          name: string
          slug?: string
          description?: string | null
          event_type: 'conference' | 'seminar' | 'workshop' | 'networking'
          start_at: string
          end_at: string
          venue_id?: string | null
          capacity: number
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string
          name?: string
          slug?: string
          description?: string | null
          event_type?: 'conference' | 'seminar' | 'workshop' | 'networking'
          start_at?: string
          end_at?: string
          venue_id?: string | null
          capacity?: number
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
  }
}
```

### Step 3: Create React Query Client

**File:** `src/lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

### Step 4: Setup Providers

**File:** `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { supabase } from './lib/supabase'
import { queryClient } from './lib/queryClient'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <App />
          <Toaster position="top-right" richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

---

## ⚙️ TypeScript Configuration

**Update `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Update `vite.config.ts`:**

```typescript
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

---

## 🔄 Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# In another terminal, watch for database changes
supabase db remote changes

# Generate types after schema changes
supabase gen types typescript --linked > src/types/database.types.ts
```

### Code Quality

```bash
# Type checking
npm run tsc --noEmit

# Linting
npm run lint

# Format code
npm run format
```

**Add to `package.json`:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🚀 Production Deployment

### Vercel Deployment

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Configure Project

**Create `vercel.json`:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "regions": ["iad1"],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

#### Step 3: Add Environment Variables

```bash
# Add to Vercel dashboard
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
```

#### Step 4: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Netlify Deployment

#### Step 1: Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### Step 2: Configure in Netlify Dashboard

```
Build command: npm run build
Publish directory: dist

Environment Variables:
VITE_SUPABASE_URL = https://asrzdtpyrdgyggqdfwwl.supabase.co
VITE_SUPABASE_ANON_KEY = your_anon_key
```

#### Step 3: Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## ✅ Verification Checklist

### Local Development

```bash
# 1. Environment variables loaded
node -e "console.log(process.env)" | grep VITE_SUPABASE

# 2. Development server starts
npm run dev
# Expected: Server running on http://localhost:5173

# 3. No console errors
# Open http://localhost:5173
# Check browser console (F12)
# Expected: No red errors

# 4. Supabase connection works
# Open Network tab
# Make a query (e.g., fetch events)
# Expected: Status 200, data returned
```

### Type Safety

```typescript
// Create test file: src/test-types.ts
import { supabase } from './lib/supabase'

async function testTypes() {
  // Should have autocomplete for table names
  const { data } = await supabase.from('events').select()

  // Should have type inference for data
  if (data) {
    data[0].name // ✅ Type: string
    data[0].capacity // ✅ Type: number
    data[0].nonexistent // ❌ Error: Property doesn't exist
  }
}
```

### Authentication

```typescript
// Test in browser console
import { supabase } from './lib/supabase'

// Check session
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// If logged in, should show user object
// If not logged in, should be null
```

### Production Deployment

```bash
# 1. Build succeeds
npm run build
# Expected: dist/ folder created with index.html

# 2. Preview build
npm run preview
# Expected: Production build runs locally

# 3. Check build size
du -sh dist/
# Expected: < 500KB for initial bundle

# 4. Test production URL
curl -I https://your-app.vercel.app
# Expected: Status: 200
```

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Symptoms:**
```
Error: Missing Supabase environment variables
```

**Solution:**
```bash
# 1. Check .env.local exists
ls -la | grep .env

# 2. Verify VITE_ prefix
cat .env.local | grep VITE_SUPABASE

# 3. Restart dev server
npm run dev
```

### Issue: Types not updating after schema change

**Symptoms:**
```typescript
// TypeScript complains about new column
data[0].new_column // Error: Property doesn't exist
```

**Solution:**
```bash
# Regenerate types
supabase gen types typescript --linked > src/types/database.types.ts

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: CORS errors in production

**Symptoms:**
```
Access to fetch at 'https://xxx.supabase.co' from origin 'https://your-app.com'
has been blocked by CORS policy
```

**Solution:**
```bash
# In Supabase Dashboard → Settings → API
# Add your production domain to "Site URL"
# Add to "Additional Redirect URLs"

Site URL: https://your-app.vercel.app
Redirect URLs: https://your-app.vercel.app/**
```

### Issue: Session not persisting

**Symptoms:**
```
User gets logged out on page refresh
```

**Solution:**
```typescript
// Verify storage configuration in lib/supabase.ts
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true, // ✅ Must be true
    storage: window.localStorage, // ✅ Use localStorage
  },
})
```

### Issue: Real-time not working

**Symptoms:**
```
Database changes don't reflect in UI
```

**Solution:**
```bash
# 1. Check Realtime is enabled in Supabase
# Dashboard → Database → Replication → Enable for tables

# 2. Verify RLS policies allow subscriptions
# SELECT policies must allow the operation

# 3. Check subscription setup
const channel = supabase
  .channel('events')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, handler)
  .subscribe()
```

---

## 📚 Next Steps

1. ✅ **Complete:** Project setup and configuration
2. 🔄 **Next:** [03-AUTH_AND_ACCESS_FLOW.md](./03-AUTH_AND_ACCESS_FLOW.md) - Implement authentication
3. 📋 **Then:** Create your first protected route
4. 🎨 **Finally:** Build dashboard components

---

## 🔗 References

- [Vite Documentation](https://vitejs.dev/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [React Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Vercel Deployment](https://vercel.com/docs)

---

**Status:** ✅ Setup Complete
**Next:** Implement authentication flow
