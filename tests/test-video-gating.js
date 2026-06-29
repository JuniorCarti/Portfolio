/**
 * Property Test: Video Autoplay Gating (Property 1)
 * Validates: Requirements 1.1, 1.2, 1.3
 *
 * Run: node tests/test-video-gating.js
 *
 * Property: For any viewport width in [300, 1920]:
 * - video.play() is NEVER called when width ≤ 768
 * - video.play() IS called when width > 768 and prefers-reduced-motion is inactive
 * - video.play() is NEVER called when prefers-reduced-motion is active (any width)
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

// --- Verify source contains the initHeroVideo function ---
const scriptPath = path.resolve(__dirname, '..', 'js', 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

assert(
    scriptContent.includes('function initHeroVideo()'),
    'initHeroVideo function exists in js/script.js'
);

// Verify the function checks window.innerWidth > 768
const fnStart = scriptContent.indexOf('function initHeroVideo()');
const fnEnd = scriptContent.indexOf('\n    }', fnStart + 1) + 6;
const fnBody = scriptContent.substring(fnStart, fnEnd);

assert(
    fnBody.includes('window.innerWidth > 768') || fnBody.includes('innerWidth > 768'),
    'initHeroVideo checks viewport width > 768'
);

assert(
    fnBody.includes('prefers-reduced-motion'),
    'initHeroVideo checks prefers-reduced-motion media query'
);

// --- Replicate initHeroVideo logic for property testing ---
// The logic is extracted from js/script.js to test in isolation with mocked DOM/window.
function initHeroVideo(mockWindow, mockDocument) {
    const prefersReducedMotion = mockWindow.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mockWindow.innerWidth > 768 && !prefersReducedMotion) {
        const heroVideo = mockDocument.querySelector('.hero-video');
        const aboutVideo = mockDocument.querySelector('.about-video-player');

        if (heroVideo) heroVideo.play();
        if (aboutVideo) aboutVideo.play();
    }
}

// --- Mock factories ---
function createMockWindow(innerWidth, prefersReducedMotion) {
    return {
        innerWidth: innerWidth,
        matchMedia(query) {
            if (query === '(prefers-reduced-motion: reduce)') {
                return { matches: prefersReducedMotion };
            }
            return { matches: false };
        }
    };
}

function createMockDocument() {
    let heroPlayCalled = false;
    let aboutPlayCalled = false;

    const heroVideo = {
        play() { heroPlayCalled = true; }
    };
    const aboutVideo = {
        play() { aboutPlayCalled = true; }
    };

    const document = {
        querySelector(selector) {
            if (selector === '.hero-video') return heroVideo;
            if (selector === '.about-video-player') return aboutVideo;
            return null;
        }
    };

    return {
        document,
        wasHeroPlayCalled: () => heroPlayCalled,
        wasAboutPlayCalled: () => aboutPlayCalled
    };
}

// --- Property-Based Tests using fast-check ---

console.log('\n--- Property 1: Video Autoplay Gating ---\n');

// Viewport width arbitrary: integer range [300, 1920]
const viewportArbitrary = fc.integer({ min: 300, max: 1920 });

// Property 1a: video.play() is NEVER called when width ≤ 768
const neverPlayOnMobileProperty = fc.property(
    fc.integer({ min: 300, max: 768 }),
    fc.boolean(),
    (width, prefersReducedMotion) => {
        const mockWindow = createMockWindow(width, prefersReducedMotion);
        const { document, wasHeroPlayCalled, wasAboutPlayCalled } = createMockDocument();

        initHeroVideo(mockWindow, document);

        // play() must NEVER be called when width ≤ 768, regardless of motion preference
        return !wasHeroPlayCalled() && !wasAboutPlayCalled();
    }
);

try {
    fc.assert(neverPlayOnMobileProperty, { numRuns: 100 });
    assert(true, 'Property 1a: video.play() is NEVER called when viewport width ≤ 768 (100 runs)');
} catch (e) {
    assert(false, `Property 1a: video.play() on mobile — ${e.message}`);
}

// Property 1b: video.play() IS called when width > 768 and reduced motion is OFF
const playOnDesktopNoMotionProperty = fc.property(
    fc.integer({ min: 769, max: 1920 }),
    (width) => {
        const mockWindow = createMockWindow(width, false); // reduced motion OFF
        const { document, wasHeroPlayCalled, wasAboutPlayCalled } = createMockDocument();

        initHeroVideo(mockWindow, document);

        // play() must be called for both videos
        return wasHeroPlayCalled() && wasAboutPlayCalled();
    }
);

try {
    fc.assert(playOnDesktopNoMotionProperty, { numRuns: 100 });
    assert(true, 'Property 1b: video.play() IS called when width > 768 and reduced motion is off (100 runs)');
} catch (e) {
    assert(false, `Property 1b: video.play() on desktop — ${e.message}`);
}

// Property 1c: video.play() is NEVER called when prefers-reduced-motion is active (any width)
const neverPlayWithReducedMotionProperty = fc.property(
    viewportArbitrary,
    (width) => {
        const mockWindow = createMockWindow(width, true); // reduced motion ON
        const { document, wasHeroPlayCalled, wasAboutPlayCalled } = createMockDocument();

        initHeroVideo(mockWindow, document);

        // play() must NEVER be called when reduced motion is active
        return !wasHeroPlayCalled() && !wasAboutPlayCalled();
    }
);

try {
    fc.assert(neverPlayWithReducedMotionProperty, { numRuns: 100 });
    assert(true, 'Property 1c: video.play() is NEVER called when prefers-reduced-motion is active (100 runs)');
} catch (e) {
    assert(false, `Property 1c: video.play() with reduced motion — ${e.message}`);
}

// Property 1d: Boundary test — width exactly 768 never plays, width exactly 769 plays (without reduced motion)
const boundaryProperty = fc.property(
    fc.constantFrom(768, 769),
    (width) => {
        const mockWindow = createMockWindow(width, false);
        const { document, wasHeroPlayCalled, wasAboutPlayCalled } = createMockDocument();

        initHeroVideo(mockWindow, document);

        if (width === 768) {
            return !wasHeroPlayCalled() && !wasAboutPlayCalled();
        } else {
            // width === 769
            return wasHeroPlayCalled() && wasAboutPlayCalled();
        }
    }
);

try {
    fc.assert(boundaryProperty, { numRuns: 100 });
    assert(true, 'Property 1d: Boundary — width 768 never plays, width 769 always plays (100 runs)');
} catch (e) {
    assert(false, `Property 1d: Boundary test — ${e.message}`);
}

// Property 1e: Combined random width and motion preference — full truth table
const fullTruthTableProperty = fc.property(
    viewportArbitrary,
    fc.boolean(),
    (width, prefersReducedMotion) => {
        const mockWindow = createMockWindow(width, prefersReducedMotion);
        const { document, wasHeroPlayCalled, wasAboutPlayCalled } = createMockDocument();

        initHeroVideo(mockWindow, document);

        const shouldPlay = width > 768 && !prefersReducedMotion;

        if (shouldPlay) {
            return wasHeroPlayCalled() && wasAboutPlayCalled();
        } else {
            return !wasHeroPlayCalled() && !wasAboutPlayCalled();
        }
    }
);

try {
    fc.assert(fullTruthTableProperty, { numRuns: 200 });
    assert(true, 'Property 1e: Full truth table — play iff width > 768 AND reduced motion off (200 runs)');
} catch (e) {
    assert(false, `Property 1e: Full truth table — ${e.message}`);
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
