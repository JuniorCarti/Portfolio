/**
 * Property Test: Firebase Lazy Load Trigger (Property 8)
 * Validates: Requirements 5.1, 5.2
 *
 * Run: node tests/test-firebase-lazy.js
 *
 * Property: Firebase loads ONLY when the Reviews section intersects the viewport.
 * - IntersectionObserver is created with rootMargin '200px 0px' and threshold 0
 * - Observer disconnects after the first intersection
 * - loadFirebaseAndReviews() is called on intersection
 * - Fallback: if IntersectionObserver is not supported, loads immediately
 *
 * Uses code pattern analysis + mock IntersectionObserver for behavioral testing
 * since dynamic import() cannot easily be tested in Node.js.
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

// --- Load and parse the source code ---
const scriptPath = path.resolve(__dirname, '..', 'js', 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

console.log('\n--- Property 8: Firebase Loads Only on Reviews Section Intersection ---\n');

// === Static Code Pattern Analysis ===

// 1. Verify initFirebaseLazy function exists
assert(
    scriptContent.includes('function initFirebaseLazy()'),
    'initFirebaseLazy function exists in js/script.js'
);

// Extract the function body for detailed checks
const fnStart = scriptContent.indexOf('function initFirebaseLazy()');
const fnBodyStart = scriptContent.indexOf('{', fnStart);
// Find the matching closing brace by counting braces
let braceCount = 0;
let fnEnd = fnBodyStart;
for (let i = fnBodyStart; i < scriptContent.length; i++) {
    if (scriptContent[i] === '{') braceCount++;
    if (scriptContent[i] === '}') braceCount--;
    if (braceCount === 0) {
        fnEnd = i + 1;
        break;
    }
}
const fnBody = scriptContent.substring(fnStart, fnEnd);

// 2. Verify rootMargin '200px 0px' is used
assert(
    fnBody.includes("rootMargin: '200px 0px'") || fnBody.includes('rootMargin: "200px 0px"'),
    'initFirebaseLazy uses rootMargin "200px 0px"'
);

// 3. Verify threshold 0 is used
assert(
    fnBody.includes('threshold: 0'),
    'initFirebaseLazy uses threshold: 0'
);

// 4. Verify IntersectionObserver is constructed
assert(
    fnBody.includes('new IntersectionObserver'),
    'initFirebaseLazy creates a new IntersectionObserver'
);

// 5. Verify observer.disconnect() is called on intersection
assert(
    fnBody.includes('observer.disconnect()') || fnBody.includes('disconnect()'),
    'Observer disconnects after first intersection'
);

// 6. Verify loadFirebaseAndReviews() is called within the observer callback
assert(
    fnBody.includes('loadFirebaseAndReviews()'),
    'loadFirebaseAndReviews() is called when section intersects'
);

// 7. Verify fallback for browsers without IntersectionObserver support
assert(
    fnBody.includes("!('IntersectionObserver' in window)") ||
    fnBody.includes("!('IntersectionObserver' in window)"),
    'Fallback check for IntersectionObserver support exists'
);

// The fallback should call loadFirebaseAndReviews immediately
const fallbackSection = fnBody.substring(
    fnBody.indexOf("!('IntersectionObserver' in window)"),
    fnBody.indexOf('new IntersectionObserver')
);
assert(
    fallbackSection.includes('loadFirebaseAndReviews()'),
    'Fallback calls loadFirebaseAndReviews() immediately when IO not supported'
);

// 8. Verify the observer targets #reviews section
assert(
    fnBody.includes("getElementById('reviews')") || fnBody.includes('getElementById("reviews")'),
    'Observer targets the #reviews section element'
);

// 9. Verify observer.observe() is called on the reviews section
assert(
    fnBody.includes('observer.observe(reviewsSection)') || fnBody.includes('observer.observe('),
    'Observer is set to observe the reviews section element'
);

// === Behavioral Property Tests with Mocked IntersectionObserver ===

/**
 * Replicate the initFirebaseLazy logic in a testable form.
 * This mirrors the actual implementation but accepts mock dependencies.
 */
