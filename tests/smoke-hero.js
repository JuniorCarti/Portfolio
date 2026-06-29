/**
 * Smoke Test: Hero Section Content
 * Validates Requirements 21.1, 23.1, 22.1, 24.3, 24.4
 *
 * Run: node tests/smoke-hero.js
 *
 * Asserts:
 *   - <h1> text contains "Ridge Junior Abuto"
 *   - Hero description word count ≤ 30 and does not include "A passionate"
 *   - Download CV <a> with download attribute present in .hero-cta
 *   - .availability-badge element present in hero section
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

// Test 1: <h1> text contains "Ridge Junior Abuto"
// Extract text content between <h1 ...> and </h1>
const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const h1Text = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').trim() : '';
assert(
    h1Text.includes('Ridge Junior Abuto'),
    `<h1> contains "Ridge Junior Abuto" (found: "${h1Text}")`
);

// Test 2: Hero description word count ≤ 30 and does not include "A passionate"
const descMatch = html.match(/<p\s+class\s*=\s*["']hero-description["'][^>]*>([\s\S]*?)<\/p>/i);
const descText = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : '';
const wordCount = descText.split(/\s+/).filter(w => w.length > 0).length;

assert(
    wordCount <= 30,
    `Hero description is ≤ 30 words (found: ${wordCount} words)`
);
assert(
    !descText.toLowerCase().includes('a passionate'),
    `Hero description does not contain "A passionate"`
);

// Test 3: Download CV <a> with download attribute present in .hero-cta
// Extract the .hero-cta block and look for an <a> with download attribute
const ctaMatch = html.match(/<div\s+class\s*=\s*["']hero-cta["'][^>]*>([\s\S]*?)<\/div>/i);
const ctaHtml = ctaMatch ? ctaMatch[1] : '';
const hasDownloadLink = /<a\b[^>]*\bdownload\b[^>]*>[\s\S]*?<\/a>/i.test(ctaHtml);

assert(
    hasDownloadLink,
    'Download CV <a> with download attribute present in .hero-cta'
);

// Test 4: .availability-badge element present in hero section
const hasBadge = /class\s*=\s*["'][^"']*availability-badge[^"']*["']/.test(html);
assert(
    hasBadge,
    '.availability-badge element present in hero section'
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
