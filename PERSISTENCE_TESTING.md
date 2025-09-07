# State Persistence Testing Documentation

## Overview

The NDVI Vision application implements a comprehensive state persistence system using a custom `useKV` hook that provides localStorage-based persistence for React components. This document outlines the testing strategy and results for ensuring all state persistence works correctly.

## Implementation Details

### useKV Hook

The `useKV` hook is located at `src/hooks/useKV.ts` and provides the following features:

- **Persistent State**: Automatically saves and restores state from localStorage
- **Functional Updates**: Supports both direct value updates and function-based updates
- **Cross-Tab Synchronization**: Listens for storage events to sync state across browser tabs
- **Error Handling**: Gracefully handles localStorage errors and JSON parsing issues
- **TypeScript Support**: Fully typed with generic type parameters

### Key Storage Format

All persistent keys use the prefix `spark-kv:` followed by the key name:
- `spark-kv:selected-field-id` - Currently selected field ID
- `spark-kv:selected-year` - Currently selected year
- `spark-kv:selected-month` - Currently selected month

## Test Suites

### 1. State Persistence Test (`StatePersistenceTest.tsx`)

**Purpose**: Comprehensive testing of the useKV hook with various data types and edge cases.

**Test Cases**:
- String persistence and retrieval
- Number persistence and retrieval  
- Boolean persistence and retrieval
- Array persistence and retrieval
- Object persistence and retrieval
- Null value persistence and retrieval
- App-specific field selection persistence
- Year selection persistence
- Month selection persistence
- Functional updates (using callback functions)
- Array functional updates

**Access**: Available via test mode in the application (click the test tube icon in the footer)

### 2. Integration Test (`IntegrationTest.tsx`)

**Purpose**: Real-world testing of useKV hook integration with actual app state management.

**Test Cases**:
- Field selection integration workflow
- Time selection integration (year + month)
- State synchronization across multiple hook instances
- Complex state transitions simulating user interactions
- Performance testing with rapid state changes

**Metrics Tracked**:
- Test execution duration
- Success/failure rates
- State consistency across operations

### 3. Verification Script (`verify-persistence.js`)

**Purpose**: Programmatic verification of localStorage operations without React dependencies.

**Coverage**:
- Basic localStorage operations
- JSON serialization/deserialization
- Error handling with invalid data
- Complex nested object storage
- Key removal operations

## Running Tests

### In-Application Testing

1. Open the NDVI Vision application
2. Click the test tube icon (🧪) in the footer
3. Select either "State Persistence Test" or "Integration Test"
4. Click "Run Tests" to execute the test suite
5. Review results and verify all tests pass

### Programmatic Verification

```bash
node src/tests/verify-persistence.js
```

## App State Usage

The following components use persistent state via `useKV`:

### App.tsx (Main Component)
```typescript
const [selectedFieldId, setSelectedFieldId] = useKV('selected-field-id', null as string | null);
const [selectedYear, setSelectedYear] = useKV('selected-year', new Date().getFullYear());
const [selectedMonth, setSelectedMonth] = useKV('selected-month', null as number | null);
```

### Usage Pattern
```typescript
// Direct value updates
setSelectedYear(2023);

// Functional updates (recommended for arrays/objects)
setSelectedMonth(prev => prev === 6 ? null : 6);
```

## Persistence Behavior

### What Persists
- ✅ User's selected field across sessions
- ✅ Current year selection
- ✅ Current month selection (when selected)
- ✅ All changes are immediately persisted to localStorage
- ✅ State is restored when the app loads

### What Doesn't Persist
- ❌ Map viewport position (center/zoom) - considered temporary UI state
- ❌ Debug panel visibility
- ❌ Sidebar collapse state
- ❌ Loading states and temporary UI states
- ❌ API responses and cached data

## Browser Compatibility

The persistence system works in all modern browsers that support:
- localStorage API
- JSON.parse/stringify
- Storage events (for cross-tab sync)
- React hooks

### Fallback Behavior
If localStorage is unavailable (private browsing, storage quota exceeded):
- Hook gracefully degrades to in-memory state
- Application functionality remains intact
- Warning logged to console

## Troubleshooting

### Common Issues

1. **State not persisting**
   - Check browser storage quota
   - Verify no private browsing mode
   - Check console for localStorage errors

2. **State reset on refresh**
   - Verify localStorage contains `spark-kv:` prefixed keys
   - Check for JSON parsing errors in console

3. **Cross-tab sync not working**
   - Storage events only fire in other tabs, not the originating tab
   - Use browser dev tools to manually trigger storage events

### Debugging Commands

```javascript
// View all persistent keys
Object.keys(localStorage).filter(key => key.startsWith('spark-kv:'));

// Clear all app state
Object.keys(localStorage)
  .filter(key => key.startsWith('spark-kv:'))
  .forEach(key => localStorage.removeItem(key));

// View specific state
JSON.parse(localStorage.getItem('spark-kv:selected-field-id'));
```

## Performance Considerations

- localStorage operations are synchronous but fast
- JSON serialization happens on every state change
- Storage events may have slight delay across tabs
- Large objects (>1MB) may impact performance

## Security Notes

- All data is stored in browser localStorage (client-side only)
- No sensitive information (API keys, tokens) should be stored via useKV
- Data persists until explicitly cleared or browser storage is cleared
- Data is specific to the origin (domain + protocol + port)

## Future Enhancements

Potential improvements to the persistence system:
- Add compression for large objects
- Implement storage quota monitoring
- Add encryption for sensitive data
- Batch updates to reduce storage operations
- Add TTL (time-to-live) for certain keys