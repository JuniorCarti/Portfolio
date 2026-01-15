# Hero Video Background - Customization Guide

## Current Setup

Your hero section now uses **70vh height** with **`object-fit: cover`** and **`object-position: center top`** for optimal video visibility.

---

## CSS Options Explained

### Option 1: `object-fit: cover` (Default - Recommended) ✅

```css
.hero-video {
    object-fit: cover;
    object-position: center top;  /* Shows top portion of video */
}
```

**Characteristics:**
- Video scales to fill entire hero section
- Maintains aspect ratio
- Some edges may be cropped (controllable via `object-position`)
- Creates a premium, immersive background feel

**`object-position` Values to Try:**
| Position | Usage | Effect |
|----------|-------|--------|
| `center` | Default centered crop | Shows middle of video |
| `center top` | Recommended | Shows top portion (faces, sky) |
| `center bottom` | Lower focus | Shows bottom portion |
| `50% 25%` | Custom | 50% from left, 25% from top |
| `0% 0%` | Top-left corner | Shows top-left quadrant |
| `100% 100%` | Bottom-right corner | Shows bottom-right quadrant |

---

### Option 2: `object-fit: contain` (Alternative)

Uncomment the commented section in `css/style.css` (lines 432-441) and comment out Option 1.

```css
.hero-video {
    object-fit: contain;
    object-position: center;
}
```

**Characteristics:**
- Shows entire video without cropping
- May have black bars above/below video
- Best for portrait-oriented videos
- Smaller visual impact but no cropping

**When to use:**
- Video dimensions don't match screen aspect ratio
- Want to show full video content
- Prioritize visibility over immersion

---

## Hero Height Customization

Current: **`min-height: 70vh`**

To adjust visibility vs. page scrolling:

```css
.hero {
    min-height: 70vh;  /* Current - more content visible above fold */
    /* min-height: 100vh;  /* Alternative - full viewport */
    /* min-height: 60vh;  /* Compact - less hero section */
}
```

| Height | Use Case |
|--------|----------|
| `100vh` | Full immersive hero, premium feel |
| `90vh` | Good balance with slight content below |
| `70vh` | More content visible, less scrolling |
| `60vh` | Compact, quick access to other sections |

---

## Quick Adjustments

### To Change Video Cropping Focus:

Edit line ~425 in `style.css`:
```css
object-position: center top;  /* Change this value */
```

**Examples:**
- Focusing on faces: `object-position: center top;`
- Showing action in center: `object-position: center center;`
- Landscape/nature focus: `object-position: center bottom;`

### To Use Contain Mode (No Cropping):

1. Find the commented section around line 432
2. Comment out the first `.hero-video` block
3. Uncomment the OPTION 2 block

### To Go Back to Full Hero (100vh):

Edit line ~404:
```css
min-height: 100vh;  /* From 70vh */
```

---

## Video File Recommendations

For best results with the current setup:

**Optimal Video Specs:**
- Resolution: **1920×1080 (16:9 aspect ratio)** or higher
- Duration: **5-10 seconds** with loop
- File size: **2-5 MB** (optimized for web)
- Format: **MP4 (H.264 codec)**
- Framerate: **30fps** or **60fps**

**Export Settings (Recommended):**
- Codec: H.264
- Quality: High (but optimized)
- Audio: Muted (or removed)
- Bitrate: 4-8 Mbps

---

## Live Testing Checklist

After making changes, test in Live Server:

- [ ] Video loads and plays automatically
- [ ] No black bars or cropping issues
- [ ] Avatar displays correctly (top-right)
- [ ] Text readable over video
- [ ] Responsive on tablet and mobile
- [ ] Motion preference respected (no autoplay if enabled)

---

## Troubleshooting

**Video appears too zoomed:**
- Try `object-position: center bottom;` or `center;`
- Consider switching to `object-fit: contain;`
- Reduce hero height to `60vh`

**Video not filling entire section:**
- Use `object-fit: cover;` (current default)
- Ensure video resolution is 1920×1080 or higher
- Check if `object-fit: contain;` is active

**Avatar positioning off:**
- Hero height change may affect avatar placement
- Avatar auto-adjusts for tablet/mobile in media queries
- Check responsive breakpoints (1024px, 768px)

**Video not autoplaying:**
- Ensure using Live Server (not `file://` protocol)
- Check browser autoplay policies
- Verify video file exists at `assets/hero.mp4`

---

## Production Notes

When deploying to production:
1. Ensure `assets/hero.mp4` is uploaded correctly
2. Set proper MIME type: `video/mp4`
3. Enable CORS headers if on different domain
4. Test autoplay in all major browsers
5. Verify responsive behavior on actual mobile devices

