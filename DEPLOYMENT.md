# GitHub Pages Deployment with Environment Variables

This guide explains how to deploy your NDVI Vision app to GitHub Pages using repository secrets for your backend URL and API key.

## Setting Up Repository Secrets

1. **Go to your GitHub repository**
2. **Click on Settings** (in the repository, not your profile)
3. **Navigate to Secrets and variables > Actions**
4. **Add the following secrets:**

   - **Name:** `VITE_BACKEND_URL`
   - **Value:** Your backend API URL (e.g., `https://your-api.example.com`)

   - **Name:** `VITE_API_KEY` 
   - **Value:** Your API key (optional, leave empty if not needed)

## GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      env:
        VITE_BACKEND_URL: ${{ secrets.VITE_BACKEND_URL }}
        VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
      run: npm run build

    - name: Setup Pages
      uses: actions/configure-pages@v4

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'

    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

## Local Development

For local development, create a `.env.local` file:

```bash
# .env.local (don't commit this file)
VITE_BACKEND_URL=https://your-backend-api.com
VITE_API_KEY=your-api-key-here
```

## How It Works

1. **Build Process:** During the GitHub Actions build, your secrets are injected as environment variables
2. **Vite Processing:** Vite replaces `import.meta.env.VITE_*` with the actual values at build time
3. **Runtime:** Your app uses these values without exposing them in the source code

## Security Notes

- ✅ **Safe:** Environment variables are baked into the build at compile time
- ✅ **Protected:** Secrets are never exposed in your repository code
- ⚠️ **Client-side:** Remember that frontend environment variables are visible to users in the built app
- 🔒 **Best Practice:** Use API keys with limited scope and proper backend authentication

## Enabling GitHub Pages

1. Go to your repository **Settings**
2. Scroll to **Pages** section
3. Set **Source** to "GitHub Actions"
4. Your app will be available at `https://yourusername.github.io/your-repo-name`

## Testing the Setup

After deployment:
1. Visit your GitHub Pages URL
2. Open browser developer tools > Network tab
3. Check that API calls are going to your correct backend URL
4. Verify authentication headers contain your API key

## Troubleshooting

- **Build fails:** Check that your repository secrets are named exactly `VITE_BACKEND_URL` and `VITE_API_KEY`
- **API calls fail:** Verify your backend URL is accessible from the internet
- **Authentication errors:** Confirm your API key is valid and has proper permissions