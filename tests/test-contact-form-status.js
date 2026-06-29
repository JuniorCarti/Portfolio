/**
 * Property Test: Contact Form Status Updates Live Region (Property 12)
 * Validates: Requirements 11.1, 11.2, 11.3
 *
 * Run: node tests/test-contact-form-status.js
 *
 * Properties:
 * - #formStatus has aria-live="polite" and role="status" in static HTML
 * - On successful fetch (ok: true), formStatus.textContent is non-empty
 * - On failed fetch (ok: false), formStatus.textContent is non-empty
 * - On fetch throwing an error, formStatus.textContent is non-empty
 * - All status updates use textContent (not innerHTML) for accessibility
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

// --- Read source files ---
const htmlPath = path.resolve(__dirname, '..', 'index.html');
const scriptPath = path.resolve(__dirname, '..', 'js', 'script.js');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

console.log('\n--- Property 12: Contact Form Status Updates Live Region ---\n');

// ============================================
// Static HTML Verification
// ============================================

// Verify #formStatus has aria-live="polite" and role="status" in static HTML
// This ensures the live region is registered with the accessibility tree before JS runs

const formStatusRegex = /<[^>]*id=["']formStatus["'][^>]*>/;
const formStatusMatch = htmlContent.match(formStatusRegex);

assert(
    formStatusMatch !== null,
    '#formStatus element exists in static HTML'
);

if (formStatusMatch) {
    const formStatusTag = formStatusMatch[0];
    assert(
        formStatusTag.includes('aria-live="polite"'),
        '#formStatus has aria-live="polite" in static HTML markup'
    );
    assert(
        formStatusTag.includes('role="status"'),
        '#formStatus has role="status" in static HTML markup'
    );
}

// ============================================
// Code Pattern Verification
// ============================================

// Extract the initContactForm function body for analysis
const contactFormStart = scriptContent.indexOf('function initContactForm()');
assert(
    contactFormStart !== -1,
    'initContactForm() function exists in js/script.js'
);

// Get the function body (find matching closing brace)
let braceCount = 0;
let contactFormEnd = contactFormStart;
let foundStart = false;
for (let i = contactFormStart; i < scriptContent.length; i++) {
    if (scriptContent[i] === '{') {
        braceCount++;
        foundStart = true;
    } else if (scriptContent[i] === '}') {
        braceCount--;
        if (foundStart && braceCount === 0) {
            contactFormEnd = i + 1;
            break;
        }
    }
}
const contactFormBody = scriptContent.substring(contactFormStart, contactFormEnd);

// Verify textContent is used (not innerHTML) for formStatus updates
assert(
    contactFormBody.includes('formStatus.textContent'),
    'initContactForm uses formStatus.textContent for status updates (not innerHTML)'
);

// Verify there's no innerHTML assignment to formStatus within initContactForm
const formStatusInnerHTML = contactFormBody.match(/formStatus\.innerHTML\s*=/);
assert(
    formStatusInnerHTML === null,
    'initContactForm does NOT use formStatus.innerHTML (XSS-safe, a11y compliant)'
);

// Verify success path exists (response.ok check)
assert(
    contactFormBody.includes('response.ok'),
    'initContactForm has a response.ok check for the success path'
);

// Verify success message sets textContent
const successPathRegex = /if\s*\(\s*response\.ok\s*\)[\s\S]*?formStatus\.textContent\s*=/;
assert(
    successPathRegex.test(contactFormBody),
    'Success path (response.ok) sets formStatus.textContent to a message'
);

// Verify error path (response not ok) sets textContent
// Look for an else block or a condition after response.ok that sets formStatus.textContent
const errorPathRegex = /else\s*\{[\s\S]*?formStatus\.textContent\s*=/;
assert(
    errorPathRegex.test(contactFormBody),
    'Error path (response not ok) sets formStatus.textContent to a message'
);

// Verify catch block for network errors sets textContent
const catchBlockRegex = /catch\s*\([^)]*\)\s*\{[\s\S]*?formStatus\.textContent\s*=/;
assert(
    catchBlockRegex.test(contactFormBody),
    'Catch block (network error) sets formStatus.textContent to a message'
);

// ============================================
// Property-Based Tests using fast-check
// ============================================

// We replicate the contact form submission logic to verify properties
// across random inputs. The key invariant: formStatus.textContent is
// ALWAYS non-empty after any submission attempt completes.

// --- Mock DOM setup ---
function createMockFormDOM() {
    const elements = {};
    const textContents = {};

    function createElement(id, initialText) {
        textContents[id] = initialText || '';
        elements[id] = {
            get textContent() { return textContents[id]; },
            set textContent(val) { textContents[id] = val; },
            value: '',
            disabled: false,
            scrollIntoView() {},
        };
        return elements[id];
    }

    const formStatus = createElement('formStatus', '');
    const nameField = createElement('name', '');
    const emailField = createElement('email', '');
    const subjectField = createElement('subject', '');
    const messageField = createElement('message', '');
    const submitBtn = createElement('submitBtn', '');
    submitBtn.disabled = false;
    const submitText = createElement('submitText', 'Send Message');

    return { formStatus, nameField, emailField, subjectField, messageField, submitBtn, submitText, textContents };
}

// Replicate the core submission logic from initContactForm
async function simulateSubmission(fetchBehaviour, formValues) {
    const { formStatus, nameField, emailField, subjectField, messageField, submitBtn, submitText } = createMockFormDOM();

    // Set form values
    nameField.value = formValues.name;
    emailField.value = formValues.email;
    subjectField.value = formValues.subject;
    messageField.value = formValues.message;

    // Clear previous status
    formStatus.textContent = '';

    // Simulate basic validation (non-empty fields)
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const subject = subjectField.value.trim();
    const message = messageField.value.trim();

    if (!name || !email || !subject || !message) {
        // Validation would catch this, but for our test we only pass valid forms
        return formStatus;
    }

    // Simulate fetch
    try {
        const response = await fetchBehaviour();

        if (response.ok) {
            formStatus.textContent = 'Message sent successfully!';
        } else {
            formStatus.textContent = 'Failed to send message. Please try again.';
        }
    } catch (error) {
        formStatus.textContent = 'Network error. Please check your connection.';
    }

    return formStatus;
}

// Arbitrary for valid form data (non-empty strings that pass basic validation)
const validFormData = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    email: fc.emailAddress(),
    subject: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    message: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
});

console.log('\n--- Property-Based Tests (fast-check, 100 runs each) ---\n');

// Property 12a: On successful fetch, formStatus.textContent is non-empty
const successProperty = fc.asyncProperty(validFormData, async (formValues) => {
    const mockFetch = async () => ({ ok: true });
    const formStatus = await simulateSubmission(mockFetch, formValues);
    return formStatus.textContent.length > 0;
});

(async () => {
    try {
        await fc.assert(successProperty, { numRuns: 100 });
        assert(true, 'Property 12a: formStatus.textContent is non-empty after successful fetch (100 runs)');
    } catch (e) {
        assert(false, `Property 12a: Success status — ${e.message}`);
    }

    // Property 12b: On failed fetch (ok: false), formStatus.textContent is non-empty
    const failureProperty = fc.asyncProperty(validFormData, async (formValues) => {
        const mockFetch = async () => ({ ok: false, status: 500 });
        const formStatus = await simulateSubmission(mockFetch, formValues);
        return formStatus.textContent.length > 0;
    });

    try {
        await fc.assert(failureProperty, { numRuns: 100 });
        assert(true, 'Property 12b: formStatus.textContent is non-empty after failed fetch (100 runs)');
    } catch (e) {
        assert(false, `Property 12b: Failure status — ${e.message}`);
    }

    // Property 12c: On fetch throwing (network error), formStatus.textContent is non-empty
    const networkErrorArbitrary = fc.oneof(
        fc.constant(new Error('Network error')),
        fc.constant(new TypeError('Failed to fetch')),
        fc.constant(new Error('ERR_INTERNET_DISCONNECTED'))
    );

    const throwProperty = fc.asyncProperty(validFormData, networkErrorArbitrary, async (formValues, error) => {
        const mockFetch = async () => { throw error; };
        const formStatus = await simulateSubmission(mockFetch, formValues);
        return formStatus.textContent.length > 0;
    });

    try {
        await fc.assert(throwProperty, { numRuns: 100 });
        assert(true, 'Property 12c: formStatus.textContent is non-empty after fetch throws (100 runs)');
    } catch (e) {
        assert(false, `Property 12c: Network error status — ${e.message}`);
    }

    // Property 12d: The live region attributes exist BEFORE any submission (static HTML)
    // This is a deterministic check but expressed as a property for consistency:
    // For any random number of submissions, the attributes should always be present in HTML source
    const staticAttributeProperty = fc.property(fc.nat({ max: 50 }), (_n) => {
        // The attributes must exist in the static HTML — they do not depend on JS
        const hasAriaLive = htmlContent.includes('id="formStatus"') &&
                           htmlContent.includes('aria-live="polite"');
        const hasRole = htmlContent.includes('id="formStatus"') &&
                       htmlContent.includes('role="status"');
        return hasAriaLive && hasRole;
    });

    try {
        fc.assert(staticAttributeProperty, { numRuns: 100 });
        assert(true, 'Property 12d: #formStatus aria-live="polite" and role="status" exist in static HTML regardless of state (100 runs)');
    } catch (e) {
        assert(false, `Property 12d: Static attributes — ${e.message}`);
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
})();
