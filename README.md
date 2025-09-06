# NDVI Vision - Agricultural Analytics Dashboard

A modern web application for viewing and analyzing NDVI (Normalized Difference Vegetation Index) data with interactive maps, field management, and temporal analysis.

## 🚀 Quick Start

### Environment Variables

This application uses environment variables for configuration. You can set them in three ways:

1. **For local development** - Create `.env.local`:
   ```bash
   VITE_BACKEND_URL=https://your-backend-api.com
   VITE_API_KEY=your-api-key-here
   ```

2. **For GitHub Pages deployment** - Set repository secrets:
   - Go to your repository Settings → Secrets and variables → Actions
   - Add `VITE_BACKEND_URL` and `VITE_API_KEY` as secrets

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

- `VITE_BACKEND_URL`: Your backend API base URL
- `VITE_API_KEY`: Optional API key for authentication

## 📄 License

This project is part of the GitHub Spark ecosystem.