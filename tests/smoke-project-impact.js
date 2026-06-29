/**
 * Property Test: Every Project Card Has an Impact Metric (Property 13)
 * Validates: Requirements 27.1, 27.3
 *
 * Run: node tests/smoke-project-impact.js
 *
 * For each .project-card, asserts:
 *   1. Exactly one .project-impact child element exists
 *   2. Each .project-impact element has non-empty text content
 *   3. No images.unsplash.com URL exists in index.html
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

// Extract all project-card blocks from the HTML
function extractProjectCards(html) {
    const cards = [];
    const cardStartRegex = /<article\s+class\s*=\s*["'][^"']*\bproject-card\b[^"']*["'][^>]*>/gi;
    let match;

    while ((match = cardStartRegex.exec(html)) !== null) {
        const startIndex = match.index;
        // Find the matching closing </article> tag by counting nested articles
        let depth = 1;
        let pos = startIndex + match[0].length;
        while (depth > 0 && pos < html.length) {
            const openTag = html.indexOf('<article', pos);
            const closeTag = html.indexOf('</article>', pos);

            if (closeTag === -1) break;

            if (openTag !== -1 && openTag < closeTag) {
                depth++;
                pos = openTag + 8;
            } else {
                depth--;
                if (depth === 0) {
                    cards.push(html.substring(startIndex, closeTag + 10));
                }
                pos = closeTag + 10;
            }
        }
    }
    return cards;
}

const projectCards = extractProjectCards(html);

// Verify we found exactly 6 project cards
assert(projectCards.length === 6, `Found exactly 6 project-card elements (got ${projectCards.length})`);

// Test 1 & 2: Each project-card has exactly one .project-impact with non-empty text
const impactRegex = /<p\s+[^>]*\bclass\s*=\s*["'][^"']*\bproject-impact\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi;

projectCards.forEach((card, index) => {
    const impacts = [];
    let impactMatch;
    const localRegex = new RegExp(impactRegex.source, 'gi');
    while ((impactMatch = localRegex.exec(card)) !== null) {
        impacts.push(impactMatch[1].trim());
    }

    assert(
        impacts.length === 1,
        `Project card #${index + 1} has exactly one .project-impact element (got ${impacts.length})`
    );

    if (impacts.length > 0) {
        assert(
            impacts[0].length > 0,
            `Project card #${index + 1} .project-impact has non-empty text content`
        );
    } else {
        assert(
            false,
            `Project card #${index + 1} .project-impact has non-empty text content (no element found)`
        );
    }
});

// Test 3: No Unsplash URLs remain in index.html
const unsplashRegex = /images\.unsplash\.com/i;
assert(
    !unsplashRegex.test(html),
    'No images.unsplash.com URL exists in index.html'
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
