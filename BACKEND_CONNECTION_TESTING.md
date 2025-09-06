# Backend Connection Testing Guide

## Overview
This document explains how to verify that the NDVI Vision frontend can successfully connect to the backend API at `https://vision-backend-0l94.onrender.com`.

## Automatic Testing

### 1. Backend Status Indicator
The app includes an automatic backend status indicator in the left sidebar that:
- Tests the connection every 30 seconds
- Shows green "Online" badge when healthy
- Shows red "Offline" badge when connection fails
- Displays the last check time and any error messages
- Can be manually refreshed with the refresh button

### 2. Debug Panel Connection Test
To access more detailed connection testing:

1. Click the bug icon (🐛) in the bottom-left corner of the sidebar
2. The debug panel will open in the bottom-right corner
3. Expand the "Backend Connection Test" section (should be open by default)
4. Click "Run Tests" to execute comprehensive connection tests

The connection test will verify:
- **Backend Health Check**: Tests `/api/health` endpoint
- **Fields API**: Tests `/api/fields` endpoint to load available fields  
- **Environment Config**: Shows current backend URL configuration

## Manual Testing

### Using Settings Panel
1. Open the Settings panel from the sidebar
2. Verify the Backend URL is set to `https://vision-backend-0l94.onrender.com`
3. Click "Test Connection" to manually verify connectivity
4. Green checkmark = success, red X = failure

### Expected Test Results
✅ **Successful Connection**:
- Backend Health Check: "Backend connected" 
- Fields API: "Successfully loaded X fields"
- Environment Config: Shows correct URL

❌ **Failed Connection**:
- Common error messages:
  - "Network error" - No internet or backend down
  - "HTTP 500" - Server error
  - "Connection failed" - URL incorrect or CORS issues

## Environment Configuration

### Development (.env file)
```bash
VITE_BACKEND_URL=https://vision-backend-0l94.onrender.com
```

### Production (GitHub Pages)
Set `VITE_BACKEND_URL` as a repository secret:
1. Go to repository Settings
2. Secrets and variables → Actions  
3. Add `VITE_BACKEND_URL` = `https://vision-backend-0l94.onrender.com`

## API Endpoints Being Tested

The connection test verifies these critical endpoints:

1. **Health Check**: `GET /api/health`
   - Returns server status and basic info
   
2. **Fields List**: `GET /api/fields`  
   - Returns available agricultural fields
   - Required for field selection functionality

3. **NDVI Data**: `GET /api/ndvi/monthly/by-field/{id}?year={year}`
   - Returns monthly NDVI values for charts
   
4. **Tile Layers**: `GET /api/tiles/ndvi/{type}/{field_id}/{year}[/{month}]/{z}/{x}/{y}.png`
   - Provides NDVI overlay tiles for the map

## Troubleshooting

### Connection Fails
1. **Check backend status**: Visit `https://vision-backend-0l94.onrender.com/api/health` directly
2. **Verify URL**: Ensure no typos in backend URL
3. **Check CORS**: Backend must allow frontend domain
4. **Network issues**: Try from different network/device

### Partial Success  
- If health check works but fields fail → backend database issue
- If fields work but tiles don't load → tile generation problem
- Check browser console for detailed error messages

### Environment Issues
- **Missing VITE_BACKEND_URL**: App defaults to hardcoded URL
- **Wrong environment**: Check if dev/prod using different backends
- **Secret not set**: GitHub Actions won't have backend URL

## Testing Checklist

Before deploying or after backend changes:

- [ ] Backend health endpoint responds with 200 OK
- [ ] Fields API returns valid field list (not empty)
- [ ] NDVI data API returns monthly values
- [ ] Map tiles load correctly for at least one field
- [ ] No CORS errors in browser console
- [ ] Connection test passes in debug panel
- [ ] Backend status shows "Online" in sidebar

## API Key Note

**No API key is required** for the current backend configuration. All endpoints are publicly accessible. The Settings panel no longer includes API key fields as they are not needed for `https://vision-backend-0l94.onrender.com`.