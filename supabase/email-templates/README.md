# 📧 Email Templates Setup Guide

This directory contains branded email templates for Supabase authentication emails.

## 🎨 Templates Included

- **confirm_signup.html** - Email verification template for new user signups

## 📋 Setup Instructions

### Step 1: Access Supabase Email Templates

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**
4. You'll see templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password
   - Invite user

### Step 2: Customize the "Confirm signup" Template

1. Click on **"Confirm signup"** template
2. Copy the contents of `confirm_signup.html` from this directory
3. Paste it into the template editor
4. Click **"Save"**

### Step 3: Configure Other Templates (Optional)

You can customize other templates using the same design system:
- Use green gradient colors: `#10b981` to `#059669`
- Use the Citizn logo/branding
- Maintain the same structure and styling

### Step 4: Test the Email

1. Sign up with a test email address
2. Check your inbox for the verification email
3. Verify the styling and branding look correct

## 🎨 Brand Colors Used

- **Primary Green**: `#10b981`
- **Dark Green**: `#059669`
- **Light Green Background**: `#f0fdf4`
- **Text Dark**: `#1f2937`
- **Text Gray**: `#6b7280`

## 📝 Template Variables

Supabase provides these variables you can use in templates:
- `{{ .ConfirmationURL }}` - The verification link
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Verification token (if needed)
- `{{ .SiteURL }}` - Your site URL
- `{{ .Year }}` - Current year

## 🔧 Customization

To customize the template:
1. Edit the HTML file in this directory
2. Copy the updated content to Supabase
3. Save and test

## ⚠️ Important Notes

- Email templates use HTML email format (table-based layouts for compatibility)
- Test emails in multiple email clients (Gmail, Outlook, Apple Mail)
- Keep the `{{ .ConfirmationURL }}` variable - it's required for verification
- The template uses inline styles for maximum email client compatibility

