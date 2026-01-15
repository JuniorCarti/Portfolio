# Light & Dark Mode - Quick Troubleshooting

## 🎯 Quick Fixes If Text Isn't Visible

### ✅ Dark Mode Issues (Text Too Light)
If text is too light/hard to see in dark mode:
1. Background might be too light
2. Check hero overlay opacity (should be 0.6-0.4)
3. Verify CSS file loaded with all changes

**Fix:** Refresh browser (Ctrl+Shift+R or Cmd+Shift+R) for hard refresh

---

### ✅ Light Mode Issues (Text Too Dark)
If text is too dark/hard to see in light mode:
1. Hero overlay might be too dark
2. Check if light theme is properly applied

**Fix:**
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find `theme: light` entry
4. Delete it and toggle theme again

---

### ✅ Buttons Not Showing Text
If buttons have no visible text:
1. Check if `color: var(--text-primary)` is applied
2. Might be missing text shadow

**Fix:** Search CSS for `.btn-primary` and `.btn-secondary`, ensure they have:
```css
color: var(--text-primary);
text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
```

---

### ✅ Hero Section Text Not Readable
If hero text (title, description) is hard to read over video:

**Dark Mode:**
- Hero overlay should be: `rgba(0, 0, 0, 0.6)` to `rgba(0, 0, 0, 0.2)`
- Text should be white (#ffffff)
- Add text-shadow for extra contrast

**Light Mode:**
- Hero overlay should be lighter: `rgba(0, 0, 0, 0.3)` to `rgba(0, 0, 0, 0.1)`
- Text should be dark (#0f172a)
- Text shadow still helps

---

### ✅ Avatar Not Visible
If circular avatar (top-right) is not visible:
1. Check z-index (should be 4)
2. Ensure `.hero-avatar` has proper border color

**Fix:** Avatar should have:
```css
border: 3px solid var(--primary);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

---

## 🔍 Debug Checklist

**Step 1: Check Theme is Applied**
- Open DevTools (F12)
- Select `<html>` element in Inspector
- Should show: `<html data-theme="dark">` or `<html data-theme="light">`

**Step 2: Check CSS Variables**
- Right-click any text → Inspect
- Look at Styles panel
- Should show: `color: var(--text-primary)` (NOT `color: white`)
- Computed value should show actual hex color

**Step 3: Check Local Storage**
- DevTools → Application → Local Storage
- Should see key: `theme` with value: `dark` or `light`
- If missing, theme toggle button may not be working

**Step 4: Check Network Tab**
- Make sure CSS file loaded successfully
- No 404 errors
- File size should be ~1900+ lines

---

## 🚨 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Text white in light mode | CSS not loaded | Hard refresh (Ctrl+Shift+R) |
| Text dark in dark mode | CSS variables not set | Check localStorage clear |
| Buttons invisible | Color: white hardcoded | Replace with `var(--text-primary)` |
| Hero unreadable | Overlay too dark in light | Adjust overlay opacity |
| Avatar blends in | No border/shadow | Add border and box-shadow |
| Toggle doesn't work | JavaScript error | Check console (F12) |

---

## 🧪 Manual Test Steps

1. **Toggle theme** → Button top-right changes icon
2. **Check hero section:**
   - Dark: White text on dark overlay ✓
   - Light: Dark text on light overlay ✓
3. **Check buttons:**
   - Dark: White text visible ✓
   - Light: Dark text visible ✓
4. **Check cards:**
   - Dark: White/light text on dark ✓
   - Light: Dark text on light ✓
5. **Check avatar:**
   - Visible in both modes ✓
6. **Check navigation:**
   - Text clear in both modes ✓

---

## 📞 Still Having Issues?

Check the detailed guide: [LIGHT_DARK_MODE_GUIDE.md](LIGHT_DARK_MODE_GUIDE.md)

Key files:
- CSS variables: `css/style.css` lines 1-80
- Hero overlay: `css/style.css` lines 457-478
- Theme toggle: `js/script.js` function `initTheme()`
