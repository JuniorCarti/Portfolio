/**
 * Smoke Test: Contact Form Live Region and ARIA Wiring
 * Validates Requirements 11.1, 11.5
 *
 * Run: node tests/smoke-contact-form.js
 *
 * Asserts:
 *   - #formStatus element has aria-live="polite" and role="status" in static HTML
 *   - #name input has aria-describedby="nameError"
 *   - #email input has aria-describedby="emailError"
 *   - #subject input has aria-describedby="subjectError"
 *   - #message textarea has aria-describedby="messageError"
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

// Test 1: #formStatus has aria-live="polite" and role="status"
const formStatusMatch = html.match(/<[^>]*\bid\s*=\s*["']formStatus["'][^>]*>/);
const formStatusTag = formStatusMatch ? formStatusMatch[0] : '';
const hasAriaLive = /\baria-live\s*=\s*["']polite["']/.test(formStatusTag);
const hasRoleStatus = /\brole\s*=\s*["']status["']/.test(formStatusTag);
assert(
    hasAriaLive && hasRoleStatus,
    '#formStatus has both aria-live="polite" and role="status" attributes'
);

// Test 2: #name input has aria-describedby="nameError"
const nameMatch = html.match(/<input[^>]*\bid\s*=\s*["']name["'][^>]*>/);
const nameTag = nameMatch ? nameMatch[0] : '';
assert(
    /\baria-describedby\s*=\s*["']nameError["']/.test(nameTag),
    '#name input has aria-describedby="nameError"'
);

// Test 3: #email input has aria-describedby="emailError"
const emailMatch = html.match(/<input[^>]*\bid\s*=\s*["']email["'][^>]*>/);
const emailTag = emailMatch ? emailMatch[0] : '';
assert(
    /\baria-describedby\s*=\s*["']emailError["']/.test(emailTag),
    '#email input has aria-describedby="emailError"'
);

// Test 4: #subject input has aria-describedby="subjectError"
const subjectMatch = html.match(/<input[^>]*\bid\s*=\s*["']subject["'][^>]*>/);
const subjectTag = subjectMatch ? subjectMatch[0] : '';
assert(
    /\baria-describedby\s*=\s*["']subjectError["']/.test(subjectTag),
    '#subject input has aria-describedby="subjectError"'
);

// Test 5: #message textarea has aria-describedby="messageError"
const messageMatch = html.match(/<textarea[^>]*\bid\s*=\s*["']message["'][^>]*>/);
const messageTag = messageMatch ? messageMatch[0] : '';
assert(
    /\baria-describedby\s*=\s*["']messageError["']/.test(messageTag),
    '#message textarea has aria-describedby="messageError"'
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
