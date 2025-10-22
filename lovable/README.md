# 📚 Lovable Deployment Documentation

Complete reference documentation for deploying Vite + React + Supabase projects to Lovable platform.

---

## 📂 Files in This Folder

### **⚡ `QUICK-REFERENCE.md` (START HERE!)**
**Use for: Quick deployment guide**

One-page quick reference (179 lines) - everything you need to deploy to Lovable in 60 seconds.

**Contains:**
- ⚡ The problem & fix (code examples)
- 🔐 Security checklist
- 🔍 5 common errors with solutions
- ✅ Quick deployment checklist
- 📊 Platform comparison table

**179 lines** | **4.1KB**

**When to use:**
- **90% of the time** - use this first!
- Quick deployment
- Troubleshooting
- Team quick reference

---

### **📚 `lovable-reference.md` (Deep Dive)**
**Use for: Comprehensive guide**

Complete reference guide for when you need detailed information.

**Contains:**
- ⚡ Quick Fix (TL;DR) - 60 second solution
- 🔧 3 Detailed solution approaches
- 🔐 Security best practices
- 🔍 Complete troubleshooting guide (5 common issues)
- 📊 Platform comparison table
- ✅ Deployment checklist (pre/during/post)
- 🎯 4 Advanced patterns
- 📚 Resources & support links

**844 lines** | **21KB**

**When to use:**
- Starting a new Lovable project
- Sharing with other developers
- Troubleshooting any deployment issue
- Creating team documentation

---

### **🎯 `LOVABLE-DEPLOYMENT-FIX-REFERENCE.md` (EventOS-Specific)**
**Use for: EventOS project only**

Project-specific documentation for EventOS deployment on Lovable.

**Contains:**
- EventOS Supabase credentials (actual values)
- Commit history and what worked vs what didn't
- Specific fixes for `coral-event-studio.lovable.app`
- Lessons learned from EventOS deployment

**346 lines** | **9.9KB**

**When to use:**
- Working on EventOS specifically
- Need actual credentials
- Debugging EventOS deployment issues

---

### **⚡ `LOVABLE-ENV-SETUP.md` (Quick Start)**
**Use for: Quick reference**

Shorter, focused setup guide for getting started quickly.

**Contains:**
- Quick setup instructions
- Essential steps only
- Onboarding-friendly format

**126 lines** | **2.7KB**

**When to use:**
- Need a quick reminder
- Onboarding new team members
- Just need the basic steps

---

### **🔑 `lovable-env-vars.txt` (Credentials)**
**Use for: Environment variables reference**

Copy-paste ready environment variables for EventOS.

**Contains:**
- Formatted environment variables
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_SUPABASE_PROJECT_ID
- Optional configuration values

**22 lines** | **670 bytes**

**When to use:**
- Setting up local development
- Quick credential reference
- Sharing with team members

---

## 🚀 Quick Start

### **For New Lovable Projects:**

1. **Read:** `QUICK-REFERENCE.md` (⚡ 179 lines - use this!)
2. **Follow:** "The Fix (60 Seconds)" section
3. **Apply:** Hardcode Supabase credentials
4. **Deploy:** Push and verify

**If you need more details:** Check `lovable-reference.md`

### **For EventOS Project:**

1. **Reference:** `LOVABLE-DEPLOYMENT-FIX-REFERENCE.md`
2. **Copy credentials from:** `lovable-env-vars.txt`
3. **Troubleshoot with:** `lovable-reference.md`

### **For Team Onboarding:**

1. **Start with:** `LOVABLE-ENV-SETUP.md` (quick overview)
2. **Deep dive:** `lovable-reference.md` (comprehensive guide)
3. **Project specifics:** `LOVABLE-DEPLOYMENT-FIX-REFERENCE.md`

---

## 🎯 The Core Problem

**Lovable uses a non-standard build process** that doesn't handle environment variables like standard Vite deployments.

### **What Doesn't Work on Lovable:**
- ❌ `.env` files
- ❌ `vite.config.ts` define option
- ❌ `import.meta.env.*` variables
- ❌ Platform environment variable UI

### **What DOES Work on Lovable:**
- ✅ **Direct hardcoding** of public keys in source code

---

## ⚡ Quick Solution

