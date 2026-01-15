# Quick Reference: Scroll Animations

## 🎬 Animation Classes

| Class | Effect | Duration | Best For |
|-------|--------|----------|----------|
| `scroll-fade-in` | Opacity transition | 1.2s | Text, cards |
| `scroll-slide-up` | Slide up + fade | 1.4s | Sections, containers |
| `scroll-blur-in` | Blur → Sharp | 1.6s | Headers, featured text |
| `scroll-scale-in` | Scale + fade | 1.4s | Images, items |
| `scroll-stagger-1` to `-4` | Staggered reveal | 1.2s + delay | Multiple lines |

---

## 📝 Usage Examples

### 1. Fade In Text Block
```html
<div class="about-card glass-card scroll-fade-in">
    <p>Your content here</p>
</div>
```

### 2. Slide Up Section
```html
<div class="skill-card glass-card scroll-slide-up">
    <h3>Skill Title</h3>
    <p>Description</p>
</div>
```

### 3. Blur In for Headers
```html
<h2 class="scroll-blur-in">Featured Project</h2>
```

### 4. Staggered Paragraph Reveal
```html
<div class="scroll-slide-up">
    <p class="scroll-stagger-1">First paragraph</p>
    <p class="scroll-stagger-2">Second paragraph</p>
    <p class="scroll-stagger-3">Third paragraph</p>
</div>
```

### 5. Image Scale In
```html
<img class="scroll-scale-in" src="image.jpg" alt="Description">
```

---

## ⚙️ How It Works

1. **Add animation class** to HTML element
2. **CSS defines** the animation keyframes (already in style.css)
3. **JavaScript monitors** when element enters viewport
4. **Animation triggers** when element becomes visible

---

## 🎨 Customization

### Slow Down Animation (in style.css)
```css
.scroll-fade-in {
    animation: scrollFadeIn 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    /* Changed from 1.2s to 1.6s */
}
```

### Speed Up Animation
```css
.scroll-fade-in {
    animation: scrollFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    /* Changed from 1.2s to 0.8s */
}
```

### Increase Slide Distance
```css
@keyframes scrollSlideUp {
    from {
        transform: translateY(80px); /* Increase from 40px */
    }
    to {
        transform: translateY(0);
    }
}
```

---

## 📱 Responsive

Animations work on:
- ✅ Desktop (all browsers)
- ✅ Tablet (iPad, Android)
- ✅ Mobile (iOS, Android)
- ✅ Respects `prefers-reduced-motion` setting

---

## 🎯 Current Implementation

Your portfolio has animations on:
- ✅ About section text (staggered)
- ✅ Stat cards (fade-in)
- ✅ About image (blur-in)
- ✅ All skill cards (slide-up)
- ✅ All education timeline items (slide-up)
- ✅ Project cards (slide-up)

---

## 🔧 Adding Animation to New Elements

Simply add the class to any element:

```html
<!-- Before -->
<div class="my-card">Content</div>

<!-- After - Add animation class -->
<div class="my-card scroll-slide-up">Content</div>
```

That's it! The JavaScript automatically handles it.

---

## ♿ Accessibility

For users with `prefers-reduced-motion` enabled:
- Animations are skipped
- Content appears instantly
- Full functionality maintained
- No reduced motion penalty

---

## 📊 Performance

- **60 FPS** on modern devices
- **Zero layout shifts**
- **GPU accelerated** (uses transform/opacity)
- **Lightweight** (Intersection Observer, no libraries)

---

## 🆘 Troubleshooting

**Animation not working?**
1. Check element has animation class
2. Verify element is within viewport threshold
3. Check console for JavaScript errors
4. Try reloading page

**Too fast/slow?**
1. Edit animation duration in `style.css`
2. Adjust the time value (e.g., 1.2s → 2s)

**Not responsive?**
1. Ensure viewport meta tag is present
2. Test in mobile browser
3. Check mobile responsiveness CSS

---

**Files to modify:**
- `index.html` - Add animation classes
- `css/style.css` - Define animations
- `js/script.js` - Intersection Observer logic

**Complete guide:** See `SCROLL_ANIMATIONS_GUIDE.md`
