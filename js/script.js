/* ============================================
   MODERN PORTFOLIO - JAVASCRIPT
   ============================================ */

(function () {
    'use strict';

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
            initScrollAnimations();
            initTypingEffect();
            initCounterAnimation();
            initProgressBars();
            initContactForm();
            initScrollToTop();
            initSmoothScroll();
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

        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Get form values
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };

                // Show success message
                showNotification('Thank you for your message! I will get back to you soon.', 'success');

                // Reset form
                contactForm.reset();

                // Here you would typically send the data to a server
                // For now, we'll just log it
                console.log('Form submitted:', formData);
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

})();

