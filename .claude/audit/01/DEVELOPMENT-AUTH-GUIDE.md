# EventOS Development Authentication Guide

## Quick Fix for Authentication Issues

If you're having trouble accessing the EventOS dashboard due to authentication, follow these steps:

### 🔓 **Disable Authentication for Development**

#### **Option 1: Use the Script (Recommended)**
```bash
./disable-auth.sh
```

#### **Option 2: Manual Fix**
1. **Update local environment:**
   ```bash
   # Edit .env file
   VITE_DISABLE_AUTH=true
   ```

2. **Update Vercel environment variables:**
   ```bash
   # Remove existing variable
   vercel env rm VITE_DISABLE_AUTH
   
   # Add correct variable
   echo "true" | vercel env add VITE_DISABLE_AUTH
   ```

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

### 🔒 **Re-enable Authentication for Production**

#### **Option 1: Use the Script (Recommended)**
```bash
./enable-auth.sh
```

#### **Option 2: Manual Fix**
1. **Update local environment:**
   ```bash
   # Edit .env file
   VITE_DISABLE_AUTH=false
   ```

2. **Update Vercel environment variables:**
   ```bash
   # Remove existing variable
   vercel env rm VITE_DISABLE_AUTH
   
   # Add correct variable
   echo "false" | vercel env add VITE_DISABLE_AUTH
   ```

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

## How Authentication Works

### **Development Mode**
- When `VITE_DISABLE_AUTH=true`, the `ProtectedRoute` component bypasses authentication
- You can access all routes without logging in
- Perfect for development and testing

### **Production Mode**
- When `VITE_DISABLE_AUTH=false`, authentication is required
- Users must log in to access protected routes
- Redirects to `/auth` page if not authenticated

## Current Status

✅ **Authentication is currently DISABLED for development**

### **Access Your App:**
- **Local Development:** http://localhost:5173
- **Production:** https://event-studio-rho.vercel.app

### **What You Can Access:**
- ✅ Dashboard
- ✅ All protected routes
- ✅ All features without authentication

## Troubleshooting

### **Still Getting Redirected to /auth?**

1. **Check environment variables:**
   ```bash
   vercel env ls
   ```

2. **Verify local .env file:**
   ```bash
   cat .env | grep VITE_DISABLE_AUTH
   ```

3. **Clear browser cache:**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache and cookies

4. **Check deployment logs:**
   ```bash
   vercel logs
   ```

### **Environment Variables Not Updating?**

1. **Force redeploy:**
   ```bash
   vercel --prod --force
   ```

2. **Check Vercel dashboard:**
   - Go to your Vercel project settings
   - Check Environment Variables section
   - Ensure `VITE_DISABLE_AUTH=true`

## Security Notes

⚠️ **Important:** Always re-enable authentication before deploying to production!

```bash
# Before production deployment
./enable-auth.sh
vercel --prod
```

## Development Workflow

1. **Start development with auth disabled:**
   ```bash
   ./disable-auth.sh
   npm run dev
   ```

2. **Test authentication features:**
   ```bash
   ./enable-auth.sh
   npm run dev
   ```

3. **Deploy to production with auth enabled:**
   ```bash
   ./enable-auth.sh
   vercel --prod
   ```

## Support

If you're still having issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure the latest deployment is complete
4. Try accessing the app in an incognito/private window
