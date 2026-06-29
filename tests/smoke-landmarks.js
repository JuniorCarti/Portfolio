/**
 * Smoke Test: Landmark Structure and Alt Attributes
 * Validates Requirements 31.2 and 31.4
 *
 * Run: node tests/smoke-landmarks.js
 *
 * Asserts:
 *   - <main id="main-content"> exists
 *   - <header> wrapper exists
 *   - <footer> wrapper exists
 *   - Every <img> element has an alt attribute (may be empty for decorative images)
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

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

// Test 1: <main id="main-content"> exists
assert(
    /<main[^>]*\bid\s*=\s*["']main-content["'][^>]*>/.test(html),
    '<main id="main-content"> exists'
);

// Test 2: <header> element exists
assert(
    /<header[\s>]/.test(html),
    '<header> element exists'
);

// Test 3: <footer> element exists
assert(
    /<footer[\s>]/.test(html),
    '<footer> element exists'
);

// Test 4: Every <img> element has an alt attribute
// Find all <img ...> tags and check each has alt="..."
const imgRegex = /<img\b[^>]*>/gi;
const imgTags = html.match(imgRegex) || [];
const missingAlt = [];

imgTags.forEach((tag, index) => {
    if (!/\balt\s*=/.test(tag)) {
        // Extract src for identification
        const srcMatch = tag.match(/\bsrc\s*=\s*["']([^"']*?)["']/);
        const src = srcMatch ? srcMatch[1] : `(img #${index + 1})`;
        missingAlt.push(src);
    }
});

if (imgTags.length === 0) {
    assert(true, 'No <img> elements found (nothing to check)');
} else if (missingAlt.length === 0) {
    assert(true, `All ${imgTags.length} <img> elements have an alt attribute`);
} else {
    assert(false, `${missingAlt.length} of ${imgTags.length} <img> elements missing alt attribute: ${missingAlt.join(', ')}`);
}

// Summary
console.log('');
const total = passed + failed;
if (failed === 0) {
    console.log(`\x1b[32m${passed}/${total} tests passed — All green!\x1b[0m`);
} else {
    console.log(`\x1b[31m${passed}/${total} tests passed — ${failed} FAILED\x1b[0m`);
    process.exit(1);
}
