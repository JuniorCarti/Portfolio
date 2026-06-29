/**
 * Smoke Test: Honeypot and ARIA Attributes in Review Form
 * Validates Requirements 10.1, 11.1, 19.1
 *
 * Run: node tests/smoke-review-form.js
 *
 * Asserts:
 *   - A hidden input with name="website" and tabindex="-1" exists inside #reviewForm
 *   - #photoURL input has aria-describedby="photoHint" attribute
 *   - #reviewFormStatus has both aria-live="polite" and role="status" attributes
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

// Extract the #reviewForm block from the HTML
const reviewFormMatch = html.match(/<form[^>]*\bid\s*=\s*["']reviewForm["'][^>]*>([\s\S]*?)<\/form>/);
const reviewFormHtml = reviewFormMatch ? reviewFormMatch[0] : '';

// Test 1: input[name="website"][tabindex="-1"] exists inside #reviewForm
const honeypotRegex = /<input[^>]*\bname\s*=\s*["']website["'][^>]*\btabindex\s*=\s*["']-1["'][^>]*>/;
const honeypotRegexAlt = /<input[^>]*\btabindex\s*=\s*["']-1["'][^>]*\bname\s*=\s*["']website["'][^>]*>/;
assert(
    honeypotRegex.test(reviewFormHtml) || honeypotRegexAlt.test(reviewFormHtml),
    'input[name="website"][tabindex="-1"] exists inside #reviewForm'
);

// Test 2: #photoURL has aria-describedby="photoHint" attribute
const photoURLMatch = reviewFormHtml.match(/<input[^>]*\bid\s*=\s*["']photoURL["'][^>]*>/);
const photoURLTag = photoURLMatch ? photoURLMatch[0] : '';
assert(
    /\baria-describedby\s*=\s*["']photoHint["']/.test(photoURLTag),
    '#photoURL has aria-describedby="photoHint" attribute'
);

// Test 3: #reviewFormStatus has aria-live="polite" and role="status"
const statusMatch = html.match(/<[^>]*\bid\s*=\s*["']reviewFormStatus["'][^>]*>/);
const statusTag = statusMatch ? statusMatch[0] : '';
const hasAriaLive = /\baria-live\s*=\s*["']polite["']/.test(statusTag);
const hasRoleStatus = /\brole\s*=\s*["']status["']/.test(statusTag);
assert(
    hasAriaLive && hasRoleStatus,
    '#reviewFormStatus has both aria-live="polite" and role="status" attributes'
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
