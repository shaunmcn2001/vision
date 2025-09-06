# NDVI Vision - Agricultural Analytics Platform

## Core Purpose & Success

**Mission Statement**: Provide agricultural professionals with commercial-grade NDVI visualization and analysis tools accessible through a modern web interface.

**Success Indicators**: 
- Seamless field data loading and visualization
- Reliable NDVI tile rendering and interaction
- Intuitive time-based data exploration
- Stable deployment on GitHub Pages

**Experience Qualities**: Professional, Responsive, Reliable

## Project Classification & Approach

**Complexity Level**: Complex Application (advanced functionality, real-time data visualization, map interaction)

**Primary User Activity**: Analyzing - Users consume and interact with agricultural NDVI data to make informed decisions

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Trustworthy, professional, data-focused
- **Design Personality**: Clean, modern, technical but approachable
- **Visual Metaphors**: Agricultural growth, data precision, satellite imagery
- **Simplicity Spectrum**: Clean interface with rich data visualization capabilities

### Color Strategy
- **Color Scheme Type**: Earth-toned professional palette
- **Primary Color**: Agricultural green (oklch(0.45 0.15 142)) representing growth and nature
- **Secondary Colors**: Earth brown (oklch(0.35 0.08 45)) for grounding
- **Accent Color**: Warm yellow (oklch(0.75 0.12 85)) for data highlights
- **Color Psychology**: Green conveys growth and agriculture, neutral tones ensure data visualization clarity

### Typography System
- **Font Pairing Strategy**: Single clean sans-serif font for consistency
- **Selected Fonts**: Inter - excellent for both UI and data display
- **Typographic Hierarchy**: Clear distinction between headers, data labels, and body text
- **Readability Focus**: High contrast, generous spacing for technical data reading

### UI Elements & Component Selection
- **Component Usage**: 
  - Cards for data organization and field lists
  - Sheets for settings and configuration
  - Collapsible sections for debug information
  - Tooltips for map controls
  - Charts for NDVI data visualization
  - Badges for status indicators
- **Component Customization**: Agricultural theme colors, rounded corners for modern feel
- **Spacing System**: Consistent 4px grid system for alignment

## Essential Features

### Map Visualization
**What it does**: Interactive map showing field boundaries and NDVI tile overlays
**Why it matters**: Core visualization for understanding spatial data patterns
**Success criteria**: Smooth pan/zoom, clear tile loading, responsive controls

### Field Management
**What it does**: List and select agricultural fields for analysis
**Why it matters**: Users need to focus on specific field data
**Success criteria**: Fast field loading, clear field identification, persistent selection

### Time Period Selection  
**What it does**: Choose specific years and months for NDVI analysis
**Why it matters**: Temporal analysis is crucial for agricultural insights
**Success criteria**: Intuitive year/month picker, clear current selection display

### NDVI Chart Analysis
**What it does**: Display monthly NDVI values as interactive charts
**Why it matters**: Trend analysis helps identify growth patterns
**Success criteria**: Clear data visualization, responsive chart interaction

### Backend Configuration
**What it does**: Manage API connectivity and environment variables
**Why it matters**: Ensures reliable data connection across deployments
**Success criteria**: Clear connection status, easy configuration management

### Debug & Monitoring
**What it does**: Development tools and connection testing
**Why it matters**: Ensures reliable operation and troubleshooting
**Success criteria**: Clear error reporting, useful diagnostic information

## Implementation Considerations

### Architecture
- **Framework**: React with TypeScript for type safety
- **Styling**: TailwindCSS with shadcn/ui components for consistency
- **State Management**: useKV for persistent state, useState for ephemeral UI state
- **Map Library**: MapLibre GL for performant tile rendering
- **Charts**: Recharts for data visualization

### Deployment
- **Platform**: GitHub Pages for static hosting
- **Environment**: Vite build system with environment variable support
- **Configuration**: Repository secrets for secure API URL management

### Performance
- **Map Performance**: Efficient tile caching and rendering
- **Data Loading**: Proper loading states and error handling
- **Responsive Design**: Mobile-first approach with desktop optimization

## Edge Cases & Problem Scenarios

### Network Issues
- API connection failures handled with retry mechanisms
- Clear error messaging for connectivity problems
- Offline state indication

### Data Loading Failures
- Graceful degradation when field data unavailable
- Clear error states with action suggestions
- Fallback to cached data where possible

### Environment Configuration
- Robust fallback for missing environment variables
- Clear setup instructions for deployment
- Validation and testing of configuration

## Technical Implementation

### File Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── MapView.tsx     # Main map component
│   ├── FieldList.tsx   # Field selection
│   ├── ChartPanel.tsx  # NDVI visualization
│   └── Settings.tsx    # Configuration panel
├── api/                # Backend integration
├── types/              # TypeScript definitions
├── tests/              # Testing infrastructure
└── utils/              # Helper functions
```

### Key Dependencies
- React 19 with hooks
- MapLibre GL for mapping
- Recharts for data visualization
- shadcn/ui for consistent UI
- TailwindCSS for styling
- Vitest for testing

## Quality Assurance

### Testing Strategy
- Environment variable validation
- Component integration testing
- API connection verification  
- Deployment configuration testing

### Performance Targets
- Map rendering under 1 second
- Field data loading under 2 seconds
- Smooth 60fps map interactions
- Responsive design on all devices

## Success Metrics

- Successful field data loading rate > 95%
- Map interaction responsiveness
- Zero deployment failures
- Clear error state handling
- Intuitive user workflow completion