/**
 * Smoke Test: Footer Structure
 * Validates Requirements 28.1, 28.3, 28.4
 *
 * Run: node tests/smoke-footer.js
 *
 * Asserts:
 *   - Footer nav link count ≤ 3
 *   - No email or phone text node in footer
 *   - All footer social icon <a> elements have non-empty aria-label
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

// Extract footer content (between <footer and </footer>)
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
assert(footerMatch !== null, '<footer> element exists in index.html');

const footer = footerMatch ? footerMatch[0] : '';

// Test 1: Footer nav link count ≤ 3
// Count elements with class "footer-link" or links inside a footer nav area
const footerLinks = footer.match(/<a[^>]*class\s*=\s*["'][^"']*\bfooter-link\b[^"']*["'][^>]*>/g) || [];
assert(
    footerLinks.length <= 3,
    `Footer nav link count (${footerLinks.length}) is ≤ 3`
);

// Test 2: No email addresses or phone numbers appear as text in footer
// Check for email pattern (e.g., ridgejunior204@gmail.com or any user@domain)
const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// Strip HTML tags to get text content only
const footerText = footer.replace(/<[^>]*>/g, ' ');
const hasEmail = emailPattern.test(footerText);
assert(
    !hasEmail,
    'No email address text node found in footer'
);

// Check for phone number patterns (e.g., +254..., 0712..., (254)..., digits with dashes/spaces)
const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
const hasPhone = phonePattern.test(footerText);
assert(
    !hasPhone,
    'No phone number text node found in footer'
);

// Test 3: All footer social icon <a> elements have non-empty aria-label
// Match all <a> elements with class containing "footer-social-icon"
const socialIconRegex = /<a[^>]*class\s*=\s*["'][^"']*\bfooter-social-icon\b[^"']*["'][^>]*>/g;
const socialIcons = footer.match(socialIconRegex) || [];

assert(
    socialIcons.length > 0,
    `Footer contains social icon links (found ${socialIcons.length})`
);

let allHaveAriaLabel = true;
const missingLabels = [];
socialIcons.forEach((iconTag, index) => {
    const ariaLabelMatch = iconTag.match(/aria-label\s*=\s*["']([^"']+)["']/);
    if (!ariaLabelMatch || ariaLabelMatch[1].trim() === '') {
        allHaveAriaLabel = false;
        missingLabels.push(`Social icon #${index + 1}`);
    }
});

assert(
    allHaveAriaLabel,
    missingLabels.length === 0
        ? 'All footer social icon <a> elements have non-empty aria-label'
        : `Missing aria-label on: ${missingLabels.join(', ')}`
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
