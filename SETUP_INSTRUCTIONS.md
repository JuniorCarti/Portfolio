# Portfolio Setup Instructions

## Running Your Portfolio Locally

### Prerequisites
- Visual Studio Code installed
- Live Server extension for VS Code

### Installation Steps

#### 1. Install Live Server Extension
1. Open VS Code
2. Go to **Extensions** (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for **"Live Server"** by Ritwick Dey
4. Click **Install**

#### 2. Start Live Server
1. Open your Portfolio folder in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**
   - OR use the "Go Live" button in the bottom-right corner
4. Your browser will automatically open to `http://localhost:5500`

### Why Live Server is Required

**File Protocol (`file://`) Issues:**
- ❌ Background videos won't autoplay
- ❌ Videos may not load due to CORS restrictions
- ❌ Some CSS/JS features don't work properly

**Live Server (`http://localhost`) Benefits:**
- ✅ Videos autoplay with proper MIME types
- ✅ Full CORS support
- ✅ Real-time reload on file changes
- ✅ Proper HTTP headers for all assets
- ✅ Cross-browser compatibility

### Testing the Setup

Once Live Server is running:
1. Navigate to the **Hero section** (top of page)
2. You should see:
   - Background video autoplaying
   - Circular profile avatar (top-right)
   - Dark gradient overlay for text readability
   - All animations triggering on scroll

### Troubleshooting

**Video not playing?**
- Ensure `assets/hero.mp4` exists in your project
- Check browser console (F12) for error messages
- Verify Live Server is running (look for "Go Live" status in VS Code)

**Portfolio not updating after changes?**
- Live Server auto-reloads, but try:
  - Manual refresh (F5 or Cmd+R)
  - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

**Avatar not visible?**
- Ensure `Images/profile_img.jpg` exists
- Check CSS is loaded (inspect element styling)

### Production Deployment

When deploying to production:
- Use any standard web host (GitHub Pages, Vercel, Netlify, etc.)
- Ensure MIME types are correct:
  - `.mp4` → `video/mp4`
  - `.jpg` → `image/jpeg`
- Test videos play automatically on deployment

---

**Need help?** Check browser DevTools (F12) → Console for detailed error messages.
