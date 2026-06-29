/**
 * Smoke Test: Experience Section DOM Order and Navigation
 * Validates Requirements 26.1 and 26.4
 *
 * Run: node tests/smoke-experience.js
 *
 * Asserts:
 *   - id="experience" appears after id="skills" and before id="education" in the DOM
 *   - An href="#experience" link exists in the desktop navbar (nav-link)
 *   - An href="#experience" link exists in the mobile menu (mobile-nav-link)
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

// Test 1: #experience appears after #skills and before #education in DOM order
const skillsPos = html.search(/id\s*=\s*["']skills["']/);
const experiencePos = html.search(/id\s*=\s*["']experience["']/);
const educationPos = html.search(/id\s*=\s*["']education["']/);

assert(
    skillsPos !== -1 && experiencePos !== -1 && educationPos !== -1,
    'All three section IDs (skills, experience, education) exist in index.html'
);

assert(
    skillsPos < experiencePos && experiencePos < educationPos,
    '#experience appears between #skills and #education in DOM order'
);

// Test 2: "Experience" link present in desktop nav (nav-link class)
// Look for an <a> with href="#experience" and class containing "nav-link" (but not "mobile-nav-link")
const desktopNavLinkRegex = /<a[^>]*href\s*=\s*["']#experience["'][^>]*class\s*=\s*["'][^"']*\bnav-link\b[^"']*["'][^>]*>|<a[^>]*class\s*=\s*["'][^"']*\bnav-link\b[^"']*["'][^>]*href\s*=\s*["']#experience["'][^>]*>/;
const desktopMatches = html.match(desktopNavLinkRegex);
assert(
    desktopMatches !== null,
    'href="#experience" link with class "nav-link" exists in desktop navbar'
);

// Test 3: "Experience" link present in mobile menu (mobile-nav-link class)
const mobileNavLinkRegex = /<a[^>]*href\s*=\s*["']#experience["'][^>]*class\s*=\s*["'][^"']*\bmobile-nav-link\b[^"']*["'][^>]*>|<a[^>]*class\s*=\s*["'][^"']*\bmobile-nav-link\b[^"']*["'][^>]*href\s*=\s*["']#experience["'][^>]*>/;
const mobileMatches = html.match(mobileNavLinkRegex);
assert(
    mobileMatches !== null,
    'href="#experience" link with class "mobile-nav-link" exists in mobile menu'
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
