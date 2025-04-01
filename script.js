// Main JavaScript file for portfolio website

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initNavbarScrollEffect();
    initSkillsAnimation();
    initSmoothScrolling();
    initContactForm();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

/**
 * Navbar Scroll Effect
 */
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Animate Skills Progress Bars on Scroll
 */
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    if (skillBars.length === 0) return;
    
    function animateSkills() {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition) {
                const width = bar.getAttribute('data-width') || bar.getAttribute('style').match(/\d+/)[0];
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 100);
            }
        });
    }
    
    // Run once on page load
    animateSkills();
    
    // Run on scroll
    window.addEventListener('scroll', animateSkills);
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form Submission Handling
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Here you would typically send the form data to a server
        // For demonstration, we'll just log it and show an alert
        console.log('Form submitted:', formData);
        
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}