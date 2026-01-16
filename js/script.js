/* ============================================
   MODERN PORTFOLIO - JAVASCRIPT
   ============================================ */

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

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

    // Initialize Firebase immediately
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        firebaseReady = true;
        console.log('✅ Firebase initialized successfully (Firestore only)');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
    }

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
            initCounterAnimation();
            initProgressBars();
            initContactForm();
            initReviewsForm(); // This calls loadReviews()
            initScrollToTop();
            initSmoothScroll();
            // Initialize scroll animations LAST, after reviews are loaded
            setTimeout(() => {
                initScrollAnimations();
            }, 1500);
        }, 100);
    });

    // ============================================
    // THEME TOGGLE
    // ============================================

    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });
        }
    }

    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        }
    }

    // ============================================
    // HERO VIDEO BACKGROUND
    // ============================================

    function initHeroVideo() {
        const heroVideo = document.querySelector('.hero-video');
        const heroOverlay = document.querySelector('.hero-overlay');

        if (!heroVideo) return;

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Don't autoplay video if user prefers reduced motion
            heroVideo.autoplay = false;
            heroVideo.pause();
            console.log('✨ Respecting prefers-reduced-motion: showing poster image');
            return;
        }

        // Attempt to play video
        const playPromise = heroVideo.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Hero video autoplaying successfully');
                })
                .catch((error) => {
                    console.warn('⚠️ Autoplay blocked by browser:', error.message);
                    // Browser blocked autoplay - poster image is already showing
                    // Add play controls by removing playsinline if needed
                    if (!heroVideo.hasAttribute('controls')) {
                        heroVideo.setAttribute('controls', 'controls');
                    }
                });
        }

        // Handle video load errors
        heroVideo.addEventListener('error', (e) => {
            console.error('❌ Video failed to load:', e.target.error);
            // Poster image will still show as fallback
        });

        // Ensure overlay is on top for better text readability
        if (heroOverlay) {
            heroOverlay.style.zIndex = '2';
        }
    }

    // ============================================
    // NAVIGATION
    // ============================================

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

    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function () {
                mobileMenu.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = mobileMenu.classList.contains('active') ? 'close' : 'menu';
                }
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking on a link
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function () {
                    mobileMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.textContent = 'menu';
                    }
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function (e) {
                if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.textContent = 'menu';
                    }
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ============================================
    // TYPING EFFECT
    // ============================================

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
    // COUNTER ANIMATION
    // ============================================

    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        };

        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ============================================
    // PROGRESS BARS
    // ============================================

    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');

        const progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.style.getPropertyValue('--progress');
                    entry.target.style.width = progress;
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            bar.style.width = '0%';
            progressObserver.observe(bar);
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================

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
                formStatus.innerHTML = '';
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
                        // Success
                        formStatus.innerHTML = '<div class="status-message success"><i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.</div>';
                        contactForm.reset();

                        // Scroll to status message
                        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        // Server error
                        formStatus.innerHTML = '<div class="status-message error"><i class="fas fa-exclamation-circle"></i> There was an error sending your message. Please try again.</div>';
                    }
                } catch (error) {
                    // Network error
                    console.error('Form submission error:', error);
                    formStatus.innerHTML = '<div class="status-message error"><i class="fas fa-exclamation-circle"></i> Network error. Please check your connection and try again.</div>';
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
                errorElement.style.display = 'block';
            }
        }

        function clearFieldErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
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
     * Initialize scroll-triggered animations using Intersection Observer API
     * Animations are triggered when elements come into view, not on page load
     * 
     * Usage: Add classes like 'scroll-fade-in', 'scroll-slide-up', 'scroll-blur-in' to elements
     * Optional: Use 'scroll-stagger-1', 'scroll-stagger-2', etc. for staggered reveals
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
    // FIREBASE REVIEWS INTEGRATION
    // ============================================

    // Initialize Review Form Submission
    function initReviewsForm() {
        const reviewForm = document.getElementById('reviewForm');

        if (!reviewForm) {
            console.warn('Review form not found');
            return;
        }

        // Load reviews immediately
        if (firebaseReady) {
            loadReviews();
        } else {
            console.warn('⚠️ Firebase not ready. Retrying...');
            setTimeout(() => {
                if (firebaseReady) {
                    loadReviews();
                } else {
                    showReviewsError('Firebase connection failed. Please refresh the page.');
                }
            }, 2000);
        }

        // Setup sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                currentSort = this.value;
                applyFilter(currentFilter);
            });
        }

        reviewForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!firebaseReady) {
                showReviewStatus('Firebase not initialized. Please try again later.', 'error');
                return;
            }

            // Get form values
            const name = document.getElementById('reviewerName').value.trim();
            const rating = parseInt(document.getElementById('reviewRating').value);
            const message = document.getElementById('reviewMessage').value.trim();
            const photoURL = document.getElementById('photoURL').value.trim();

            // Validation
            if (!name || !rating || !message) {
                showReviewStatus('Please fill in all fields', 'error');
                return;
            }

            if (name.length < 2) {
                showReviewStatus('Name must be at least 2 characters', 'error');
                return;
            }

            if (message.length < 10) {
                showReviewStatus('Review must be at least 10 characters', 'error');
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

                // Reload reviews after a short delay
                setTimeout(() => {
                    loadReviews();
                }, 500);

            } catch (error) {
                console.error('❌ Error submitting review:', error);
                showReviewStatus('Error submitting review. Please try again.', 'error');
            } finally {
                // Re-enable submit button
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
        const card = document.createElement('div');
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