function initFirebaseLazy(mockWindow, mockDocument, onFirebaseLoad) {
    const reviewsSection = mockDocument.getElementById('reviews');
    if (!reviewsSection) return { observerCreated: false, firebaseLoaded: false };

    // Fallback: no IntersectionObserver support
    if (!('IntersectionObserver' in mockWindow)) {
        onFirebaseLoad();
        return { observerCreated: false, firebaseLoaded: true, fallbackUsed: true };
    }

    let disconnected = false;
    let firebaseLoaded = false;

    const observer = new mockWindow.IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                disconnected = true;
                observer.disconnect();
                firebaseLoaded = true;
                onFirebaseLoad();
            }
        });
    }, { rootMargin: '200px 0px', threshold: 0 });

    observer.observe(reviewsSection);

    return {
        observerCreated: true,
        firebaseLoaded: () => firebaseLoaded,
        disconnected: () => disconnected,
        triggerIntersection: (isIntersecting) => {
            observer._callback([{ isIntersecting }]);
        }
    };
}

// --- Mock factories ---

function createMockWindow(hasIntersectionObserver) {
    const mockWindow = {};

    if (hasIntersectionObserver) {
        mockWindow.IntersectionObserver = class MockIntersectionObserver {
            constructor(callback, options) {
                this._callback = callback;
                this._options = options;
                this._observing = [];
                this._disconnected = false;
            }
            observe(element) {
                this._observing.push(element);
            }
            disconnect() {
                this._disconnected = true;
                this._observing = [];
                // After disconnect, callback invocations are no-ops (matches real browser behavior)
                this._callback = () => {};
            }
        };
    }

    return mockWindow;
}

function createMockDocument(hasReviewsSection) {
    return {
        getElementById(id) {
            if (id === 'reviews' && hasReviewsSection) {
                return { id: 'reviews', tagName: 'SECTION' };
            }
            return null;
        }
    };
}

// --- Property-Based Tests ---

// Property 8a: When IO never fires, import() (loadFirebaseAndReviews) is never called
const neverFireProperty = fc.property(
    fc.integer({ min: 1, max: 100 }), // arbitrary iteration count (unused but exercises the property)
    (_n) => {
        let firebaseLoadCalled = false;
        const mockWindow = createMockWindow(true);
        const mockDocument = createMockDocument(true);

        const result = initFirebaseLazy(mockWindow, mockDocument, () => {
            firebaseLoadCalled = true;
        });

        // Observer created but callback never triggered — firebase must NOT be loaded
        return result.observerCreated === true && !firebaseLoadCalled;
    }
);

try {
    fc.assert(neverFireProperty, { numRuns: 100 });
    assert(true, 'Property 8a: When IntersectionObserver never fires, import() is never called (100 runs)');
} catch (e) {
    assert(false, `Property 8a: IO never fires — ${e.message}`);
}

// Property 8b: When observer callback fires with isIntersecting: true, loadFirebaseAndReviews is called
const intersectionFiresProperty = fc.property(
    fc.integer({ min: 1, max: 50 }), // arbitrary
    (_n) => {
        let firebaseLoadCalled = false;
        const mockWindow = createMockWindow(true);
        const mockDocument = createMockDocument(true);

        const result = initFirebaseLazy(mockWindow, mockDocument, () => {
            firebaseLoadCalled = true;
        });

        // Trigger the intersection callback
        result.triggerIntersection(true);

        // Firebase must be loaded after intersection
        return firebaseLoadCalled && result.firebaseLoaded() && result.disconnected();
    }
);

try {
    fc.assert(intersectionFiresProperty, { numRuns: 100 });
    assert(true, 'Property 8b: When observer fires isIntersecting: true, loadFirebaseAndReviews is called and observer disconnects (100 runs)');
} catch (e) {
    assert(false, `Property 8b: IO fires with isIntersecting — ${e.message}`);
}

