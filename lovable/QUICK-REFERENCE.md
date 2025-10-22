# 🚀 Lovable Deployment - Quick Reference

**One-page guide for Vite + React + Supabase on Lovable**

---

## ⚡ The Problem

Lovable's build process **doesn't support** environment variables like normal Vite deployments.

**What doesn't work:**
- ❌ `.env` files
- ❌ `vite.config.ts` define option
- ❌ `import.meta.env.*` variables

**What works:**
- ✅ **Direct hardcoding** (only option)

---

## 🔧 The Fix (60 Seconds)

### **Step 1:** Get Supabase credentials
```
Supabase Dashboard → Project Settings → API
- Copy Project URL
- Copy anon/public key
```

### **Step 2:** Update `src/integrations/supabase/client.ts`

**Replace this:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

**With this:**
```typescript
const supabaseUrl = 'https://xxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### **Step 3:** Deploy
```bash
git add src/integrations/supabase/client.ts
git commit -m "fix: Hardcode Supabase for Lovable"
git push origin main
```

Wait 2-3 minutes for rebuild.

---

## 🔐 Security Checklist

### **✅ SAFE to hardcode:**
- Supabase Anon/Public Key (`eyJ...` with role: anon)
- Supabase Project URL (`https://xxx.supabase.co`)
- Stripe Publishable Key (`pk_live_...`)
- Public API endpoints

### **❌ NEVER hardcode:**
- Service Role Key (role: service_role)
- Database passwords
- OpenAI API keys (`sk-...`)
- OAuth client secrets
- Any secret with admin access

---

## 🔍 Troubleshooting

### **Blank screen on Lovable**
**Fix:** Hardcode values, don't use `import.meta.env.*`

### **Wrong API endpoint**
**Fix:** Double-check URL from Supabase dashboard

### **Auth not working**
**Fix:** Add auth config:
```typescript
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

### **RLS blocking data**
**Fix:** Check Supabase → Authentication → Policies

### **App doesn't update after push**
**Fix:** Hard refresh: `Ctrl + Shift + R` (or `Cmd + Shift + R`)

---

## 📊 Platform Comparison

| Platform | Env Vars Work? | Solution |
|----------|----------------|----------|
| **Lovable** | ❌ No | Hardcode only |
| **Vercel** | ✅ Yes | Use platform secrets |
| **Netlify** | ✅ Yes | Use platform secrets |
| **Local Dev** | ✅ Yes | Use .env file |

---

## ✅ Quick Checklist

**Before Deploy:**
- [ ] Get Supabase URL and anon key
- [ ] Replace `import.meta.env.*` with hardcoded values
- [ ] Confirm ONLY public keys hardcoded (no service role)
- [ ] Test locally: `npm run build && npm run preview`

**After Deploy:**
- [ ] Wait 2-3 minutes
- [ ] Hard refresh: `Ctrl + Shift + R`
- [ ] Check console for errors
- [ ] Test auth and data loading

---

## 🆘 Common Errors

```
Error: Missing environment variable: VITE_SUPABASE_URL
→ Replace import.meta.env.* with hardcoded value

Error: Failed to fetch
→ Check API URL, verify no typos

Error: new row violates row-level security
→ Add RLS policy in Supabase dashboard

Error: Invalid API key
→ Re-copy key from Supabase, check for spaces
```

---

## 🔗 Resources

- **Full docs:** `lovable-reference.md` (if you need details)
- **EventOS specifics:** `LOVABLE-DEPLOYMENT-FIX-REFERENCE.md`
- **Supabase RLS:** https://supabase.com/docs/guides/auth/row-level-security
- **Vite env guide:** https://vitejs.dev/guide/env-and-mode

---

## 💡 Pro Tips

1. **Hybrid approach** for multi-platform:
   ```typescript
   const supabaseUrl =
     import.meta.env.VITE_SUPABASE_URL ||
     'https://fallback.supabase.co'; // Lovable fallback
   ```

2. **Keep service role key in Edge Functions**, never in frontend

3. **Enable RLS** on all tables in production

4. **Test locally first** before pushing to Lovable

5. **Monitor API usage** to detect abuse

---

**Last Updated:** 2025-10-20 | **Version:** 1.0.0
