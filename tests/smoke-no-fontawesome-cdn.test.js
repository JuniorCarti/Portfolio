/**
 * Smoke Test: No Font Awesome CDN Reference
 * Validates: Requirement 3.3
 *
 * Asserts that no `cdnjs.cloudflare.com/ajax/libs/font-awesome` string exists
 * in `index.html`, `css/style.css`, or `js/script.js`.
 *
 * Run: node tests/smoke-no-fontawesome-cdn.test.js
 */

const fs = require('fs');
const path = require('path');

const FORBIDDEN_STRING = 'cdnjs.cloudflare.com/ajax/libs/font-awesome';

const ROOT = path.resolve(__dirname, '..');

const FILES_TO_CHECK = [
  'index.html',
  'css/style.css',
  'js/script.js'
];

let passed = 0;
let failed = 0;

for (const file of FILES_TO_CHECK) {
  const filePath = path.join(ROOT, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  SKIP: ${file} does not exist`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(FORBIDDEN_STRING)) {
    console.log(`❌ FAIL: ${file} contains Font Awesome CDN reference`);
    failed++;
  } else {
    console.log(`✅ PASS: ${file} — no Font Awesome CDN reference found`);
    passed++;
  }
}

console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);

if (failed > 0) {
  process.exit(1);
}

console.log('\nSmoke test passed: No Font Awesome CDN references remain.');
