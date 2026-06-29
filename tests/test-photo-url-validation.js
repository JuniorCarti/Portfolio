/**
 * Property Test: Photo URL Validation on Blur (Property 11)
 * Validates: Requirements 10.3, 10.4
 *
 * Run: node tests/test-photo-url-validation.js
 *
 * Properties:
 * - Non-empty strings that do NOT start with "https://" produce a non-empty error on blur
 * - Empty strings produce no error on blur
 * - Valid "https://" strings produce no error on blur
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

// --- Replicate the blur validation logic from js/script.js ---
// The logic under test (identical to what's in initReviewsForm):
function validatePhotoURLOnBlur(inputValue, photoError) {
    const value = inputValue.trim();
    if (value && !value.startsWith('https://')) {
        photoError.textContent = 'Photo URL must start with https://';
    } else {
        photoError.textContent = '';
    }
}

// --- Verify the source file contains the same logic ---
const scriptPath = path.resolve(__dirname, '..', 'js', 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

assert(
    scriptContent.includes("photoURLInput.addEventListener('blur'"),
    'photoURL blur event listener exists in js/script.js'
);

assert(
    scriptContent.includes("!value.startsWith('https://')"),
    'Validation checks for https:// prefix in js/script.js'
);

assert(
    scriptContent.includes("photoError.textContent = 'Photo URL must start with https://'"),
    'Error message is set via textContent in js/script.js'
);

assert(
    scriptContent.includes("photoError.textContent = ''"),
    'Error is cleared via textContent when input is valid or empty in js/script.js'
);

// --- Minimal DOM mock ---
function createMockPhotoError() {
    return { textContent: '' };
}

// --- Property-Based Tests using fast-check ---

console.log('\n--- Property 11: Photo URL Validation on Blur ---\n');

// Property 11a: Non-empty non-https:// strings produce a non-empty error
// Generate strings that do NOT start with "https://"
const nonHttpsArbitrary = fc.oneof(
    // http:// prefix
    fc.string({ minLength: 1 }).map(s => 'http://' + s),
    // ftp:// prefix
    fc.string({ minLength: 1 }).map(s => 'ftp://' + s),
    // Random text (no protocol)
    fc.string({ minLength: 1, maxLength: 200 }).filter(s => {
        const trimmed = s.trim();
        return trimmed.length > 0 && !trimmed.startsWith('https://');
    }),
    // Tricky near-misses
    fc.constantFrom(
        'http://example.com',
        'https//example.com',
        'HTTPS://example.com',
        'hTTps://example.com',
        'ftp://secure.com',
        ' https://with-leading-space.com',
        'httpss://double-s.com'
    )
);

const nonHttpsErrorProperty = fc.property(nonHttpsArbitrary, (inputValue) => {
    const photoError = createMockPhotoError();
    validatePhotoURLOnBlur(inputValue, photoError);

    // After blur with a non-empty non-https:// value, error must be non-empty
    const trimmed = inputValue.trim();
    if (trimmed.length > 0 && !trimmed.startsWith('https://')) {
        return photoError.textContent.length > 0;
    }
    // If trimming makes it empty or it starts with https://, error should be cleared
    return photoError.textContent === '';
});

try {
    fc.assert(nonHttpsErrorProperty, { numRuns: 200 });
    assert(true, 'Property 11a: Non-https:// non-empty strings always produce an error message (200 runs)');
} catch (e) {
    assert(false, `Property 11a: Non-https error — ${e.message}`);
}

// Property 11b: Empty string on blur produces no error
const emptyStringArbitrary = fc.constantFrom('', '   ', '\t', '\n', '  \t  ');

const emptyNoErrorProperty = fc.property(emptyStringArbitrary, (inputValue) => {
    const photoError = createMockPhotoError();
    validatePhotoURLOnBlur(inputValue, photoError);

    // After blur with an empty (or whitespace-only) value, no error shown
    return photoError.textContent === '';
});

try {
    fc.assert(emptyNoErrorProperty, { numRuns: 100 });
    assert(true, 'Property 11b: Empty/whitespace-only strings produce no error message (100 runs)');
} catch (e) {
    assert(false, `Property 11b: Empty string no error — ${e.message}`);
}

// Property 11c: Valid https:// strings produce no error
const validHttpsArbitrary = fc.oneof(
    fc.webUrl({ withScheme: true }).map(url => 'https://' + url.replace(/^https?:\/\//, '')),
    fc.string({ minLength: 1, maxLength: 200 }).map(s => 'https://' + s.replace(/^\s+/, '')),
    fc.constantFrom(
        'https://example.com/photo.jpg',
        'https://cdn.images.io/user/avatar.png',
        'https://i.imgur.com/abc123.gif',
        'https://a.b'
    )
);

const validHttpsNoErrorProperty = fc.property(validHttpsArbitrary, (inputValue) => {
    const photoError = createMockPhotoError();
    validatePhotoURLOnBlur(inputValue, photoError);

    // After blur with a valid https:// value, error must be cleared
    return photoError.textContent === '';
});

try {
    fc.assert(validHttpsNoErrorProperty, { numRuns: 200 });
    assert(true, 'Property 11c: Valid https:// strings produce no error message (200 runs)');
} catch (e) {
    assert(false, `Property 11c: Valid https no error — ${e.message}`);
}

// Property 11d: The error message specifically mentions https://
const errorMessageContentProperty = fc.property(
    fc.string({ minLength: 1, maxLength: 100 }).filter(s => {
        const trimmed = s.trim();
        return trimmed.length > 0 && !trimmed.startsWith('https://');
    }),
    (inputValue) => {
        const photoError = createMockPhotoError();
        validatePhotoURLOnBlur(inputValue, photoError);

        // Error message should mention https://
        return photoError.textContent.includes('https://');
    }
);

try {
    fc.assert(errorMessageContentProperty, { numRuns: 100 });
    assert(true, 'Property 11d: Error message always mentions https:// requirement (100 runs)');
} catch (e) {
    assert(false, `Property 11d: Error message content — ${e.message}`);
}

// --- Summary ---
console.log('');
const total = passed + failed;
if (failed === 0) {
    console.log(`\x1b[32m${passed}/${total} tests passed — All green!\x1b[0m`);
} else {
    console.log(`\x1b[31m${passed}/${total} tests passed — ${failed} FAILED\x1b[0m`);
    process.exit(1);
}