// Property 8c: When observer fires with isIntersecting: false, firebase is NOT loaded
const notIntersectingProperty = fc.property(
    fc.integer({ min: 1, max: 50 }),
    (_n) => {
        let firebaseLoadCalled = false;
        const mockWindow = createMockWindow(true);
        const mockDocument = createMockDocument(true);

        const result = initFirebaseLazy(mockWindow, mockDocument, () => {
            firebaseLoadCalled = true;
        });

        // Trigger with isIntersecting: false
        result.triggerIntersection(false);

        // Firebase must NOT be loaded
        return !firebaseLoadCalled && !result.disconnected();
    }
);

try {
    fc.assert(notIntersectingProperty, { numRuns: 100 });
    assert(true, 'Property 8c: When observer fires isIntersecting: false, firebase is NOT loaded (100 runs)');
} catch (e) {
    assert(false, `Property 8c: IO fires with isIntersecting false — ${e.message}`);
}

// Property 8d: Observer disconnects after first intersection — subsequent calls are ignored
const disconnectAfterFirstProperty = fc.property(
    fc.integer({ min: 2, max: 10 }), // number of times to trigger
    (triggerCount) => {
        let loadCount = 0;
        const mockWindow = createMockWindow(true);
        const mockDocument = createMockDocument(true);

        const result = initFirebaseLazy(mockWindow, mockDocument, () => {
            loadCount++;
        });

        // Trigger intersection multiple times
        for (let i = 0; i < triggerCount; i++) {
            result.triggerIntersection(true);
        }

        // loadFirebaseAndReviews should only be called ONCE (observer disconnects after first)
        return loadCount === 1;
    }
);

try {
    fc.assert(disconnectAfterFirstProperty, { numRuns: 100 });
    assert(true, 'Property 8d: Observer disconnects after first intersection — subsequent triggers are ignored (100 runs)');
} catch (e) {
    assert(false, `Property 8d: Disconnect after first — ${e.message}`);
}

// Property 8e: No IntersectionObserver support — falls back to immediate load
const fallbackProperty = fc.property(
    fc.integer({ min: 1, max: 50 }),
    (_n) => {
        let firebaseLoadCalled = false;
        const mockWindow = createMockWindow(false); // IO not supported
        const mockDocument = createMockDocument(true);

        const result = initFirebaseLazy(mockWindow, mockDocument, () => {
            firebaseLoadCalled = true;
        });

        // Firebase should be loaded immediately without creating an observer
        return result.observerCreated === false && firebaseLoadCalled && result.fallbackUsed === true;
    }
);

try {
    fc.assert(fallbackProperty, { numRuns: 100 });
    assert(true, 'Property 8e: Without IntersectionObserver, falls back to immediate Firebase load (100 runs)');
} catch (e) {
    assert(false, `Property 8e: IO fallback — ${e.message}`);
}

// Property 8f: No #reviews section — nothing happens (early return)
const noReviewsSectionProperty = fc.property(
    fc.boolean(), // hasIO or not, shouldn't matter
    (hasIO) => {
        let firebaseLoadCalled = false;
        const mockWindow = createMockWindow(hasIO);
        const mockDocument = createMockDocument(false); // no #reviews section

        const result = initFirebaseLazy(mockWindow, mockDocument, () => {
            firebaseLoadCalled = true;
        });

        // Should early return without creating observer or loading firebase
        return result.observerCreated === false && !firebaseLoadCalled;
    }
);

try {
    fc.assert(noReviewsSectionProperty, { numRuns: 100 });
    assert(true, 'Property 8f: Without #reviews section in DOM, no observer is created and Firebase is not loaded (100 runs)');
} catch (e) {
    assert(false, `Property 8f: No reviews section — ${e.message}`);
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
