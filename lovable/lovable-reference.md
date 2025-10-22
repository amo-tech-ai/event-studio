# =€ Lovable Deployment Reference Guide
**Universal Guide for Vite + React + Supabase Projects**

---

## =Ö Table of Contents

1. [What is Lovable?](#what-is-lovable)
2. [The Environment Variable Problem](#the-environment-variable-problem)
3. [Quick Fix (TL;DR)](#quick-fix-tldr)
4. [Detailed Solutions](#detailed-solutions)
5. [Security Best Practices](#security-best-practices)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Platform Comparison](#platform-comparison)
8. [Deployment Checklist](#deployment-checklist)
9. [Advanced Patterns](#advanced-patterns)
10. [Resources & Support](#resources--support)

---

## <¯ What is Lovable?

**Lovable** (formerly known as GPT Engineer) is an AI-powered web development platform that:
- Generates React + Vite applications
- Includes built-in deployment to `*.lovable.app` domains
- Has a chat-based interface for building features
- Supports Supabase integration out of the box
- Uses a custom build process (this is important!)

**Key Difference:** Lovable uses a non-standard build process that doesn't follow typical Vite conventions for environment variables.

---

##   The Environment Variable Problem

### **Symptom:**
Your app works locally but shows a **blank screen** on Lovable with console error:
```
Uncaught Error: Missing environment variable: VITE_SUPABASE_URL
```

### **Root Cause:**
Lovable's build process does **NOT** properly handle:
- `.env` files
- `vite.config.ts` `define` option
- `import.meta.env.*` variables at build time

### **Why This Happens:**
1. Standard Vite reads `.env` and replaces `import.meta.env.*` at compile time
2. Lovable's custom build bypasses this mechanism
3. Environment variables remain `undefined` in production bundle
4. Your code throws errors trying to access undefined values

---

## ¡ Quick Fix (TL;DR)

### **For Supabase Projects:**

**Step 1:** Get your public credentials from Supabase Dashboard ’ Project Settings ’ API

**Step 2:** Open your Supabase client file (commonly `src/integrations/supabase/client.ts`)

**Step 3:** Replace environment variable usage with hardcoded values:

**L BEFORE (doesn't work on Lovable):**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

** AFTER (works on Lovable):**
```typescript
// Hardcoded for Lovable deployment (safe - anon key only)
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
```

**Step 4:** Commit and push:
```bash
git add src/integrations/supabase/client.ts
git commit -m "fix: Hardcode Supabase credentials for Lovable"
git push origin main
```

**Step 5:** Wait 2-3 minutes for Lovable to rebuild

---

## =' Detailed Solutions

### **Solution 1: Direct Hardcoding (Recommended for Lovable)**

#### When to Use:
-  Deploying to Lovable
-  Using public API keys (Supabase anon key, public API endpoints)
-  Need guaranteed deployment success
-  Single deployment target

#### Implementation:

**For Supabase:**
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**For Other APIs:**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseUrl: 'https://api.example.com',
  publicKey: 'pk_live_xxxxx',
  version: 'v1',
} as const;
```

#### Pros:
-  Works 100% reliably on Lovable
-  No build-time dependencies
-  Simple to implement
-  Works on all platforms (Lovable, Vercel, Netlify, etc.)

#### Cons:
-   Values visible in source code (only use public keys!)
-   Need to update code to change values
-   Different deployment targets need different branches/files

---

### **Solution 2: Hybrid Approach (Multi-Platform)**

#### When to Use:
-  Deploying to multiple platforms (Lovable + Vercel/Netlify)
-  Want environment variables on standard platforms
-  Need fallback for Lovable

#### Implementation:

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// Try environment variables first, fallback to hardcoded values
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://xxxxx.supabase.co'; // Lovable fallback

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Lovable fallback

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Pros:
-  Works on all platforms
-  Uses environment variables when available
-  Falls back to hardcoded for Lovable
-  Single codebase for multiple deployments

#### Cons:
-   Slightly more complex
-   Still exposes hardcoded values in source

---

### **Solution 3: Build-Time Injection (Advanced)**

#### When to Use:
-  Need to keep secrets out of source code
-  Using CI/CD pipelines
-  NOT deploying to Lovable (use Solution 1 or 2 for Lovable)

#### Implementation:

**Step 1:** Create config template:
```typescript
// src/config/env.template.ts
export const ENV = {
  SUPABASE_URL: '__SUPABASE_URL__',
  SUPABASE_ANON_KEY: '__SUPABASE_ANON_KEY__',
} as const;
```

**Step 2:** Add build script:
```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/inject-env.js",
    "build": "vite build"
  }
}
```

**Step 3:** Create injection script:
```javascript
// scripts/inject-env.js
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(
  path.join(__dirname, '../src/config/env.template.ts'),
  'utf8'
);

const injected = template
  .replace('__SUPABASE_URL__', process.env.VITE_SUPABASE_URL)
  .replace('__SUPABASE_ANON_KEY__', process.env.VITE_SUPABASE_ANON_KEY);

fs.writeFileSync(
  path.join(__dirname, '../src/config/env.ts'),
  injected
);
```

**Step 4:** Add to .gitignore:
```bash
# .gitignore
src/config/env.ts  # Generated file
```

#### Pros:
-  Keeps secrets out of source code
-  Works with CI/CD
-  Flexible for multiple environments

#### Cons:
- L Doesn't work on Lovable (custom build process)
-   More complex setup
-   Requires build script maintenance

---

## = Security Best Practices

### ** SAFE to Hardcode (Public Keys):**

| Service | Key Type | Example | Safe? |
|---------|----------|---------|-------|
| Supabase | Anon/Public Key | `eyJ...` (role: anon) |  YES |
| Supabase | Project URL | `https://xxx.supabase.co` |  YES |
| Stripe | Publishable Key | `pk_live_...` or `pk_test_...` |  YES |
| Google Maps | API Key (restricted) | With HTTP referrer restrictions |  YES |
| Firebase | API Key | With domain restrictions |  YES |
| Public API | Endpoint URL | `https://api.example.com` |  YES |

**Why Safe?**
- Designed for browser/client-side use
- Protected by backend security (RLS, API limits, domain restrictions)
- Exposed in frontend bundle anyway (even with env vars)

---

### **L NEVER Hardcode (Secret Keys):**

| Service | Key Type | Example | Safe? |
|---------|----------|---------|-------|
| Supabase | Service Role Key | `eyJ...` (role: service_role) | L NO |
| Stripe | Secret Key | `sk_live_...` or `sk_test_...` | L NO |
| OpenAI | API Key | `sk-...` | L NO |
| Database | Password | Any database credential | L NO |
| OAuth | Client Secret | OAuth app secret | L NO |
| GitHub | Personal Access Token | `ghp_...` | L NO |
| AWS | Secret Access Key | AWS credentials | L NO |

**Why Unsafe?**
- Grant admin/elevated privileges
- Can be extracted from JavaScript bundle
- Cost money if abused
- Can expose sensitive data

---

### **=á Security Checklist:**

- [ ] Only hardcode **public/anon keys** (never secret/service keys)
- [ ] Verify key has **browser-safe permissions**
- [ ] Enable **Row Level Security (RLS)** in Supabase
- [ ] Add **domain restrictions** to API keys (when possible)
- [ ] Set **rate limits** on public endpoints
- [ ] Use **Supabase Edge Functions** for sensitive operations
- [ ] Keep **service role key** in backend/Edge Functions only
- [ ] Add **API key rotation** to your security process
- [ ] Monitor **API usage** for abuse

---

## = Troubleshooting Guide

### **Issue 1: Blank Screen on Lovable**

**Symptoms:**
- App loads fine locally
- Blank white screen on `*.lovable.app`
- Console error: "Missing environment variable"

**Solution:**
```typescript
// Replace import.meta.env.* with hardcoded values
const value = 'hardcoded-value'; // Instead of import.meta.env.VALUE
```

**Verification:**
1. Open DevTools Console at your Lovable URL
2. Check for environment variable errors
3. Verify network requests are using correct API endpoints

---

### **Issue 2: Wrong API Endpoint**

**Symptoms:**
- API calls fail with 404 or CORS errors
- Console shows requests to wrong URL

**Solution:**
```typescript
// Verify hardcoded URLs are correct
const API_URL = 'https://your-actual-api.com'; // Check spelling!

// For Supabase, verify project ref
const supabaseUrl = 'https://correct-ref.supabase.co';
```

**Check:**
- Copy-paste from Supabase dashboard (avoid typos)
- Include `https://` protocol
- Remove trailing slashes
- Verify project is in correct region

---

### **Issue 3: Authentication Not Working**

**Symptoms:**
- Login/signup fails
- Users can't authenticate
- Session not persisting

**Solution:**
```typescript
// Ensure auth config is set
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
```

**Check:**
- RLS policies allow public access where needed
- Auth providers enabled in Supabase dashboard
- Redirect URLs configured correctly
- Email templates approved (for email auth)

---

### **Issue 4: Build Succeeds But App Doesn't Update**

**Symptoms:**
- Push to GitHub
- Lovable says "Build successful"
- App still shows old version

**Solution:**
1. **Hard refresh:** `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. **Clear cache:** DevTools ’ Network tab ’ Check "Disable cache"
3. **Check build timestamp:** Look for `?t=` parameter in loaded scripts
4. **Wait longer:** Lovable can take 3-5 minutes to fully deploy

**Verification:**
```javascript
// In console, check build timestamp
performance.getEntriesByType('resource')
  .find(r => r.name.includes('index'))
  .name; // Should show new timestamp
```

---

### **Issue 5: RLS Policies Blocking Access**

**Symptoms:**
- Data not loading (empty states)
- Console error: "new row violates row-level security"
- 403 errors on Supabase requests

**Solution:**
```sql
-- Example: Allow public read access to events table
CREATE POLICY "Public events are viewable by everyone"
ON events FOR SELECT
USING (is_public = true);

-- Example: Users can read their own data
CREATE POLICY "Users can view own data"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Example: Public insert (for sign-ups)
CREATE POLICY "Anyone can create profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Debug Steps:**
1. Open Supabase Dashboard ’ Authentication ’ Policies
2. Verify policies exist for your tables
3. Test query in SQL Editor with:
   ```sql
   SET LOCAL role TO anon;
   SELECT * FROM your_table;
   ```
4. Adjust policies as needed

---

## =Ê Platform Comparison

### **Environment Variable Support:**

| Platform | .env File | vite.config.ts define | Platform Secrets UI | Hardcoded Values |
|----------|-----------|----------------------|---------------------|------------------|
| **Lovable** | L No | L No | L No (frontend) |  **YES** |
| **Vercel** |  Yes |  Yes |  Yes |  Yes |
| **Netlify** |  Yes |  Yes |  Yes |  Yes |
| **GitHub Pages** | L No |  Yes (with Actions) |  Yes (Actions) |  Yes |
| **Local Dev** |  Yes |  Yes | N/A |  Yes |

### **Recommended Approach by Platform:**

- **Lovable:** Direct hardcoding (only option)
- **Vercel/Netlify:** Platform secrets UI (best practice)
- **GitHub Actions:** GitHub Secrets + build injection
- **Multi-platform:** Hybrid approach (env vars + fallback)

---

##  Deployment Checklist

### **Pre-Deployment:**

- [ ] **Get Credentials:**
  - [ ] Supabase Project URL
  - [ ] Supabase Anon Key
  - [ ] Other public API keys needed

- [ ] **Update Code:**
  - [ ] Replace `import.meta.env.*` with hardcoded values
  - [ ] Verify all API endpoints are correct
  - [ ] Check auth configuration

- [ ] **Security Review:**
  - [ ] Confirm only public keys hardcoded
  - [ ] No service role keys in frontend
  - [ ] RLS policies enabled and tested
  - [ ] Domain restrictions on API keys (if applicable)

- [ ] **Test Locally:**
  ```bash
  npm run build
  npm run preview
  # Visit http://localhost:4173 and test
  ```

---

### **Deployment:**

- [ ] **Commit Changes:**
  ```bash
  git add src/integrations/supabase/client.ts
  git commit -m "fix: Hardcode credentials for Lovable deployment"
  git push origin main
  ```

- [ ] **Wait for Build:**
  - [ ] Wait 2-3 minutes
  - [ ] Check Lovable dashboard for build status

- [ ] **Verify Deployment:**
  - [ ] Visit `https://your-project.lovable.app`
  - [ ] Hard refresh: `Ctrl + Shift + R`
  - [ ] Check console for errors
  - [ ] Test key features:
    - [ ] Pages load
    - [ ] API calls work
    - [ ] Authentication works (if applicable)
    - [ ] Data displays correctly

---

### **Post-Deployment:**

- [ ] **Smoke Tests:**
  - [ ] Homepage loads
  - [ ] Navigation works
  - [ ] Forms submit successfully
  - [ ] Images/media load
  - [ ] No console errors

- [ ] **Cross-Browser Testing:**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari (if possible)
  - [ ] Mobile browsers

- [ ] **Performance:**
  - [ ] Run Lighthouse audit (aim for >90)
  - [ ] Check Core Web Vitals
  - [ ] Test on slow 3G

- [ ] **Monitoring:**
  - [ ] Set up error tracking (Sentry, LogRocket)
  - [ ] Monitor Supabase logs
  - [ ] Check for 404s or broken links

---

## <¯ Advanced Patterns

### **Pattern 1: Environment Detection**

```typescript
// src/lib/env.ts
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isLovable: window.location.hostname.includes('lovable.app'),
  isVercel: window.location.hostname.includes('vercel.app'),
} as const;

// Use in code
if (ENV.isLovable) {
  console.log('Running on Lovable');
}
```

---

### **Pattern 2: Feature Flags**

```typescript
// src/config/features.ts
export const FEATURES = {
  // Enable AI features only in production
  aiChat: import.meta.env.PROD,

  // Analytics disabled on localhost
  analytics: !import.meta.env.DEV,

  // Debug mode for development
  debug: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',

  // Beta features behind flag
  betaFeatures: false, // Hardcoded - change to enable
} as const;

// Usage
if (FEATURES.aiChat) {
  // Initialize AI chat
}
```

---

### **Pattern 3: Multi-Environment Config**

```typescript
// src/config/index.ts
const configs = {
  development: {
    apiUrl: 'http://localhost:3000',
    supabaseUrl: 'https://dev.supabase.co',
    debug: true,
  },
  staging: {
    apiUrl: 'https://staging-api.example.com',
    supabaseUrl: 'https://staging.supabase.co',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.example.com',
    supabaseUrl: 'https://prod.supabase.co',
    debug: false,
  },
} as const;

// Auto-detect environment
const getEnvironment = (): keyof typeof configs => {
  if (import.meta.env.DEV) return 'development';
  if (window.location.hostname.includes('staging')) return 'staging';
  return 'production';
};

export const config = configs[getEnvironment()];
```

---

### **Pattern 4: Type-Safe Config**

```typescript
// src/config/env.ts
interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  stripe?: {
    publishableKey: string;
  };
  analytics?: {
    measurementId: string;
  };
}

export const env: EnvConfig = {
  supabase: {
    url: 'https://xxxxx.supabase.co',
    anonKey: 'eyJ...',
  },
  stripe: {
    publishableKey: 'pk_live_...',
  },
  analytics: {
    measurementId: 'G-...',
  },
};

// Usage with type safety
import { env } from '@/config/env';
const client = createClient(env.supabase.url, env.supabase.anonKey);
```

---

## =Ú Resources & Support

### **Official Documentation:**

- **Lovable Docs:** https://docs.lovable.dev
- **Vite Env Variables:** https://vitejs.dev/guide/env-and-mode
- **Supabase Client Docs:** https://supabase.com/docs/reference/javascript/initializing
- **Supabase RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

### **Community Resources:**

- **Lovable Discord:** Search for "environment variables" in community
- **Lovable GitHub Discussions:** Check for deployment issues
- **Stack Overflow:** Tag: `lovable` or `gpt-engineer`

### **Debugging Tools:**

- **Chrome DevTools:**
  - Console: Check for errors
  - Network tab: Inspect API calls
  - Application tab: Check localStorage/session

- **Supabase Dashboard:**
  - Logs Explorer: Real-time API logs
  - Auth: User sessions and sign-ins
  - SQL Editor: Test queries with RLS

- **Lighthouse:**
  ```bash
  # Install globally
  npm install -g lighthouse

  # Run audit
  lighthouse https://your-app.lovable.app --view
  ```

---

## <˜ Common Errors & Solutions

### **Error: "Failed to fetch"**
**Cause:** CORS issue or wrong API URL
**Fix:** Verify API URL, check Supabase CORS settings

### **Error: "Invalid API key"**
**Cause:** Wrong key or expired key
**Fix:** Re-copy from Supabase dashboard, check for typos

### **Error: "new row violates row-level security policy"**
**Cause:** RLS policy blocking operation
**Fix:** Add appropriate RLS policy in Supabase

### **Error: "NetworkError when attempting to fetch resource"**
**Cause:** Supabase project paused or deleted
**Fix:** Check Supabase dashboard, unpause project

### **Error: "Auth session missing!"**
**Cause:** Not authenticated or session expired
**Fix:** Implement auth flow, check token refresh

---

## =Ý Quick Reference

### **File Locations:**

```
your-project/
   src/
      integrations/
         supabase/
             client.ts           Hardcode here
      config/
         env.ts                  Central config
         features.ts             Feature flags
      lib/
          supabase.ts             Alternative location
   .env                            Works locally, not Lovable
   .env.example                    Template for team
   vite.config.ts                  define option (not for Lovable)
```

---

### **Commands:**

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Lovable
git push origin main  # Auto-deploys

# Check build output
ls dist/  # Should contain index.html and assets/
```

---

### **Key Concepts:**

- **Anon Key:** Safe for frontend (public API key)
- **Service Role Key:** Backend only (admin access)
- **RLS:** Row Level Security (database-level permissions)
- **PKCE:** Proof Key for Code Exchange (secure auth flow)
- **Hardcoding:** Embedding values directly in source code

---

## <“ Best Practices Summary

### **DO:**
 Hardcode public keys for Lovable deployments
 Use RLS to protect sensitive data
 Test locally before deploying
 Monitor API usage and errors
 Document your environment setup
 Use TypeScript for type-safe config
 Keep service role keys in Edge Functions
 Set up proper error tracking

### **DON'T:**
L Hardcode service role or secret keys
L Disable RLS in production
L Commit secrets to Git (except anon keys)
L Use environment variables on Lovable (won't work)
L Forget to test after deployment
L Expose sensitive data in frontend
L Skip security reviews
L Ignore console errors

---

## =Å Document Version

**Version:** 1.0.0
**Last Updated:** 2025-10-20
**Tested With:**
- Lovable platform (current as of Oct 2025)
- Vite 5.x
- React 18.x
- Supabase JS Client 2.x

---

## > Contributing

Found an issue or have improvements? This is a living document.

**Suggest updates for:**
- New Lovable features
- Alternative solutions
- Better security practices
- Platform changes
- Error resolutions

---

## – License & Disclaimer

This guide is provided as-is for educational purposes. Always:
- Review security implications for your specific use case
- Follow your organization's security policies
- Test thoroughly before production deployment
- Keep dependencies updated
- Monitor for security advisories

**Remember:** Security is a shared responsibility. This guide provides patterns and practices, but you're responsible for implementing them correctly in your specific context.

---

**End of Lovable Reference Guide**

For project-specific implementation, see your project's documentation.
