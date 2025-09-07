# NDVI Vision - Agricultural Analytics Dashboard

A modern web application for viewing and analyzing NDVI (Normalized Difference Vegetation Index) data with interactive maps, field management, and temporal analysis.

## 🚀 GitHub Pages Deployment

This application is configured for automatic deployment to GitHub Pages with environment variable support through GitHub secrets.

### Deployment Setup

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages**: 
   - Go to Settings → Pages → Source: "GitHub Actions"
3. **Configure Environment Variables** (optional):
   - Go to Settings → Secrets and variables → Actions
   - Add these repository secrets:
     - `VITE_BACKEND_URL`: Your backend API URL (defaults to `https://vision-backend-0l94.onrender.com`)
     - `VITE_API_KEY`: API key if required (not needed for the default backend)
4. **Deploy**: Push to main branch and deployment will happen automatically!

### Current Configuration
- ✅ **Backend URL**: `https://vision-backend-0l94.onrender.com`  
- ✅ **API Authentication**: No API key required
- ✅ **Build Configuration**: Optimized for GitHub Pages
- ✅ **Environment Testing**: Automated validation in CI/CD

## 🎯 Quick Start

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd vision
   npm install
   ```

2. **Set up environment variables** (optional):
   Create `.env.local`:
   ```bash
   VITE_BACKEND_URL=https://vision-backend-0l94.onrender.com
   # VITE_API_KEY=your-api-key  # Optional
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm test
   npm run test:deployment  # Test deployment configuration
   ```

### Production Deployment

The application automatically validates the environment configuration before deployment:
   - Go to your repository Settings → Secrets and variables → Actions
   - Add `VITE_BACKEND_URL` as a secret (defaults to production backend if not set)

3. **Manual override** - Use the Settings panel in the app (gear icon in sidebar)

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment

This project is configured for automatic deployment to GitHub Pages. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🎯 Features

- **Interactive Map**: MapLibre GL-based map with NDVI overlay tiles
- **Field Management**: Browse and select agricultural fields
- **Temporal Analysis**: View NDVI data across different years and months
- **Data Visualization**: Charts showing monthly NDVI trends
- **Settings Management**: Configure backend API and authentication
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme switching support

## 🛠️ Built With

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** + shadcn/ui for styling
- **MapLibre GL** for interactive maps
- **Recharts** for data visualization
- **GitHub Spark** for deployment and state management

## 📱 Screenshots

The application features a modern, OneSoil-inspired interface with:
- Left sidebar for field selection and controls
- Main map view with NDVI overlays
- Bottom chart panel for temporal analysis
- Settings panel for configuration

## 🔧 Configuration

### Backend API Endpoints

The application expects these endpoints from your backend:
- `GET /api/fields` - List all fields
- `GET /api/ndvi/monthly/by-field/:field_id?year=YYYY` - Monthly NDVI data
- `GET /api/tiles/ndvi/annual/:field_id/:year/{z}/{x}/{y}.png` - Annual NDVI tiles
- `GET /api/tiles/ndvi/month/:field_id/:year/:month/{z}/{x}/{y}.png` - Monthly NDVI tiles
- `GET /api/health` - Backend health check

### Environment Variables

- `VITE_BACKEND_URL`: Your backend API base URL (defaults to https://vision-backend-0l94.onrender.com)

## 📄 License

This project is part of the GitHub Spark ecosystem.