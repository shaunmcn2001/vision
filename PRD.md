# NDVI Vision - Commercial-Grade Agricultural Analytics Platform

A professional NDVI (Normalized Difference Vegetation Index) viewer application that provides farmers and agricultural professionals with powerful field monitoring and analysis capabilities through satellite imagery and data visualization.

**Experience Qualities**:
1. **Professional**: Enterprise-grade interface that inspires confidence in commercial agricultural operations
2. **Intuitive**: Clean, map-centric design that makes complex agricultural data accessible to users of all technical levels  
3. **Responsive**: Seamless experience across desktop, tablet, and mobile devices for field-based usage

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requires real-time API integration, interactive mapping, data visualization, and persistent user settings across multiple data sources and time periods

## Essential Features

### Interactive Map Viewer
- **Functionality**: Full-screen MapLibre GL map displaying NDVI tiles and field boundaries with pan/zoom controls
- **Purpose**: Primary interface for visualizing agricultural field health and changes over time
- **Trigger**: Automatic load on application start, updates when user selects different fields/time periods
- **Progression**: Load map → Display field boundaries → Overlay NDVI tiles → Enable user interaction → Update on selection changes
- **Success Criteria**: Map renders smoothly, NDVI colors accurately represent vegetation health, boundaries clearly define field edges

### Field Management System
- **Functionality**: Sidebar list showing all available fields with selection and filtering capabilities
- **Purpose**: Allows users to focus analysis on specific agricultural areas of interest
- **Trigger**: API call to /api/fields on application initialization
- **Progression**: Fetch field data → Display in organized list → Allow selection → Update map and charts → Persist selection state
- **Success Criteria**: All fields load correctly, selection immediately updates map focus and data displays

### Temporal Analysis Controls
- **Functionality**: Year/month picker allowing users to examine NDVI data across different time periods
- **Purpose**: Essential for tracking seasonal changes and multi-year agricultural trends
- **Trigger**: User interaction with date controls in sidebar
- **Progression**: Select year/month → Update NDVI tiles → Refresh chart data → Update map visualization
- **Success Criteria**: Smooth transitions between time periods, data loads without interruption, visual feedback during loading

### NDVI Analytics Dashboard  
- **Functionality**: Interactive charts displaying monthly NDVI trends and statistics using Recharts
- **Purpose**: Quantitative analysis complement to visual map data for data-driven agricultural decisions
- **Trigger**: Field selection or time period change
- **Progression**: Fetch monthly data → Process for visualization → Render responsive charts → Enable interactive exploration
- **Success Criteria**: Charts accurately represent data trends, responsive to different screen sizes, interactive tooltips provide detailed information

### Backend Integration & Settings
- **Functionality**: Settings panel for API configuration and real-time backend health monitoring
- **Purpose**: Ensures reliable data connectivity and allows deployment flexibility across different environments
- **Trigger**: Settings button click or automatic health checks
- **Progression**: Display current settings → Allow API key/URL modification → Test connectivity → Show status indicator
- **Success Criteria**: Settings save persistently, health indicator updates in real-time, connection issues clearly communicated

## Edge Case Handling

- **Network Failures**: Graceful degradation with cached data display and clear reconnection messaging
- **Missing NDVI Data**: Show placeholder states with explanatory text when satellite data unavailable
- **Invalid Field Selection**: Default to first available field or show helpful field selection prompt
- **API Authentication Errors**: Clear error messages with settings panel access for credential updates
- **Mobile Touch Interactions**: Optimized map controls and touch-friendly interface elements for field use
- **Slow Data Loading**: Progressive loading states with skeleton screens and progress indicators

## Design Direction

The design should evoke professional agricultural technology - clean, data-focused, and trustworthy like John Deere Operations Center or Climate FieldView, with the modern sophistication of OneSoil's interface design and minimal visual noise to emphasize the critical agricultural data.

## Color Selection

**Complementary (opposite colors)** - Using earth tones paired with technology blues to represent the intersection of agriculture and modern analytics.

- **Primary Color**: Deep Agricultural Green `oklch(0.45 0.15 142)` - communicates growth, health, and agricultural expertise
- **Secondary Colors**: Earth Brown `oklch(0.35 0.08 45)` for grounding and Satellite Blue `oklch(0.55 0.18 230)` for technology aspects  
- **Accent Color**: Harvest Gold `oklch(0.75 0.12 85)` - attention-grabbing highlight for CTAs and data insights
- **Foreground/Background Pairings**: 
  - Background (Pure White `oklch(1 0 0)`): Dark Charcoal `oklch(0.15 0.02 270)` - Ratio 13.5:1 ✓
  - Card (Light Gray `oklch(0.98 0.01 270)`): Dark Charcoal `oklch(0.15 0.02 270)` - Ratio 13.1:1 ✓  
  - Primary (Deep Green `oklch(0.45 0.15 142)`): White `oklch(1 0 0)` - Ratio 5.8:1 ✓
  - Secondary (Earth Brown `oklch(0.35 0.08 45)`): White `oklch(1 0 0)` - Ratio 8.2:1 ✓
  - Accent (Harvest Gold `oklch(0.75 0.12 85)`): Dark Charcoal `oklch(0.15 0.02 270)` - Ratio 6.1:1 ✓

## Font Selection

Typography should convey technical precision and agricultural professionalism, using Inter for its excellent screen readability and modern geometric feel that works well with data-heavy interfaces.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing for strong brand presence
  - H2 (Panel Titles): Inter SemiBold/20px/normal spacing for clear section organization
  - H3 (Field Names): Inter Medium/16px/normal spacing for important data labels
  - Body (Interface Text): Inter Regular/14px/relaxed line height for extended reading
  - Small (Data Labels): Inter Regular/12px/tight spacing for dense information display

## Animations

Animations should feel precise and purposeful like agricultural machinery - smooth transitions that communicate system reliability without unnecessary flourish, focusing on data loading states and map interactions.

- **Purposeful Meaning**: Subtle transitions reinforce the professional, data-driven nature of agricultural analytics while providing clear feedback for user interactions
- **Hierarchy of Movement**: Map interactions (pan/zoom) receive priority, followed by data loading states, then UI transitions for settings and selections

## Component Selection

- **Components**: 
  - Card for field list items and data panels with subtle shadows
  - Button with distinct primary/secondary variants for actions vs navigation  
  - Select and DatePicker for time period controls with clear visual hierarchy
  - Sheet for settings panel sliding in from right
  - Badge for field status indicators and data labels
  - Skeleton for loading states during API calls
  - Alert for backend connectivity status and error messaging

- **Customizations**: 
  - Custom MapView component wrapping MapLibre GL with agricultural-specific controls
  - ChartPanel component using Recharts with NDVI-optimized color schemes
  - FieldList with virtual scrolling for large farm operations

- **States**: 
  - Buttons show clear hover states with subtle elevation changes
  - Map controls highlight on interaction with agricultural green accent
  - Form inputs provide immediate validation feedback
  - Loading states use skeleton screens with progress indicators

- **Icon Selection**: Phosphor icons emphasizing agricultural themes (plant, map-pin, calendar, chart-line, gear)

- **Spacing**: Consistent 4px base unit with generous padding (16px-24px) for touch-friendly agricultural field usage

- **Mobile**: Progressive disclosure with collapsible sidebar, full-screen map priority, and touch-optimized controls for tablet field usage with map-first approach on smaller screens