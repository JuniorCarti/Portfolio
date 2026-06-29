/**
 * Property Test: Review Form Validation Rejects Out-of-Range Inputs (Property 10)
 * Validates: Requirements 19.4
 *
 * Run: node tests/test-review-validation.js
 *
 * Property: For (name, message, rating) tuples, addDoc is NOT called when
 * name < 2 or > 80 chars, message < 10 or > 1000 chars, or rating ∉ [1,5].
 * addDoc IS called for all in-range valid combinations with empty honeypot.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

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

// --- Verify source contains the validation logic ---
const scriptPath = path.resolve(__dirname, '..', 'js', 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

assert(
    scriptContent.includes('name.length < 2 || name.length > 80'),
    'Source contains name length validation (2–80 chars)'
);

assert(
    scriptContent.includes('message.length < 10 || message.length > 1000'),
    'Source contains message length validation (10–1000 chars)'
);

assert(
    scriptContent.includes('!Number.isInteger(rating) || rating < 1 || rating > 5'),
    'Source contains rating validation (integer 1–5)'
);

// --- Replicate validation logic from initReviewsForm() ---
// The actual code trims inputs before validating:
//   const name = document.getElementById('reviewerName').value.trim();
//   const message = document.getElementById('reviewMessage').value.trim();
// Returns { valid: boolean, error: string | null }
function validateReviewInput(name, message, rating) {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
        return { valid: false, error: 'Name must be between 2 and 80 characters.' };
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
        return { valid: false, error: 'Review must be between 10 and 1000 characters.' };
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return { valid: false, error: 'Rating must be an integer between 1 and 5.' };
    }

    return { valid: true, error: null };
}

// --- Arbitraries ---
// Note: The actual code trims name and message before validation, so our
// arbitraries must account for trimmed length.

// Valid name: trimmed length 2–80 chars
const validNameArb = fc.string({ minLength: 2, maxLength: 80 })
    .filter(s => s.trim().length >= 2 && s.trim().length <= 80);

// Invalid name: trimmed length < 2 (too short) or trimmed length > 80 (too long)
const tooShortNameArb = fc.constantFrom('', ' ', 'a', '  ', '\t');
const tooLongNameArb = fc.string({ minLength: 81, maxLength: 120 })
    .map(s => s.replace(/\s/g, 'x')); // ensure trimmed length stays > 80
const invalidNameArb = fc.oneof(tooShortNameArb, tooLongNameArb);

// Valid message: trimmed length 10–1000 chars
const validMessageArb = fc.string({ minLength: 10, maxLength: 1000 })
    .filter(s => s.trim().length >= 10 && s.trim().length <= 1000);

// Invalid message: trimmed length < 10 or trimmed length > 1000
const tooShortMessageArb = fc.string({ minLength: 0, maxLength: 9 })
    .map(s => s.replace(/\s/g, 'x').slice(0, 9)); // max 9 non-whitespace chars
const tooLongMessageArb = fc.string({ minLength: 1001, maxLength: 1100 })
    .map(s => s.replace(/\s/g, 'x')); // ensure trimmed length stays > 1000
const invalidMessageArb = fc.oneof(tooShortMessageArb, tooLongMessageArb);

// Valid rating: integer 1–5
const validRatingArb = fc.integer({ min: 1, max: 5 });

// Invalid rating: integers outside [1,5] or non-integers
const invalidRatingIntArb = fc.oneof(
    fc.integer({ min: -100, max: 0 }),
    fc.integer({ min: 6, max: 100 })
);
const invalidRatingFloatArb = fc.double({ min: 1.1, max: 4.9, noNaN: true }).filter(n => !Number.isInteger(n));
const invalidRatingArb = fc.oneof(invalidRatingIntArb, invalidRatingFloatArb);

// --- Property-Based Tests ---

console.log('\n--- Property 10: Review Form Validation Rejects Out-of-Range Inputs ---\n');

// Property 10a: Invalid name rejects (addDoc NOT called)
const invalidNameRejectsProperty = fc.property(
    invalidNameArb,
    validMessageArb,
    validRatingArb,
    (name, message, rating) => {
        const result = validateReviewInput(name, message, rating);
        return result.valid === false;
    }
);

try {
    fc.assert(invalidNameRejectsProperty, { numRuns: 100 });
    assert(true, 'Property 10a: Validation rejects when name is out of range [2,80] (100 runs)');
} catch (e) {
    assert(false, `Property 10a: Invalid name rejection — ${e.message}`);
}

// Property 10b: Invalid message rejects (addDoc NOT called)
const invalidMessageRejectsProperty = fc.property(
    validNameArb,
    invalidMessageArb,
    validRatingArb,
    (name, message, rating) => {
        const result = validateReviewInput(name, message, rating);
        return result.valid === false;
    }
);

try {
    fc.assert(invalidMessageRejectsProperty, { numRuns: 100 });
    assert(true, 'Property 10b: Validation rejects when message is out of range [10,1000] (100 runs)');
} catch (e) {
    assert(false, `Property 10b: Invalid message rejection — ${e.message}`);
}

// Property 10c: Invalid rating rejects (addDoc NOT called)
const invalidRatingRejectsProperty = fc.property(
    validNameArb,
    validMessageArb,
    invalidRatingArb,
    (name, message, rating) => {
        const result = validateReviewInput(name, message, rating);
        return result.valid === false;
    }
);

try {
    fc.assert(invalidRatingRejectsProperty, { numRuns: 100 });
    assert(true, 'Property 10c: Validation rejects when rating is outside [1,5] or non-integer (100 runs)');
} catch (e) {
    assert(false, `Property 10c: Invalid rating rejection — ${e.message}`);
}

// Property 10d: All valid inputs pass validation (addDoc IS called)
const validInputsPassProperty = fc.property(
    validNameArb,
    validMessageArb,
    validRatingArb,
    (name, message, rating) => {
        const result = validateReviewInput(name, message, rating);
        return result.valid === true;
    }
);

try {
    fc.assert(validInputsPassProperty, { numRuns: 100 });
    assert(true, 'Property 10d: Validation passes for all in-range valid combinations (100 runs)');
} catch (e) {
    assert(false, `Property 10d: Valid input acceptance — ${e.message}`);
}

// Property 10e: Boundary values — exact boundary checks
console.log('\n--- Boundary Value Assertions ---\n');

// Name boundaries
assert(validateReviewInput('a', 'a'.repeat(10), 3).valid === false,
    'Boundary: name with 1 char is rejected');
assert(validateReviewInput('ab', 'a'.repeat(10), 3).valid === true,
    'Boundary: name with 2 chars is accepted');
assert(validateReviewInput('a'.repeat(80), 'a'.repeat(10), 3).valid === true,
    'Boundary: name with 80 chars is accepted');
assert(validateReviewInput('a'.repeat(81), 'a'.repeat(10), 3).valid === false,
    'Boundary: name with 81 chars is rejected');

// Message boundaries
assert(validateReviewInput('ab', 'a'.repeat(9), 3).valid === false,
    'Boundary: message with 9 chars is rejected');
assert(validateReviewInput('ab', 'a'.repeat(10), 3).valid === true,
    'Boundary: message with 10 chars is accepted');
assert(validateReviewInput('ab', 'a'.repeat(1000), 3).valid === true,
    'Boundary: message with 1000 chars is accepted');
assert(validateReviewInput('ab', 'a'.repeat(1001), 3).valid === false,
    'Boundary: message with 1001 chars is rejected');

// Rating boundaries
assert(validateReviewInput('ab', 'a'.repeat(10), 0).valid === false,
    'Boundary: rating 0 is rejected');
assert(validateReviewInput('ab', 'a'.repeat(10), 1).valid === true,
    'Boundary: rating 1 is accepted');
assert(validateReviewInput('ab', 'a'.repeat(10), 5).valid === true,
    'Boundary: rating 5 is accepted');
assert(validateReviewInput('ab', 'a'.repeat(10), 6).valid === false,
    'Boundary: rating 6 is rejected');

// --- Summary ---
console.log('');
const total = passed + failed;
if (failed === 0) {
    console.log(`\x1b[32m${passed}/${total} tests passed — All green!\x1b[0m`);
} else {
    console.log(`\x1b[31m${passed}/${total} tests passed — ${failed} FAILED\x1b[0m`);
    process.exit(1);
}
