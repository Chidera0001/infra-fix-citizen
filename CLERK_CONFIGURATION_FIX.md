# 🔧 Clerk Configuration Fix Guide

## 🚨 **Problem**
You're getting `Error 400: redirect_uri_mismatch` when trying to sign in with Clerk.

## 🔍 **Root Cause**
Your Clerk application is configured for a different domain than where your app is running.

## ✅ **Complete Solution**

### **Step 1: Update Clerk Dashboard Settings**

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com/
2. **Select your project**: "knowing-moccasin-37"
3. **Navigate to "Configure" → "Domains"**
4. **Add these domains**:
   ```
   http://localhost:3000
   https://localhost:3000
   ```

### **Step 2: Configure Redirect URLs**

In Clerk Dashboard, go to **"Configure" → "Paths"**:

#### **Set these paths**:
- **Sign-in URL**: `/auth`
- **Sign-up URL**: `/auth`
- **After sign-in URL**: `/citizen`
- **After sign-up URL**: `/citizen`
- **Sign-out URL**: `/`

#### **Add these redirect URLs** (in "Configure" → "Domains"):
- `http://localhost:3000/auth`
- `http://localhost:3000/citizen`
- `http://localhost:3000/`

### **Step 3: OAuth Provider Configuration**

If using Google OAuth (which you mentioned):

1. **Go to "Configure" → "OAuth Providers"**
2. **Select Google**
3. **Update Authorized Redirect URIs** to include:
   ```
   https://knowing-moccasin-37.clerk.accounts.dev/v1/oauth_callback
   http://localhost:3000/auth
   ```

### **Step 4: Update Google Cloud Console**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to "APIs & Services" → "Credentials"**
3. **Find your OAuth 2.0 Client ID**
4. **Add these Authorized Redirect URIs**:
   ```
   https://knowing-moccasin-37.clerk.accounts.dev/v1/oauth_callback
   http://localhost:3000
   http://localhost:3000/auth
   ```

### **Step 5: Environment Variables**

Your `.env` file has been created with:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_a25vd2luZy1tb2NjYXNpbi0zNy5jbGVyay5hY2NvdW50cy5kZXYk

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBzm6lpRbkn46PI8kNY3oL_RapAa_Psn18

# Supabase Configuration
VITE_SUPABASE_URL=https://suasdgighpwmxgiuefvb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXNkZ2lnaHB3bXhnaXVlZnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjEwODUsImV4cCI6MjA2NTAzNzA4NX0.qe73NKkiikIyDtnXElW0RqZ56o_W0fCc6TsUApaYAq4
```

### **Step 6: Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🔧 **Code Changes Made**

### **Updated `src/main.tsx`**:
- Added environment variable support for Clerk key
- Added navigation prop to ClerkProvider for better routing

## 🧪 **Testing Steps**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit**: http://localhost:3000

3. **Click on authentication/sign in**

4. **Try Google OAuth** - should now work without redirect errors

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still getting redirect_uri_mismatch**
- **Solution**: Clear browser cache and cookies for localhost:3000
- **Command**: Open DevTools → Application → Clear Storage

### **Issue 2: Google OAuth not working**
- **Solution**: Verify Google Cloud Console redirect URIs match exactly
- **Check**: Both Clerk callback URL and your app URLs are added

### **Issue 3: Environment variables not loading**
- **Solution**: Restart development server after creating `.env`
- **Verify**: Check that `.env` is in project root directory

## 📋 **Verification Checklist**

- [ ] Clerk Dashboard domains include `http://localhost:3000`
- [ ] Clerk paths are set correctly (`/auth`, `/citizen`)
- [ ] Google Cloud Console has correct redirect URIs
- [ ] `.env` file exists with correct variables
- [ ] Development server restarted after changes
- [ ] Browser cache cleared

## 🎯 **Expected Result**

After these changes:
1. ✅ Google OAuth should work without errors
2. ✅ Users should redirect to `/citizen` after sign-in
3. ✅ No more `redirect_uri_mismatch` errors
4. ✅ Smooth authentication flow

## 📞 **Still Having Issues?**

If you're still experiencing problems:

1. **Check Clerk Dashboard logs** - Look for authentication attempts
2. **Verify Google Cloud Console** - Ensure all redirect URIs are correct
3. **Test with different browser** - Rule out cache issues
4. **Check network tab** - Look for failed authentication requests

---

Follow these steps in order, and your Clerk authentication should work perfectly! 🚀
