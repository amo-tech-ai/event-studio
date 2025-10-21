# 🚀 Lovable Deployment - Environment Variables Setup

## Issue: Blank Screen on https://coral-event-studio.lovable.app/

**Cause:** Missing environment variables in Lovable deployment
**Error:** `Missing environment variable: VITE_SUPABASE_URL`

---

## ✅ Solution: Add Environment Variables to Lovable

### 📋 Step-by-Step Instructions:

1. **Open Lovable Dashboard**
   - Go to https://lovable.app
   - Select your project: `coral-event-studio`

2. **Navigate to Settings**
   - Click on "Settings" or "Project Settings"
   - Find "Environment Variables" section

3. **Add These Variables** (copy-paste each one):

---

### 🔑 Required Environment Variables

```
VITE_SUPABASE_URL
https://asrzdtpyrdgyggqdfwwl.supabase.co
```

```
VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcnpkdHB5cmRneWdncWRmd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjY4NDMsImV4cCI6MjA3NTc0Mjg0M30.dz9YKRsUNv4G7K9u-6ZyEVuRImInbt-pfaggB7SXGmM
```

```
VITE_SUPABASE_PROJECT_ID
asrzdtpyrdgyggqdfwwl
```

---

### 🎯 Optional (Recommended) Variables

```
VITE_SUPABASE_PUBLISHABLE_KEY
sb_publishable_TxiT_vg3a3sCportkSNh3g_dVVq1LSZ
```

```
VITE_PROJECT_NAME
eventos
```

```
VITE_PROJECT_URL
https://asrzdtpyrdgyggqdfwwl.supabase.co
```

```
VITE_APP_VERSION
1.0.0
```

```
VITE_APP_ENV
production
```

```
VITE_DISABLE_AUTH
false
```

---

## 🔄 After Adding Variables:

1. **Save** the environment variables
2. **Trigger a new deployment** (or push a commit to trigger auto-deploy)
3. **Wait for deployment** to complete (usually 1-2 minutes)
4. **Refresh** https://coral-event-studio.lovable.app/

---

## ✅ Expected Result:

- ✅ No more blank screen
- ✅ App loads successfully
- ✅ Dashboard displays correctly
- ✅ Supabase connection works

---

## 🛡️ Security Note:

These values are **safe to use in production**:
- They are PUBLIC values designed for client-side use
- Protected by Row Level Security (RLS) policies in Supabase
- Cannot access data without proper authentication
- Already exposed in your frontend JavaScript bundle

---

## 🧪 Local Development Confirmation:

✅ Your local dev server is running perfectly on http://localhost:8085/
✅ All environment variables are working locally
✅ The issue is ONLY with the Lovable deployment configuration

---

## 📞 Need Help?

If you encounter issues:
1. Check Lovable deployment logs for errors
2. Verify all environment variables are saved correctly
3. Ensure no typos in variable names (they are case-sensitive)
4. Try redeploying after adding variables

---

**Last Updated:** 2025-10-19
**Status:** ⚠️ ACTION REQUIRED - Add environment variables to Lovable
