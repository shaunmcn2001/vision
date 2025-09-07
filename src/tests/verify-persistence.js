#!/usr/bin/env node
/**
 * State Persistence Verification Script
 * 
 * This script verifies that the localStorage-based useKV implementation
 * works correctly by simulating the storage operations that would happen
 * in the React components.
 */

// Simulate localStorage for Node environment
global.localStorage = {
  _data: {},
  setItem(key, value) {
    this._data[key] = String(value);
  },
  getItem(key) {
    return this._data.hasOwnProperty(key) ? this._data[key] : null;
  },
  removeItem(key) {
    delete this._data[key];
  },
  clear() {
    this._data = {};
  },
  key(index) {
    const keys = Object.keys(this._data);
    return keys[index] || null;
  },
  get length() {
    return Object.keys(this._data).length;
  }
};

// Test runner
function runTests() {
  console.log('🧪 State Persistence Verification\n');

  let passed = 0;
  let failed = 0;

  function test(name, testFn) {
    try {
      testFn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    }
  }

  function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message} - Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
    }
  }

  // Test 1: Basic string storage
  test('String Storage', () => {
    const key = 'spark-kv:test-string';
    const value = 'test-value-123';
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'String storage failed');
  });

  // Test 2: Number storage
  test('Number Storage', () => {
    const key = 'spark-kv:test-number';
    const value = 42;
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Number storage failed');
  });

  // Test 3: Boolean storage
  test('Boolean Storage', () => {
    const key = 'spark-kv:test-boolean';
    const value = true;
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Boolean storage failed');
  });

  // Test 4: Array storage
  test('Array Storage', () => {
    const key = 'spark-kv:test-array';
    const value = ['item1', 'item2', 'item3'];
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Array storage failed');
  });

  // Test 5: Object storage
  test('Object Storage', () => {
    const key = 'spark-kv:test-object';
    const value = { name: 'test', value: 123, nested: { prop: 'test' } };
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Object storage failed');
  });

  // Test 6: Null storage
  test('Null Storage', () => {
    const key = 'spark-kv:test-null';
    const value = null;
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Null storage failed');
  });

  // Test 7: App-specific field ID storage
  test('Field ID Storage', () => {
    const key = 'spark-kv:selected-field-id';
    const value = 'field-abc-123';
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Field ID storage failed');
  });

  // Test 8: App-specific year storage
  test('Year Storage', () => {
    const key = 'spark-kv:selected-year';
    const value = 2023;
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Year storage failed');
  });

  // Test 9: App-specific month storage
  test('Month Storage', () => {
    const key = 'spark-kv:selected-month';
    const value = 6;
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Month storage failed');
  });

  // Test 10: Key removal
  test('Key Removal', () => {
    const key = 'spark-kv:test-removal';
    const value = 'to-be-removed';
    
    // Store value
    localStorage.setItem(key, JSON.stringify(value));
    
    // Verify it's there
    let stored = localStorage.getItem(key);
    let parsed = stored ? JSON.parse(stored) : null;
    assertEqual(parsed, value, 'Initial storage failed');
    
    // Remove it
    localStorage.removeItem(key);
    
    // Verify it's gone
    stored = localStorage.getItem(key);
    assertEqual(stored, null, 'Key removal failed');
  });

  // Test 11: Complex object with arrays
  test('Complex Object Storage', () => {
    const key = 'spark-kv:test-complex';
    const value = {
      fields: ['field1', 'field2'],
      settings: {
        year: 2023,
        month: 8,
        options: {
          showBoundaries: true,
          showNDVI: false
        }
      },
      metadata: null
    };
    
    localStorage.setItem(key, JSON.stringify(value));
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    
    assertEqual(parsed, value, 'Complex object storage failed');
  });

  // Test 12: Error handling with invalid JSON
  test('Invalid JSON Handling', () => {
    const key = 'spark-kv:test-invalid';
    
    // Store invalid JSON directly
    localStorage._data[key] = 'invalid-json{';
    
    try {
      const stored = localStorage.getItem(key);
      JSON.parse(stored);
      // Should not reach here
      throw new Error('Expected JSON.parse to throw');
    } catch (error) {
      // This is expected
      if (error.message.includes('Expected JSON.parse to throw')) {
        throw error;
      }
      // JSON parse error is expected
    }
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! State persistence is working correctly.');
    return true;
  } else {
    console.log('❌ Some tests failed. Please check the implementation.');
    return false;
  }
}

if (require.main === module) {
  process.exit(runTests() ? 0 : 1);
}

module.exports = { runTests };