**Replace this:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**With this:**
```typescript
const supabaseUrl = 'https://your-ref.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Location:** `src/integrations/supabase/client.ts`

---

## 🔐 Security Note

**Safe to Hardcode:**
- ✅ Supabase Anon/Public Key (designed for browsers)
- ✅ Supabase Project URL
- ✅ Stripe Publishable Key
- ✅ Public API endpoints

**NEVER Hardcode:**
- ❌ Service Role Key
- ❌ Database passwords
- ❌ Secret API keys (OpenAI, etc.)
- ❌ OAuth client secrets

**Why Anon Key is Safe:**
> The anon key is designed for browser use and protected by Row Level Security (RLS) policies in Supabase. Even with this key, users can only access data that your RLS policies allow.

---

## 📊 Platform Comparison

| Platform | .env File | vite.config.ts | Platform Secrets | Hardcoded |
|----------|-----------|----------------|------------------|-----------|
| **Lovable** | ❌ | ❌ | ❌ | ✅ **Only option** |
| **Vercel** | ✅ | ✅ | ✅ | ✅ |
| **Netlify** | ✅ | ✅ | ✅ | ✅ |
| **Local Dev** | ✅ | ✅ | N/A | ✅ |

---

## 🔧 File Structure

```
lovable/
├── README.md                              ← You are here
├── lovable-reference.md                   ← Universal guide (use first)
├── LOVABLE-DEPLOYMENT-FIX-REFERENCE.md   ← EventOS specific
├── LOVABLE-ENV-SETUP.md                  ← Quick start
└── lovable-env-vars.txt                  ← Credentials reference
```

---

## 🆘 Common Issues

### **Issue: Blank screen on Lovable**
**Solution:** See `lovable-reference.md` → "Issue 1: Blank Screen"

### **Issue: Wrong API endpoint**
**Solution:** See `lovable-reference.md` → "Issue 2: Wrong API Endpoint"

### **Issue: Authentication not working**
**Solution:** See `lovable-reference.md` → "Issue 3: Authentication Not Working"

### **Issue: Build succeeds but app doesn't update**
**Solution:** See `lovable-reference.md` → "Issue 4: Build Succeeds But App Doesn't Update"

### **Issue: RLS policies blocking access**
**Solution:** See `lovable-reference.md` → "Issue 5: RLS Policies Blocking Access"

---

## 📚 Additional Resources

### **Official Documentation:**
- Lovable Docs: https://docs.lovable.dev
- Vite Env Guide: https://vitejs.dev/guide/env-and-mode
- Supabase Client: https://supabase.com/docs/reference/javascript/initializing
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

### **Community:**
- Lovable Discord (search: "environment variables")
- Stack Overflow (tag: `lovable` or `gpt-engineer`)

---

## ✅ Deployment Checklist

Quick checklist for deploying to Lovable:

- [ ] Get Supabase credentials from dashboard
- [ ] Replace `import.meta.env.*` with hardcoded values
- [ ] Verify only public keys hardcoded (no service role keys)
- [ ] Test locally with `npm run build && npm run preview`
- [ ] Commit and push to GitHub
- [ ] Wait 2-3 minutes for Lovable rebuild
- [ ] Hard refresh browser (`Ctrl + Shift + R`)
- [ ] Test key features (auth, data loading, etc.)
- [ ] Check console for errors
- [ ] Run Lighthouse audit

---

## 🎓 Best Practices

### **DO:**
✅ Hardcode public keys for Lovable
✅ Use RLS to protect sensitive data
✅ Test locally before deploying
✅ Monitor API usage and errors
✅ Document your setup

### **DON'T:**
❌ Hardcode service role keys
❌ Disable RLS in production
❌ Use environment variables on Lovable (won't work)
❌ Skip testing after deployment
❌ Ignore console errors

---

## 📞 Support

**For Lovable-specific issues:**
- Check `lovable-reference.md` troubleshooting section
- Search Lovable Discord/community
- Review platform comparison table

**For EventOS-specific issues:**
- Check `LOVABLE-DEPLOYMENT-FIX-REFERENCE.md`
- Review commit history and solutions tried

**For security questions:**
- Review security section in `lovable-reference.md`
- Check Supabase RLS documentation
- Consult your security team

---

## 📅 Document History

**Created:** 2025-10-20
**Last Updated:** 2025-10-20

**Files:**
- `lovable-reference.md` - v1.0.0 (Universal)
- `LOVABLE-DEPLOYMENT-FIX-REFERENCE.md` - EventOS specific
- `LOVABLE-ENV-SETUP.md` - Quick start guide
- `lovable-env-vars.txt` - Credentials reference
- `README.md` - This file

---

## 🔄 Updates & Maintenance

This is a living documentation set. Update as:
- Lovable platform changes
- New solutions discovered
- Security best practices evolve
- Team feedback received

**To contribute:**
1. Test changes thoroughly
2. Update relevant files
3. Update this README if structure changes
4. Document lessons learned

---

**Questions?** Start with `lovable-reference.md` - it's the most comprehensive guide.

**Working on EventOS?** Use `LOVABLE-DEPLOYMENT-FIX-REFERENCE.md` for project-specific details.

**Need a quick reminder?** Check `LOVABLE-ENV-SETUP.md` for essential steps only.
