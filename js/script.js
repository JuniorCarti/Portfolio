/* ============================================
   MODERN PORTFOLIO - JAVASCRIPT
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // FIREBASE CONFIGURATION
    // ============================================

    const firebaseConfig = {
        apiKey: "AIzaSyAQADtIhpsfGYq4loRt_O8V30rYMLbseP8",
        authDomain: "portfolio-8b30f.firebaseapp.com",
        projectId: "portfolio-8b30f",
        storageBucket: "portfolio-8b30f.firebasestorage.app",
        messagingSenderId: "198499933512",
        appId: "1:198499933512:web:a19423ddef46699b99e77d"
    };

    let db = null;
    let firebaseReady = false;
    let firebaseObserver = null; // IntersectionObserver watching #reviews

    // ============================================
    // INITIALIZATION
    // ============================================

    document.addEventListener('DOMContentLoaded', function () {
        // Make sure all sections are visible first
        const allSections = document.querySelectorAll('section');
        allSections.forEach(section => {
            section.style.opacity = '1';
            section.style.visibility = 'visible';
        });

        // Mark that JavaScript is enabled
        document.documentElement.classList.add('js-enabled');

        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            initTheme();
            initNavigation();
            initMobileMenu();
            initHeroVideo();
            initTypingEffect();
            initContactForm();
            initFirebaseLazy();
            initScrollToTop();
            initSmoothScroll();
            initFooterYear();
            initScrollAnimations();
        }, 100);
    });

    // ============================================
    // THEME TOGGLE
    // ============================================

    /**
     * initTheme()
     * Reads the saved theme from localStorage (default: "dark"), applies
     * the data-theme attribute to <html>, and calls updateThemeToggle()
     * so the button's icon and aria-label are correct on first paint.
     * Registers a click handler that toggles theme synchronously.
     * DOM: #themeToggle. State: localStorage.theme.
     */
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateThemeToggle(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeToggle(newTheme);
            });
        }
    }

    /**
     * updateThemeToggle(theme)
     * Sets the theme toggle button's SVG icon and aria-label to reflect
     * the current theme state. Called synchronously — no setTimeout or
     * microtask delay — so screen readers pick up the label immediately.
     * @param {string} theme - "dark" or "light"
     */
    function updateThemeToggle(theme) {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        const svg = btn.querySelector('use');
        if (svg) {
            svg.setAttribute('href', theme === 'dark' ? '#icon-sun' : '#icon-moon');
        }
        btn.setAttribute('aria-label',
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    // ============================================
    // HERO VIDEO BACKGROUND
    // ============================================

    /**
     * initHeroVideo()
     * Gates video autoplay based on viewport width and reduced-motion preference.
     * - On mobile (≤768px): video.play() is NEVER called; CSS hides video and shows poster.
     * - On desktop (>768px) with reduced motion: video.play() is NEVER called.
     * - On desktop (>768px) without reduced motion: plays both .hero-video and .about-video-player.
     * - .catch() is attached to suppress autoplay-blocked errors silently.
     * Called from the DOMContentLoaded handler.
     * @satisfies Requirements 1.1, 1.2, 1.3, 1.4
     */
    function initHeroVideo() {
        // Check viewport and motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (window.innerWidth > 768 && !prefersReducedMotion) {
            // Desktop + no reduced motion: play both videos
            const heroVideo = document.querySelector('.hero-video');
            const aboutVideo = document.querySelector('.about-video-player');

            if (heroVideo) heroVideo.play().catch(() => {});
            if (aboutVideo) aboutVideo.play().catch(() => {});
        }
        // On mobile (≤768px): do NOT call play() — CSS hides video, shows poster
        // On reduced motion: do NOT call play()
    }

    // ============================================
    // NAVIGATION
    // ============================================

    /**
     * initNavigation()
     * Adds scroll-based styling to the navbar (adds .scrolled class when
     * scrolled past 50px) and highlights the active nav link based on
     * which section is currently in view.
     * DOM: #navbar, .nav-link, section[id]. State: none.
     */
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Navbar scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;

            if (navbar) {
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Update active nav link
            updateActiveNavLink();

            lastScroll = currentScroll;
        });

        // Update active nav link on scroll
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    }

    // ============================================
    // MOBILE MENU
    // ============================================

    /**
     * Traps keyboard focus within a container element.
     * Handles Tab and Shift+Tab wrapping so focus cycles only through
     * focusable elements inside the container.
     * @param {HTMLElement} container - The DOM element to trap focus within.
     * @returns {Function} The keydown handler, so it can be removed on close.
     */
    function trapFocus(container) {
        const focusable = container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), ' +
            'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        function handler(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
        container.addEventListener('keydown', handler);
        return handler;
    }

    /**
     * Initialises the mobile menu toggle behaviour including:
     * - Open/close on toggle button click
     * - Focus trap while menu is open (Tab/Shift+Tab wrapping)
     * - Escape key closes menu and returns focus to toggle
     * - aria-expanded state management
     * - Focus moves to first menu item on open
     * - Focus returns to toggle button on close
     */
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (!mobileMenuToggle || !mobileMenu) return;

        let menuOpen = false;
        let trap = null;

        function openMenu() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            mobileMenuToggle.setAttribute('aria-expanded', 'true');

            // Update icon to close
            const useEl = mobileMenuToggle.querySelector('use');
            if (useEl) {
                useEl.setAttribute('href', '#icon-close');
            }

            // Trap focus inside the mobile menu
            trap = trapFocus(mobileMenu);

            // Move focus to the first focusable element inside the menu
            const focusable = mobileMenu.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), ' +
                'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length > 0) {
                focusable[0].focus();
            }

            // Listen for Escape key to close menu
            document.addEventListener('keydown', escapeHandler);
            menuOpen = true;
        }

        function closeMenu() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuToggle.setAttribute('aria-expanded', 'false');

            // Update icon to menu
            const useEl = mobileMenuToggle.querySelector('use');
            if (useEl) {
                useEl.setAttribute('href', '#icon-menu');
            }

            // Remove focus trap keydown listener
            if (trap) {
                mobileMenu.removeEventListener('keydown', trap);
                trap = null;
            }

            // Remove Escape key listener
            document.removeEventListener('keydown', escapeHandler);

            // Return focus to toggle button
            mobileMenuToggle.focus();
            menuOpen = false;
        }

        function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        }

        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', function () {
            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking on a nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (menuOpen) {
                    closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (menuOpen && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ============================================
    // TYPING EFFECT
    // ============================================

    /**
     * initTypingEffect()
     * Cycles through an array of role titles with a typewriter animation
     * on the .typing-text element. Each title is typed character-by-character,
     * then erased before the next one begins.
     * DOM: .typing-text. State: textIndex, charIndex, isDeleting.
     */
    function initTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Mobile Developer',
            'Software Engineer',
            'Flutter Specialist',
            'Problem Solver'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                const speed = isDeleting ? 50 : 100;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // ============================================
    // SCROLL ANIMATIONS (See Premium version below)
    // ============================================

    // NOTE: The premium scroll animation system is defined below
    // It uses Intersection Observer API with CSS-based animations
    // for luxury, Mercedes-Benz style scroll reveals



    // ============================================
    // CONTACT FORM
    // ============================================

    /**
     * initContactForm()
     * Handles Formspree form submission with per-field validation and live
     * region status updates. Uses textContent (not innerHTML) to inject
     * success/error messages into #formStatus for screen reader announcements.
     * DOM: #contactForm, #formStatus, #name, #email, #subject, #message, error spans.
     * State: isSubmitting.
     */
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const formStatus = document.getElementById('formStatus');
        let isSubmitting = false;

        // Formspree endpoint
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjjjpjg';

        if (contactForm) {
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Prevent duplicate submissions
                if (isSubmitting) return;

                // Clear previous messages
                formStatus.textContent = '';
                clearFieldErrors();

                // Validate form
                if (!validateContactForm()) return;

                isSubmitting = true;
                submitBtn.disabled = true;
                submitText.textContent = 'Sending...';

                try {
                    // Prepare form data
                    const formDataToSend = new FormData(contactForm);

                    // Send to Formspree
                    const response = await fetch(FORMSPREE_ENDPOINT, {
                        method: 'POST',
                        body: formDataToSend,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Success — textContent only, never innerHTML (XSS prevention, a11y)
                        formStatus.textContent = 'Message sent successfully!';
                        contactForm.reset();

                        // Scroll to status message
                        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        // Server error
                        formStatus.textContent = 'Failed to send message. Please try again.';
                    }
                } catch (error) {
                    // Network error
                    console.error('Form submission error:', error);
                    formStatus.textContent = 'Network error. Please check your connection.';
                } finally {
                    // Reset button state
                    isSubmitting = false;
                    submitBtn.disabled = false;
                    submitText.textContent = 'Send Message';
                }
            });
        }

        function validateContactForm() {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;

            // Name validation
            if (!name) {
                showFieldError('name', 'Name is required');
                isValid = false;
            }

            // Email validation
            if (!email) {
                showFieldError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email');
                isValid = false;
            }

            // Subject validation
            if (!subject) {
                showFieldError('subject', 'Subject is required');
                isValid = false;
            }

            // Message validation
            if (!message) {
                showFieldError('message', 'Message is required');
                isValid = false;
            }

            return isValid;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function showFieldError(fieldId, errorMessage) {
            const errorElement = document.getElementById(fieldId + 'Error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }

        function clearFieldErrors() {
            const errorElements = document.querySelectorAll('#contactForm .error-message');
            errorElements.forEach(element => {
                element.textContent = '';
            });
        }
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    /**
     * initSmoothScroll()
     * Attaches click handlers to all in-page anchor links (href^="#") so
     * that clicking them smoothly scrolls to the target section with an
     * 80px offset for the fixed navbar.
     * DOM: a[href^="#"]. State: none.
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;

                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // PREMIUM SCROLL ANIMATIONS (Mercedes-Benz Style)
    // ============================================

    /**
     * initScrollAnimations()
     * Creates an IntersectionObserver for scroll-triggered animation classes
     * (.scroll-fade-in, .scroll-slide-up, .scroll-blur-in, .scroll-scale-in,
     * .scroll-stagger-1…4). Adds the .scroll-animate class on intersection to
     * trigger the CSS keyframe. Respects prefers-reduced-motion by applying
     * the class immediately without animation.
     * DOM: .scroll-fade-in, .scroll-slide-up, etc. State: none.
     */
    function initScrollAnimations() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported. Animations will not work.');
            return;
        }

        // Check user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Configuration for Intersection Observer
        const observerOptions = {
            threshold: 0.1,        // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
        };

        // Callback when elements come into view
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                // If user prefers reduced motion, skip animations
                if (prefersReducedMotion) {
                    entry.target.classList.add('scroll-animate');
                    return;
                }

                // When element enters viewport
                if (entry.isIntersecting) {
                    // Add the animate class to trigger CSS animation
                    entry.target.classList.add('scroll-animate');

                    // Optional: Unobserve after animation (for performance)
                    // Uncomment to stop watching after animation plays once
                    // observer.unobserve(entry.target);
                }
            });
        };

        // Create the Intersection Observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Select all elements with scroll animation classes
        const animatedElements = document.querySelectorAll(
            '.scroll-fade-in, .scroll-slide-up, .scroll-blur-in, .scroll-scale-in, ' +
            '.scroll-stagger-1, .scroll-stagger-2, .scroll-stagger-3, .scroll-stagger-4'
        );

        // Observe each element
        animatedElements.forEach((element) => {
            observer.observe(element);
        });

        // Log count of animated elements (for debugging)
        if (animatedElements.length > 0) {
            console.log(`✨ Initialized ${animatedElements.length} scroll animations`);
        }
    }

    // ============================================
    // SCROLL TO TOP
    // ============================================

    /**
     * initScrollToTop()
     * Shows or hides the #scrollToTop button based on scroll position
     * (visible when scrolled past 300px). Clicking the button smoothly
     * scrolls the page back to the top.
     * DOM: #scrollToTop. State: none.
     */
    function initScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');

        if (scrollToTopBtn) {
            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });

            scrollToTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ============================================
    // FOOTER YEAR
    // ============================================

    /**
     * initFooterYear()
     * Sets the footer year span to the current year.
     * DOM: #footerYear. State: none.
     */
    function initFooterYear() {
        const el = document.getElementById('footerYear');
        if (el) el.textContent = new Date().getFullYear();
    }

    // ============================================
    // ADD CSS ANIMATIONS
    // ============================================

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // FIREBASE LAZY LOADING
    // ============================================

    /**
     * initFirebaseLazy()
     * Creates an IntersectionObserver (rootMargin: "200px 0px", threshold: 0)
     * targeting the #reviews section. When the section enters the viewport,
     * the observer disconnects and loadFirebaseAndReviews() is called.
     * Fallback: if IntersectionObserver is not supported, loads Firebase
     * immediately on DOMContentLoaded.
     * DOM: #reviews. State: firebaseObserver.
     * @satisfies Requirements 5.1, 5.2, 5.5
     */
    function initFirebaseLazy() {
        const reviewsSection = document.getElementById('reviews');
        if (!reviewsSection) return;

        // Fallback: no IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            loadFirebaseAndReviews();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    loadFirebaseAndReviews();
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0 });

        observer.observe(reviewsSection);
        firebaseObserver = observer;
    }

    /**
     * loadFirebaseAndReviews()
     * Dynamically imports Firebase SDK modules via ESM import(), initialises
     * Firestore, and calls initReviewsForm() + loadReviews() on success.
     * Shows a loading indicator while importing and displays an inline error
     * message on failure without throwing an unhandled exception.
     * @satisfies Requirements 5.2, 5.3
     */
    async function loadFirebaseAndReviews() {
        const loadingEl = document.getElementById('reviewsList');
        if (loadingEl) loadingEl.innerHTML = '<div class="loading-message">Loading reviews…</div>';

        try {
            const { initializeApp } = await import(
                'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
            );
            const { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } =
                await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            firebaseReady = true;

            // Store references for use in reviews form
            window._firebaseModules = { collection, addDoc, query, where, getDocs, serverTimestamp };

            initReviewsForm();
            loadReviews();
        } catch (err) {
            console.error('Firebase lazy load failed:', err);
            const el = document.getElementById('reviewsList');
            if (el) el.textContent = 'Reviews could not be loaded. Please refresh the page.';
        }
    }

    // ============================================
    // FIREBASE REVIEWS INTEGRATION
    // ============================================

    // Initialize Review Form Submission
    /**
     * initReviewsForm()
     * Wires the #reviewForm submit handler including honeypot spam check,
     * 60-second rate-limit countdown, and client-side validation (name 2–80 chars,
     * message 10–1000 chars, rating 1–5). Also sets up filter buttons, sort dropdown,
     * and load-more pagination for displaying reviews.
     * DOM: #reviewForm, #reviewerName, #reviewRating, #reviewMessage, #photoURL,
     *      #reviewFormStatus, #submitReviewBtn, .filter-btn, #sortSelect.
     * State: rateLimitTimeout, rateLimitInterval.
     */
    function initReviewsForm() {
        const reviewForm = document.getElementById('reviewForm');

        if (!reviewForm) {
            console.warn('Review form not found');
            return;
        }

        // Load reviews immediately (Firebase is already initialized at this point)
        loadReviews();

        // Setup sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                currentSort = this.value;
                applyFilter(currentFilter);
            });
        }

        // Photo URL blur validation
        const photoURLInput = document.getElementById('photoURL');
        const photoError = document.getElementById('photoError');

        if (photoURLInput && photoError) {
            photoURLInput.addEventListener('blur', function () {
                const value = photoURLInput.value.trim();
                if (value && !value.startsWith('https://')) {
                    photoError.textContent = 'Photo URL must start with https://';
                } else {
                    photoError.textContent = '';
                }
            });
        }

        reviewForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Honeypot check — bots fill hidden fields, real users do not
            const honeypot = reviewForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                // Bot detected — show success to avoid revealing mechanism
                showReviewStatus('Thank you for your review!', 'success');
                return;
            }

            if (!firebaseReady) {
                showReviewStatus('Firebase not initialized. Please try again later.', 'error');
                return;
            }

            // Get form values
            const name = document.getElementById('reviewerName').value.trim();
            const rating = parseInt(document.getElementById('reviewRating').value);
            const message = document.getElementById('reviewMessage').value.trim();
            const photoURL = document.getElementById('photoURL').value.trim();

            // Strengthened validation (Requirement 19.4)
            if (name.length < 2 || name.length > 80) {
                showReviewStatus('Name must be between 2 and 80 characters.', 'error');
                return;
            }

            if (message.length < 10 || message.length > 1000) {
                showReviewStatus('Review must be between 10 and 1000 characters.', 'error');
                return;
            }

            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                showReviewStatus('Rating must be an integer between 1 and 5.', 'error');
                return;
            }

            // Disable submit button while processing
            const submitBtn = document.getElementById('submitReviewBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Submitting...</span>';

            try {
                // Validate photoURL if provided
                let validPhotoURL = null;
                if (photoURL) {
                    if (!isValidURL(photoURL)) {
                        showReviewStatus('Invalid image URL. Must be HTTPS.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        return;
                    }
                    validPhotoURL = photoURL;
                }

                // Add review to Firestore
                const { collection, addDoc, serverTimestamp } = window._firebaseModules;
                const docRef = await addDoc(collection(db, 'reviews'), {
                    name: name,
                    rating: rating,
                    message: message,
                    photoURL: validPhotoURL,
                    createdAt: serverTimestamp(),
                    approved: false // Requires manual approval for security
                });

                console.log('✅ Review submitted with ID:', docRef.id);

                // Show success message
                showReviewStatus('Thank you! Your review has been submitted and will be displayed after approval.', 'success');

                // Reset form
                reviewForm.reset();

                // Rate limiting — disable submit for 60 seconds after successful submission
                startRateLimit(submitBtn);

                // Reload reviews after a short delay
                setTimeout(() => {
                    loadReviews();
                }, 500);

            } catch (error) {
                console.error('❌ Error submitting review:', error);
                showReviewStatus('Error submitting review. Please try again.', 'error');
                // Re-enable submit button on error
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        // Setup filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');
                applyFilter(filter);
            });

            // Add keyboard support
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });

            // Add accessibility attributes
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
        });

        // Setup load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                currentPage++;
                renderReviewsPage();
                // Scroll to reviews
                document.getElementById('reviewsList').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    // ============================================
    // REVIEWS MANAGEMENT - ENHANCED FOR SCALE
    // ============================================

    let allReviews = [];
    let displayedReviews = [];
    let currentFilter = 'all';
    let currentSort = 'recent';
    let reviewsPerPage = 6;
    let currentPage = 0;

    // Load Reviews from Firestore
    async function loadReviews() {
        if (!firebaseReady || !db) {
            console.warn('Firebase not ready for loading reviews');
            return;
        }

        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        reviewsList.innerHTML = '<div class="loading-message">Loading reviews...</div>';

        try {
            // Simplified query - only WHERE, no ORDER BY (no composite index needed!)
            const { collection, query, where, getDocs } = window._firebaseModules;
            const q = query(
                collection(db, 'reviews'),
                where('approved', '==', true)
            );

            const querySnapshot = await getDocs(q);

            // Convert to array and sort by date in JavaScript
            allReviews = [];
            querySnapshot.forEach(doc => {
                allReviews.push(doc.data());
            });

            // Sort by createdAt descending (newest first) by default
            allReviews.sort((a, b) => {
                const timeA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
                const timeB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
                return timeB - timeA;
            });

            console.log(`✅ Loaded ${allReviews.length} reviews (no index needed!)`);

            // Update stats
            updateReviewsStats();

            // Reset pagination and apply filter
            currentPage = 0;
            applyFilter('all');

        } catch (error) {
            console.error('❌ Error loading reviews:', error);
            console.error('Error details:', error.message);

            if (error.message && error.message.includes('index')) {
                showReviewsError('📚 Index is being created... Please wait 5-10 minutes and refresh.');

                // Auto-retry after 10 seconds
                setTimeout(() => {
                    console.log('🔄 Retrying to load reviews...');
                    loadReviews();
                }, 10000);
            } else if (error.message && error.message.includes('Missing or insufficient permissions')) {
                showReviewsError('⚠️ Firestore security rules not set. Please set up security rules in Firebase Console (see FIREBASE_SETUP_GUIDE.md)');
            } else {
                showReviewsError(`Unable to load reviews: ${error.message}`);

                // Auto-retry after 5 seconds for temporary issues
                setTimeout(() => {
                    console.log('🔄 Retrying to load reviews...');
                    loadReviews();
                }, 5000);
            }
        }
    }

    // Update reviews statistics
    function updateReviewsStats() {
        if (allReviews.length === 0) {
            document.getElementById('avgRating').textContent = '0';
            document.getElementById('totalReviews').textContent = '0';
            document.getElementById('avgRatingStars').textContent = '';
            return;
        }

        // Calculate average rating
        const totalRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const avgRating = (totalRating / allReviews.length).toFixed(1);

        // Update total count
        document.getElementById('totalReviews').textContent = allReviews.length;
        document.getElementById('avgRating').textContent = avgRating;

        // Update star display
        const fullStars = Math.floor(avgRating);
        const hasHalf = avgRating % 1 >= 0.5;
        let starDisplay = '⭐'.repeat(fullStars);
        if (hasHalf && fullStars < 5) starDisplay += '✨';
        document.getElementById('avgRatingStars').textContent = starDisplay;
    }

    // Apply filter and sort to reviews
    function applyFilter(filter) {
        currentFilter = filter;
        currentPage = 0;

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        const activeBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }

        // Filter reviews
        if (filter === 'all') {
            displayedReviews = [...allReviews];
        } else if (filter === 'below3') {
            displayedReviews = allReviews.filter(r => r.rating < 3);
        } else {
            displayedReviews = allReviews.filter(r => r.rating === parseInt(filter));
        }

        // Apply sort
        if (currentSort === 'highest') {
            displayedReviews.sort((a, b) => b.rating - a.rating);
        } else {
            // Default: recent (newest first) - already sorted by loadReviews
            displayedReviews.sort((a, b) => {
                const timeA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
                const timeB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
                return timeB - timeA;
            });
        }

        // Render first page
        renderReviewsPage();
    }

    // Render current page of reviews
    function renderReviewsPage() {
        const reviewsList = document.getElementById('reviewsList');
        const loadMoreContainer = document.getElementById('loadMoreContainer');

        if (displayedReviews.length === 0) {
            reviewsList.innerHTML = '<div class="no-reviews-message">No reviews match your filter</div>';
            loadMoreContainer.style.display = 'none';
            return;
        }

        const startIdx = currentPage * reviewsPerPage;
        const endIdx = startIdx + reviewsPerPage;
        const reviewsToShow = displayedReviews.slice(0, endIdx);

        // Clear and render reviews
        reviewsList.innerHTML = '';
        reviewsToShow.forEach(review => {
            const card = createReviewCard(review);
            reviewsList.appendChild(card);
        });

        // Show/hide load more button
        if (endIdx < displayedReviews.length) {
            loadMoreContainer.style.display = 'flex';
        } else {
            loadMoreContainer.style.display = 'none';
        }

        // Reinitialize scroll animations
        if (window.IntersectionObserver) {
            setTimeout(() => {
                const newCards = reviewsList.querySelectorAll('.scroll-fade-in:not(.scroll-animate)');
                if (newCards.length > 0) {
                    const observerOptions = {
                        threshold: 0.1,
                        rootMargin: '0px 0px -50px 0px'
                    };
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('scroll-animate');
                            }
                        });
                    }, observerOptions);
                    newCards.forEach(card => observer.observe(card));
                }
            }, 100);
        }

        console.log(`📊 Showing ${reviewsToShow.length} of ${displayedReviews.length} reviews (${currentFilter} filter, ${currentSort} sort)`);
    }

    // Create Review Card Element with Avatar Support
    function createReviewCard(review) {
        const card = document.createElement('article');
        card.className = 'review-card scroll-fade-in';

        // Format date
        let dateStr = 'Recently';
        if (review.createdAt) {
            const date = review.createdAt.toDate ? review.createdAt.toDate() : new Date(review.createdAt);
            dateStr = formatDate(date);
        }

        // Create star rating
        const stars = '⭐'.repeat(review.rating);

        // Create avatar
        let avatarHTML = '';
        if (review.photoURL) {
            avatarHTML = `
                <div class="review-avatar">
                    <img src="${review.photoURL}" alt="Avatar for ${escapeHtml(review.name)}" loading="lazy">
                </div>
            `;
        } else {
            // Fallback: Show initial letter
            const initial = review.name.charAt(0).toUpperCase();
            avatarHTML = `
                <div class="review-avatar fallback" title="${escapeHtml(review.name)}">
                    ${initial}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="review-avatar-section">
                ${avatarHTML}
            </div>
            <div class="review-content">
                <div class="review-header">
                    <div class="review-author-info">
                        <div class="review-author">${escapeHtml(review.name)}</div>
                        <div class="review-date">${dateStr}</div>
                    </div>
                    <div class="review-rating">${stars}</div>
                </div>
                <p class="review-text">${escapeHtml(review.message)}</p>
            </div>
        `;

        return card;
    }

    // Format date for display
    function formatDate(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        // Format as date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    /**
     * Starts a 60-second rate-limit countdown on the review submit button.
     * Disables the button and shows a countdown timer, then re-enables it.
     * @param {HTMLButtonElement} submitBtn - The review form submit button
     */
    function startRateLimit(submitBtn) {
        let seconds = 60;
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = `Wait ${seconds}s`;
        const interval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(interval);
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Submit Review';
            } else {
                submitBtn.querySelector('span').textContent = `Wait ${seconds}s`;
            }
        }, 1000);
    }

    // Show Review Form Status Message
    function showReviewStatus(message, type) {
        const statusEl = document.getElementById('reviewFormStatus');
        if (!statusEl) return;

        statusEl.textContent = message;
        statusEl.className = `form-status ${type}`;

        if (type === 'success') {
            setTimeout(() => {
                statusEl.className = 'form-status';
            }, 4000);
        }
    }

    // Show Reviews Error Message
    function showReviewsError(message) {
        const reviewsList = document.getElementById('reviewsList');
        if (reviewsList) {
            reviewsList.innerHTML = `<div class="no-reviews-message">${message}</div>`;
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Validate URL format
    function isValidURL(urlString) {
        try {
            const url = new URL(urlString);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

})();

