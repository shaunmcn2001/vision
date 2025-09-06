# Deployment Guide

## Environment Configuration

This NDVI Vision application supports multiple ways to configure your backend URL and API key for secure deployment.

### Method 1: GitHub Secrets (Recommended for Production)

For GitHub Pages deployment, the best practice is to use repository secrets:

#### Step 1: Set Repository Secrets
1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:
   - `VITE_BACKEND_URL`: Your backend API URL (e.g., `https://your-backend.com`)
   - `VITE_API_KEY`: Your API authentication key

#### Step 2: Deploy to GitHub Pages
The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Inject the secrets as environment variables during build
- Run environment configuration tests
- Deploy to GitHub Pages with your configuration

#### Step 3: Enable GitHub Pages
1. In your repository settings, go to **Pages**
2. Set source to **GitHub Actions**
3. Your app will be deployed at `https://yourusername.github.io/your-repo-name`

### Method 2: Manual Configuration

For development or testing, you can configure settings manually through the app:

1. Open the application
2. Click **Settings** in the sidebar
3. Click **Environment** to open the configuration dialog
4. Enter your Backend URL and API Key
5. Run connection tests to verify configuration

### Method 3: Local Environment File

For local development, create a `.env` file in the project root:

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_API_KEY=your-development-key
```

**Important**: Never commit the `.env` file to your repository.

## Environment Configuration Testing

The application includes automated testing for environment configuration:

### Running Tests Locally
```bash
npm test -- src/tests/EnvironmentConfig.test.tsx
```

### Test Coverage
The tests verify:
- Environment variable detection
- Manual configuration fallbacks
- Connection testing functionality
- Authentication validation
- Error handling

### In CI/CD Pipeline
The GitHub Actions workflow automatically runs these tests with your repository secrets to ensure:
- Environment variables are properly injected
- Backend connectivity works with your configuration
- Authentication is correctly configured

## Configuration Priority

The application uses the following priority order for configuration:

1. **Environment Variables** (highest priority)
   - `VITE_BACKEND_URL`
   - `VITE_API_KEY`

2. **Persistent Local Storage**
   - Manual overrides set through the Settings panel
   - Stored using the `useKV` hook

3. **Default Values** (lowest priority)
   - Backend URL: `http://localhost:8000`
   - API Key: (empty)

## Security Best Practices

### For Production Deployment:
- ✅ Use GitHub repository secrets
- ✅ Enable HTTPS for your backend API
- ✅ Use strong API keys
- ✅ Regularly rotate API keys
- ❌ Never hardcode credentials in source code
- ❌ Never commit `.env` files

### For Development:
- ✅ Use local `.env` files
- ✅ Use development-specific API keys
- ✅ Test with both environment variables and manual configuration
- ❌ Use production credentials in development

## Troubleshooting

### Common Issues:

#### "Environment variables are missing"
- **Solution**: Set `VITE_BACKEND_URL` and `VITE_API_KEY` as repository secrets
- **Local**: Create a `.env` file with the required variables

#### "Authentication failed - check your API key"
- **Solution**: Verify your API key is correct and has proper permissions
- **Test**: Use the "Run Environment Tests" feature in the app

#### "Connection failed"
- **Solution**: Check that your backend URL is accessible
- **Test**: Try accessing `{your-backend-url}/api/health` directly

#### GitHub Pages deployment fails
- **Solution**: Ensure repository secrets are set correctly
- **Check**: Review the GitHub Actions logs for specific error messages

### Debug Information

The application provides comprehensive debug information:

1. **Environment Config Dialog**: Shows current configuration and source
2. **Connection Testing**: Validates backend connectivity and authentication
3. **Backend Status Indicator**: Real-time health monitoring
4. **Debug Panel**: Detailed application state (click the bug icon)

### Support

If you continue to have issues:

1. Check the browser console for error messages
2. Use the Environment Configuration dialog to test your settings
3. Verify your backend API is responding to health checks
4. Ensure CORS is properly configured on your backend

## Example Backend Requirements

Your backend should support the following endpoints:

- `GET /api/health` - Health check
- `GET /api/fields` - List available fields
- `GET /api/ndvi/monthly/by-field/{field_id}?year={year}` - Monthly NDVI data
- `GET /api/tiles/ndvi/annual/{field_id}/{year}/{z}/{x}/{y}.png` - Annual tile data
- `GET /api/tiles/ndvi/month/{field_id}/{year}/{month}/{z}/{x}/{y}.png` - Monthly tile data

All endpoints should accept the `X-API-Key` header for authentication when configured.