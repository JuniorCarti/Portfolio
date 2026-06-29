/**
 * Property Test: Skill Cards Have Tags and No Progress Bars (Property 5)
 * Validates: Requirements 9.1, 9.3, 17.1, 17.2
 *
 * Run: node tests/smoke-skill-cards.js
 *
 * For each .skill-card, asserts:
 *   1. At least one .skill-tag child exists with non-empty text content
 *   2. No .progress-bar, .progress-fill, or .progress-text classes exist
 *   3. No percentage strings (like "90%", "85%") appear in skill card text content
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

// Extract all skill-card blocks from the HTML
// Each skill-card starts with <div class="skill-card ..."> and ends at the next closing </div> at the same nesting level
function extractSkillCards(html) {
    const cards = [];
    const cardStartRegex = /<div\s+class\s*=\s*["'][^"']*\bskill-card\b[^"']*["'][^>]*>/gi;
    let match;

    while ((match = cardStartRegex.exec(html)) !== null) {
        const startIndex = match.index;
        // Find the matching closing tag by counting nested divs
        let depth = 1;
        let pos = startIndex + match[0].length;
        while (depth > 0 && pos < html.length) {
            const openDiv = html.indexOf('<div', pos);
            const closeDiv = html.indexOf('</div>', pos);

            if (closeDiv === -1) break;

            if (openDiv !== -1 && openDiv < closeDiv) {
                // Check it's actually an opening div tag (not <divider or similar)
                const afterOpen = html[openDiv + 4];
                if (afterOpen === ' ' || afterOpen === '>' || afterOpen === '\n' || afterOpen === '\r' || afterOpen === '\t') {
                    depth++;
                    pos = openDiv + 4;
                } else {
                    pos = openDiv + 4;
                }
            } else {
                depth--;
                if (depth === 0) {
                    cards.push(html.substring(startIndex, closeDiv + 6));
                }
                pos = closeDiv + 6;
            }
        }
    }
    return cards;
}

const skillCards = extractSkillCards(html);

// Verify we found skill cards
assert(skillCards.length > 0, `Found ${skillCards.length} skill-card elements in the DOM`);

// Test 1: Each skill-card has at least one .skill-tag with non-empty text
const skillTagRegex = /<span\s+[^>]*\bclass\s*=\s*["'][^"']*\bskill-tag\b[^"']*["'][^>]*>([^<]+)<\/span>/gi;

skillCards.forEach((card, index) => {
    const tags = [];
    let tagMatch;
    const localRegex = new RegExp(skillTagRegex.source, 'gi');
    while ((tagMatch = localRegex.exec(card)) !== null) {
        const textContent = tagMatch[1].trim();
        if (textContent.length > 0) {
            tags.push(textContent);
        }
    }
    assert(
        tags.length > 0,
        `Skill card #${index + 1} has ${tags.length} skill-tag(s) with non-empty text`
    );
});

// Test 2: No .progress-bar, .progress-fill, or .progress-text classes exist in any skill card
const progressClasses = ['progress-bar', 'progress-fill', 'progress-text'];

skillCards.forEach((card, index) => {
    progressClasses.forEach((cls) => {
        const regex = new RegExp(`\\b${cls}\\b`);
        assert(
            !regex.test(card),
            `Skill card #${index + 1} has no .${cls} element`
        );
    });
});

// Test 3: No percentage strings (like "90%", "85%") appear in skill card text content
// Strip HTML tags to get text content only, then check for digit+% patterns
function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, ' ');
}

const percentRegex = /\d+%/;

skillCards.forEach((card, index) => {
    const textContent = stripHtmlTags(card);
    assert(
        !percentRegex.test(textContent),
        `Skill card #${index + 1} contains no percentage strings in text content`
    );
});

// Summary
console.log('');
const total = passed + failed;
if (failed === 0) {
    console.log(`\x1b[32m${passed}/${total} tests passed — All green!\x1b[0m`);
} else {
    console.log(`\x1b[31m${passed}/${total} tests passed — ${failed} FAILED\x1b[0m`);
    process.exit(1);
}
