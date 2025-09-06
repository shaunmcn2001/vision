# GitHub Pages Deployment with Environment Variables

This guide explains how to deploy your NDVI Vision app to GitHub Pages using repository secrets for your backend URL and API key. The app includes built-in validation and testing to ensure proper configuration.

## 🔐 Setting Up Repository Secrets

### Step-by-Step Setup

1. **Go to your GitHub repository**
2. **Click on Settings** (in the repository, not your profile)
3. **Navigate to Secrets and variables > Actions**
4. **Add the following secrets:**

   **Required:**
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** Your backend API URL (e.g., `https://your-api.example.com`)

   **Optional:**
   - **Name:** `VITE_API_KEY` 
   - **Value:** Your API key (leave empty if not needed)

### Environment Variable Validation

The application includes comprehensive environment variable validation:

- **Automatic Testing**: GitHub Actions runs environment validation on every push
- **Runtime Validation**: The Settings panel shows configuration status
- **Security Checks**: Automated scanning for hardcoded secrets
- **Deployment Readiness**: Validates configuration before deployment

## 🚀 GitHub Actions Workflow

The repository includes two automated workflows:

### Deployment Workflow (`.github/workflows/deploy.yml`)
- Triggers on pushes to `main` branch
- Injects repository secrets as environment variables
- Builds and deploys to GitHub Pages
- Validates deployment readiness

### Environment Testing (`.github/workflows/env-tests.yml`)
- Runs on all pushes and pull requests
- Validates environment variable configuration
- Checks for security issues (hardcoded secrets)
- Tests deployment scenarios

## 🛠️ Local Development

For local development, create a `.env.local` file:

```bash
# .env.local (don't commit this file)
VITE_BACKEND_URL=https://your-backend-api.com
VITE_API_KEY=your-api-key-here
```

**Note:** Use `.env.local` instead of `.env` to prevent accidentally committing secrets.

## 📋 How It Works

### Build Process
1. GitHub Actions triggers on push to main
2. Repository secrets are injected as environment variables
3. Vite processes the environment variables during build
4. Built app is deployed to GitHub Pages

### Runtime Behavior
- `import.meta.env.VITE_*` variables are replaced with actual values
- Environment validation runs automatically
- Settings panel provides configuration status
- Users can override values if needed

## 🔒 Security Features

### Built-in Security
- ✅ **Repository Secrets**: Secure storage in GitHub
- ✅ **Build-time Injection**: Variables are processed during build
- ✅ **No Source Code Exposure**: Secrets never appear in repository
- ✅ **Automated Scanning**: CI checks for hardcoded secrets
- ✅ **Access Control**: Only authorized users can modify secrets

### Security Considerations
- ⚠️ **Client-side Variables**: Frontend environment variables are visible in the built app
- 🔒 **API Key Scope**: Use API keys with minimal required permissions
- 🔄 **Regular Rotation**: Rotate API keys periodically
- 🌐 **CORS Configuration**: Ensure backend allows your domain

## 🌐 Enabling GitHub Pages

1. Go to your repository **Settings**
2. Scroll to **Pages** section
3. Set **Source** to "GitHub Actions"
4. Your app will be available at `https://yourusername.github.io/your-repo-name`

## ✅ Validating Your Setup

### Using the App
1. Open the Settings panel (gear icon in sidebar)
2. Expand "Environment Configuration Status"
3. Check for green indicators on all configuration items
4. Review any warnings or errors

### GitHub Actions Logs
1. Go to the **Actions** tab in your repository
2. Check the latest workflow runs
3. Look for successful deployment and environment validation
4. Review any failed steps or warnings

### Testing API Connection
1. Visit your deployed app
2. Open browser developer tools > Network tab
3. Verify API calls are going to your backend
4. Check authentication headers contain your API key

## 🛠️ Troubleshooting

### Common Issues

**Build Fails**
- Verify repository secrets are named exactly `VITE_BACKEND_URL` and `VITE_API_KEY`
- Check GitHub Actions logs for specific error messages
- Ensure your backend URL is accessible

**API Calls Fail**
- Verify backend URL is publicly accessible
- Check CORS configuration allows your GitHub Pages domain
- Validate API key permissions and expiration

**Environment Variables Not Working**
- Confirm secrets are set in repository settings
- Check that variables use `VITE_` prefix
- Restart development server after changing `.env.local`

### Getting Help

- Check the Settings panel for configuration status
- Review GitHub Actions workflow logs
- Use the app's built-in troubleshooting guide
- Open an issue if problems persist

## 📖 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 🚨 Emergency Recovery

If your deployment breaks:

1. Check GitHub Actions logs for errors
2. Verify repository secrets are correctly set
3. Test with a simple backend URL (like a health check endpoint)
4. Temporarily disable API key requirement
5. Roll back to a previous working commit