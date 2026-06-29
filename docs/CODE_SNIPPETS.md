# Code Snippets & Examples

## Copy-Paste Ready Examples

### 1. Basic Fade In
```html
<div class="content-card scroll-fade-in">
    <h3>Your Heading</h3>
    <p>Your content here</p>
</div>
```

### 2. Slide Up (Primary Effect)
```html
<div class="feature-card glass-card scroll-slide-up">
    <h2>Featured Section</h2>
    <p>This slides up as you scroll down</p>
</div>
```

### 3. Blur to Sharp (Hero Text)
```html
<h1 class="scroll-blur-in">Welcome to My Portfolio</h1>
```

### 4. Scale In (Images)
```html
<img class="scroll-scale-in" src="image.jpg" alt="Description">
```

### 5. Staggered Paragraphs
```html
<article class="scroll-slide-up">
    <p class="scroll-stagger-1">
        First paragraph appears first with slight delay
    </p>
    <p class="scroll-stagger-2">
        Second paragraph appears 0.1s later
    </p>
    <p class="scroll-stagger-3">
        Third paragraph appears 0.2s later
    </p>
    <p class="scroll-stagger-4">
        Fourth paragraph appears 0.3s later
    </p>
</article>
```

### 6. Grid of Cards (All animate)
```html
<div class="skills-grid">
    <div class="card scroll-slide-up">Card 1</div>
    <div class="card scroll-slide-up">Card 2</div>
    <div class="card scroll-slide-up">Card 3</div>
    <div class="card scroll-slide-up">Card 4</div>
</div>
```

### 7. Multiple Elements Staggered
```html
<div class="gallery">
    <img class="scroll-fade-in" src="img1.jpg" alt="Image 1">
    <img class="scroll-fade-in" src="img2.jpg" alt="Image 2">
    <img class="scroll-fade-in" src="img3.jpg" alt="Image 3">
</div>
```

### 8. Combined Animations
```html
<!-- Using two animations at once -->
<div class="scroll-slide-up scroll-blur-in">
    <h2>Double Animation Effect</h2>
</div>
```

---

## CSS Customization Snippets

### Make Animations 2x Slower
```css
/* Add to top of style.css or in a new style tag */

.scroll-fade-in {
    animation: scrollFadeIn 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.scroll-slide-up {
    animation: scrollSlideUp 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.scroll-blur-in {
    animation: scrollBlurIn 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.scroll-scale-in {
    animation: scrollScaleIn 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
```

### Make Animations 2x Faster
```css
.scroll-fade-in {
    animation: scrollFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.scroll-slide-up {
    animation: scrollSlideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.scroll-blur-in {
    animation: scrollBlurIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.scroll-scale-in {
    animation: scrollScaleIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
```

