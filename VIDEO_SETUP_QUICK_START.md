# Quick Reference: Video Hero Fixes

## ✅ What Was Updated

### 1. Live Server Setup
**Why:** Videos don't work with `file://` protocol
- **File protocol** → CORS blocks video, no autoplay
- **HTTP (Live Server)** → Videos load, autoplay works

**How to use:**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Browse to `http://localhost:5500`

[Full instructions → SETUP_INSTRUCTIONS.md]

---

### 2. Video Cropping Fixed

**Changes Made:**
- Hero height reduced: `100vh` → `70vh` (less cropping, more content visible)
- Added `object-position: center top` (controls what part of video shows)
- Kept `object-fit: cover` (fills entire background)

**Current Result:**
- More of the video visible
- Less aggressive cropping
- Premium look maintained

---

## 🎬 How to Customize

### Quick Tweaks in `css/style.css` (Line ~425)

**Show different part of video:**
```css
/* Current - shows top portion (good for faces, sky) */
object-position: center top;

/* Alternative options: */
object-position: center;        /* Show middle */
object-position: center bottom; /* Show bottom */
object-position: 50% 25%;       /* Custom: 50% left, 25% from top */
```

**Hide black bars (show entire video):**
Search for "OPTION 2" in the CSS around line 432-441, uncomment that block.

**Make hero taller/shorter:**
Line ~404 in CSS:
```css
min-height: 70vh;  /* Change: 100vh (full), 60vh (compact) */
```

---

## 📱 Desktop vs Mobile

**Desktop:** Avatar top-right, full video hero
**Tablet (1024px):** Avatar shrinks to 140px
**Mobile:** Avatar responsive, cleaner layout

---

## 🚀 To Deploy

1. Upload `assets/hero.mp4` to server
2. Upload all other files
3. Test in Chrome, Firefox, Safari
4. Verify autoplay works

---

**Files Changed:**
- `css/style.css` - Video positioning + height
- `SETUP_INSTRUCTIONS.md` - New guide
- `HERO_VIDEO_CUSTOMIZATION.md` - Detailed customization

**Next Step:** Start Live Server and refresh to see improvements! 🎉
