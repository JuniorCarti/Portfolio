/**
 * Smoke Test: Dead Code Removal
 * Validates Requirements 20.2, 20.3
 *
 * Run: node tests/smoke-dead-code.js
 *
 * Asserts:
 *   - `initCounterAnimation` identifier does NOT exist in js/script.js
 *   - No `setTimeout` with 1500ms argument wrapping `initScrollAnimations` exists
 *   - `initProgressBars` identifier does NOT exist in js/script.js
 */

const fs = require('fs');
const path = require('path');

const scriptPath = path.resolve(__dirname, '..', 'js', 'script.js');
const js = fs.readFileSync(scriptPath, 'utf8');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log('\x1b[32m✓ PASS\x1b[0m —', message);
        passed++;
    } else {
        console.log('\x1b[31m✗ FAIL\x1b[0m —', message);
        failed++;
    }
}

// Test 1: `initCounterAnimation` identifier does NOT exist
assert(
    !js.includes('initCounterAnimation'),
    'initCounterAnimation identifier does not exist in js/script.js'
);

// Test 2: No setTimeout with 1500ms wrapping initScrollAnimations
// Matches patterns like: setTimeout(() => { initScrollAnimations(); }, 1500)
// or: setTimeout(function() { initScrollAnimations(); }, 1500)
const setTimeoutPattern = /setTimeout\s*\(\s*(?:function\s*\(\s*\)|(?:\(\s*\))?\s*=>)\s*\{[^}]*initScrollAnimations[^}]*\}\s*,\s*1500\s*\)/;
assert(
    !setTimeoutPattern.test(js),
    'No setTimeout with 1500ms wrapping initScrollAnimations'
);

// Test 3: `initProgressBars` identifier does NOT exist
assert(
    !js.includes('initProgressBars'),
    'initProgressBars identifier does not exist in js/script.js'
);

// Summary
console.log('');
const total = passed + failed;
if (failed === 0) {
    console.log(`\x1b[32m${passed}/${total} tests passed — All green!\x1b[0m`);
} else {
    console.log(`\x1b[31m${passed}/${total} tests passed — ${failed} FAILED\x1b[0m`);
    process.exit(1);
}