### Increase Animation Distance
```css
@keyframes scrollSlideUp {
    from {
        opacity: 0;
        transform: translateY(60px); /* Increased from 40px */
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Decrease Animation Distance
```css
@keyframes scrollSlideUp {
    from {
        opacity: 0;
        transform: translateY(20px); /* Decreased from 40px */
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### More Blur on Entrance
```css
@keyframes scrollBlurIn {
    from {
        opacity: 0;
        filter: blur(16px); /* Increased from 8px */
    }
    50% {
        opacity: 0.7;
        filter: blur(8px);
    }
    to {
        opacity: 1;
        filter: blur(0);
    }
}
```

### Prevent All Animations (Debug)
```css
/* Add to style.css for testing without animations */
.scroll-fade-in,
.scroll-slide-up,
.scroll-blur-in,
.scroll-scale-in,
.scroll-stagger-1,
.scroll-stagger-2,
.scroll-stagger-3,
.scroll-stagger-4 {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
}
```

---

## JavaScript Snippets

### Check If Element Has Animation
```javascript
// In browser console
const element = document.querySelector('.scroll-slide-up');
console.log('Classes:', element.classList);
// Should show: ['scroll-slide-up', 'scroll-animate', ...]
```

### Get Count of Animated Elements
```javascript
const count = document.querySelectorAll(
    '.scroll-fade-in, .scroll-slide-up, .scroll-blur-in, ' +
    '.scroll-scale-in, .scroll-stagger-1, .scroll-stagger-2, ' +
    '.scroll-stagger-3, .scroll-stagger-4'
).length;

console.log(`Total animated elements: ${count}`);
```

### Check User's Motion Preference
```javascript
const prefersReducedMotion = 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

console.log('Prefers reduced motion:', prefersReducedMotion);
```

### Manually Trigger Animation on Element
```javascript
const element = document.querySelector('.my-element');
element.classList.add('scroll-animate');
```

### Remove Animation Temporarily
```javascript
const element = document.querySelector('.scroll-slide-up');
element.classList.remove('scroll-animate');
// Later, add it back
element.classList.add('scroll-animate');
```

### Log When Element Animates
```javascript
// Add this to console to debug
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('scroll-animate')) {
            console.log('Animation triggered:', mutation.target);
        }
    });
});

const config = { attributes: true, attributeOldValue: true };
document.querySelectorAll('[class*="scroll-"]').forEach((el) => {
    observer.observe(el, config);
});
```

---

## HTML Patterns

### Pattern 1: Full Section Animation
```html
<section id="features" class="section">
    <div class="container">
        <h2 class="section-title scroll-blur-in">
            Our Features
        </h2>
        
        <div class="features-grid">
            <div class="feature-card scroll-slide-up">
                <h3>Feature 1</h3>
                <p>Description</p>
            </div>
            <div class="feature-card scroll-slide-up">
                <h3>Feature 2</h3>
                <p>Description</p>
            </div>
            <div class="feature-card scroll-slide-up">
                <h3>Feature 3</h3>
                <p>Description</p>
            </div>
        </div>
    </div>
</section>
```

### Pattern 2: Staggered Text Article
```html
<article class="scroll-slide-up">
    <h2 class="scroll-blur-in">Article Title</h2>
    
    <p class="scroll-stagger-1">
        Opening paragraph introduces the topic with context...
    </p>
    
    <p class="scroll-stagger-2">
        Middle paragraph develops the main idea with examples...
    </p>
    
    <p class="scroll-stagger-3">
        Supporting paragraph adds more details and information...
    </p>
    
    <p class="scroll-stagger-4">
        Closing paragraph concludes with key takeaway...
    </p>
</article>
```

### Pattern 3: Image + Text Side by Side
```html
<div class="content-section">
    <div class="content-text scroll-slide-up">
        <h2>Section Title</h2>
        <p>Description text here</p>
    </div>
    
    <div class="content-image scroll-blur-in">
        <img src="image.jpg" alt="Description">
    </div>
</div>
```

### Pattern 4: Timeline Events
```html
<div class="timeline">
    <div class="timeline-event scroll-slide-up">
        <div class="year">2020</div>
        <h3>Event 1</h3>
        <p>Description</p>
    </div>
    
    <div class="timeline-event scroll-slide-up">
        <div class="year">2021</div>
        <h3>Event 2</h3>
        <p>Description</p>
    </div>
    
    <div class="timeline-event scroll-slide-up">
        <div class="year">2022</div>
        <h3>Event 3</h3>
        <p>Description</p>
    </div>
</div>
```

---

## Testing Checklist

```javascript
// Run in browser console to verify setup

// 1. Check Intersection Observer Support
console.log('Intersection Observer supported:', 
    'IntersectionObserver' in window);

// 2. Count animated elements
const count = document.querySelectorAll('[class*="scroll-"]').length;
console.log('Elements with scroll classes:', count);

// 3. Check for animation keyframes
const style = document.querySelector('style');
console.log('CSS loaded:', style !== null);

// 4. Check motion preference
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
console.log('Reduced motion enabled:', reduced);

// 5. Check if elements have animations applied
const elements = document.querySelectorAll('.scroll-animate');
console.log('Elements with scroll-animate class:', elements.length);
```

---

## Performance Test

```javascript
// Run in browser console to check performance

// Measure animation frame rate
let lastTime = performance.now();
let frameCount = 0;

function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
        console.log('FPS:', frameCount);
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
}

measureFPS();
// Should show ~60 FPS while scrolling
```

---

## Accessibility Test

```javascript
// Run in browser console to verify accessibility

// Check prefers-reduced-motion
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
console.log('User prefers reduced motion:', reduced);

// If user has this enabled, animations should not play
if (reduced) {
    console.warn('⚠️ Animations should be disabled for this user');
    
    // Verify animations are disabled
    const computed = window.getComputedStyle(
        document.querySelector('.scroll-fade-in')
    );
    console.log('Animation-duration:', computed.animationDuration);
    // Should be 0s or none
}
```

---

## Common Issues & Solutions

### Issue: Animation not playing
```html
<!-- ❌ Wrong -->
<div class="card">Content</div>

<!-- ✅ Right -->
<div class="card scroll-slide-up">Content</div>
```

### Issue: Animation too fast
```css
/* ❌ Too fast (0.6s) */
.scroll-fade-in {
    animation: scrollFadeIn 0.6s ease forwards;
}

/* ✅ Good (1.2s) */
.scroll-fade-in {
    animation: scrollFadeIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
```

### Issue: Text blurry on load
```html
<!-- ❌ Wrong - animation visible on load -->
<div class="scroll-blur-in" style="opacity: 0; filter: blur(8px);">
    Text
</div>

<!-- ✅ Right - CSS class handles initial state -->
<div class="scroll-blur-in">
    Text
</div>
```

---

## Files Reference

| File | Purpose | Edit For |
|------|---------|----------|
| `style.css` | Animation keyframes | Speed, distance, easing |
| `script.js` | Intersection Observer | Trigger timing, threshold |
| `index.html` | Animation classes | Which elements animate |

---

**All snippets are production-ready. Copy and paste directly! ✨**
