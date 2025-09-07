import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { MapView } from './components/MapView';
import { FieldList } from './components/FieldList';
import { YearMonthPicker } from './components/YearMonthPicker';
import { ChartPanel } from './components/ChartPanel';
import { Settings } from './components/Settings';
import { BackendStatus } from './components/BackendStatus';
import { AppDebug } from './components/AppDebug';
import { TestRouter } from './tests/TestRouter';
import { Field, MapState } from './types';
import { useKV } from './hooks/useKV';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plant, Bug, TestTube } from '@phosphor-icons/react';

function App() {
  // Persistent state using useKV hook
  const [selectedFieldId, setSelectedFieldId] = useKV('selected-field-id', null as string | null);
  const [selectedYear, setSelectedYear] = useKV('selected-year', new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useKV('selected-month', null as number | null);
  
  // Local state
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    center: [-95.7129, 37.0902],
    zoom: 4,
    selectedField: selectedFieldId,
    selectedYear,
    selectedMonth,
    showFieldBoundaries: true,
    showNDVILayer: true,
  });
  const [showDebug, setShowDebug] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTests, setShowTests] = useState(false);

  // Handle field selection
  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setSelectedFieldId(field.id);
  };

  // Handle map state changes
  const handleMapStateChange = (state: MapState) => {
    setMapState(state);
  };

  // Handle settings updates
  const handleSettingsUpdate = () => {
    // Force refresh of backend status and field list
    window.location.reload();
  };

  // Toggle debug panel
  const toggleDebug = () => {
    setShowDebug(prev => !prev);
  };

  // Toggle test mode
  const toggleTests = () => {
    setShowTests(prev => !prev);
  };

  // Initialize selected field from ID
  useEffect(() => {
    if (selectedFieldId && !selectedField) {
      // Field will be set when FieldList loads and finds the matching field
    }
  }, [selectedFieldId, selectedField]);

  // Show test router if in test mode
  if (showTests) {
    return <TestRouter onBackToApp={() => setShowTests(false)} />;
  }

  return (
    <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`
            ${sidebarCollapsed ? 'w-0' : 'w-80'} 
            transition-all duration-300 ease-in-out
            flex-shrink-0 bg-sidebar border-r border-sidebar-border
            overflow-hidden
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Plant className="h-5 w-5 text-primary-foreground" weight="fill" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-sidebar-foreground">NDVI Vision</h1>
                  <p className="text-xs text-sidebar-foreground/70">Agricultural Analytics</p>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Backend Status */}
              <BackendStatus />

              <Separator />

              {/* Field Selection */}
              <FieldList 
                selectedFieldId={selectedFieldId}
                onFieldSelect={handleFieldSelect}
              />

              <Separator />

              {/* Time Controls */}
              <YearMonthPicker
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
                disabled={!selectedField}
              />

              <Separator />

              {/* Settings */}
              <Settings onSettingsUpdate={handleSettingsUpdate} />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center justify-between text-xs text-sidebar-foreground/70">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    v1.0.0
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDebug}
                    className="h-6 w-6 p-0"
                  >
                    <Bug className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTests}
                    className="h-6 w-6 p-0"
                  >
                    <TestTube className="h-3 w-3" />
                  </Button>
                </div>
                <span>© 2024 NDVI Vision</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Map */}
          <div className="flex-1 p-4">
            <MapView
              selectedField={selectedField}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onMapStateChange={handleMapStateChange}
            />
          </div>

          {/* Bottom Chart Panel */}
          <div className="h-80 border-t border-border p-4">
            <ChartPanel
              selectedField={selectedField}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        {sidebarCollapsed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarCollapsed(false)}
            className="absolute top-4 left-4 z-40 shadow-lg"
          >
            <Plant className="h-4 w-4" />
          </Button>
        )}

        {/* Sidebar Collapse Button */}
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(true)}
            className="absolute top-4 left-72 z-40"
          >
            ←
          </Button>
        )}

        {/* Debug Panel */}
        <AppDebug
          selectedField={selectedField}
          mapState={mapState}
          isVisible={showDebug}
          onToggle={toggleDebug}
        />

        {/* Toast Notifications */}
        <Toaster />
      </div>
  );
}

export default App;