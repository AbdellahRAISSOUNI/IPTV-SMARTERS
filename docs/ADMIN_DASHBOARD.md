# Admin Dashboard Documentation

> **Quick Setup:** See [ADMIN_DASHBOARD_SETUP.md](../ADMIN_DASHBOARD_SETUP.md) for step-by-step instructions.

## Overview

The Admin Dashboard allows administrators to manage website content and settings directly through a web interface. Changes are automatically committed to GitHub and deployed to Vercel.

## Features

- ✅ **Password-protected authentication**
- ✅ **Translation editor** for all languages (en, es, fr)
- ✅ **Settings management** for website configuration
- ✅ **GitHub API integration** for automatic commits
- ✅ **Auto-deployment** via Vercel

## Quick Setup

**IMPORTANT:** You must remove `output: "export"` from `next.config.ts` for the admin dashboard to work.

See [ADMIN_DASHBOARD_SETUP.md](../ADMIN_DASHBOARD_SETUP.md) for complete setup instructions.

## Usage

### Accessing the Dashboard

1. Navigate to `/admin/login`
2. Enter your admin password
3. You'll be redirected to the dashboard

### Editing Translations

1. Go to "Translations" in the sidebar
2. Select a language (EN, ES, FR)
3. Edit any translation value
4. Click "Save Changes"
5. Changes are committed to GitHub and auto-deploy

### Managing Settings

1. Go to "Settings" in the sidebar
2. Update website configuration:
   - Base URL
   - Contact Email
   - WhatsApp Number
   - WhatsApp Default Message
3. Click "Save Changes"
4. Changes are committed to GitHub

## How It Works

### Authentication Flow

1. User enters password on `/admin/login`
2. Password is verified against `ADMIN_PASSWORD` env variable
3. Session token is stored in HTTP-only cookie
4. All admin routes check for valid session token

### GitHub Integration

1. **Reading Files:**
   - Uses GitHub Contents API to read files
   - Returns file content and SHA (needed for updates)

2. **Updating Files:**
   - Uses GitHub Contents API PUT endpoint
   - Requires file path, content, and SHA
   - Creates commit with message
   - Pushes to specified branch

### Auto-Deployment

1. When changes are committed to GitHub
2. Vercel detects the push (via GitHub integration)
3. Vercel automatically builds and deploys
4. Website updates within minutes

## API Routes

### `/api/admin/login`
- **Method:** POST
- **Body:** `{ password: string }`
- **Response:** `{ success: boolean, token: string }`
- Sets admin session cookie

### `/api/admin/verify`
- **Method:** GET
- **Response:** `{ authenticated: boolean }`
- Verifies current session

### `/api/admin/logout`
- **Method:** POST
- **Response:** `{ success: boolean }`
- Clears admin session cookie

### `/api/admin/github/read-file`
- **Method:** POST
- **Body:** `{ path: string }`
- **Response:** `{ content: string, sha: string, path: string }`
- Reads file from GitHub repository

### `/api/admin/github/update-file`
- **Method:** POST
- **Body:** `{ path: string, content: string, sha: string, message?: string }`
- **Response:** `{ success: boolean, commit: object, content: object }`
- Updates file in GitHub repository

## Security Considerations

1. **Password Protection:**
   - Use a strong `ADMIN_PASSWORD`
   - Consider using environment-specific passwords
   - Change password regularly

2. **GitHub Token:**
   - Store token securely in environment variables
   - Use token with minimal required scopes
   - Rotate token periodically

3. **Session Management:**
   - Sessions expire after 7 days
   - HTTP-only cookies prevent XSS attacks
   - Secure flag enabled in production

4. **Rate Limiting:**
   - GitHub API has rate limits
   - Consider implementing rate limiting for admin routes

## Troubleshooting

### "Unauthorized" Error

- Check that `ADMIN_PASSWORD` is set correctly
- Verify session cookie is present
- Try logging out and logging back in

### "GitHub configuration missing" Error

- Verify all GitHub environment variables are set:
  - `GITHUB_TOKEN`
  - `GITHUB_REPO`
  - `GITHUB_BRANCH`
  - `GITHUB_EMAIL`
  - `GITHUB_NAME`

### "Failed to load translations" Error

- Check that file path is correct
- Verify GitHub token has `repo` scope
- Check repository name format: `owner/repo`

### Changes Not Deploying

- Verify Vercel is connected to GitHub repository
- Check Vercel deployment logs
- Ensure branch name matches `GITHUB_BRANCH`

## Future Enhancements

Potential improvements:
- [ ] User management (multiple admins)
- [ ] Change history/audit log
- [ ] Preview changes before committing
- [ ] Rollback functionality
- [ ] Bulk translation updates
- [ ] Image upload and management
- [ ] Content versioning

---

**Last Updated:** 2024
**Version:** 1.0.0

