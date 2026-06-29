# Ridge Junior Abuto — Portfolio

A single-page portfolio site for Ridge Junior Abuto, Flutter Developer & Mobile Engineer based in Nairobi. Built with plain HTML, CSS, and JavaScript — no bundler or build step required.

## Live Site

<https://ridgejunior.dev/>

## Features

- Glassmorphism UI with dark/light theme toggle
- Responsive layout with mobile-first approach
- Video hero with mobile poster fallback
- SVG icon sprite system (no external icon CDN)
- Lazy-loaded Firebase integration for reviews
- Accessible: skip link, ARIA labels, focus trapping, reduced-motion support
- SEO: Open Graph, Twitter Cards, JSON-LD structured data
- Property-based tests using fast-check

## Project Structure

```
Portfolio/
├── index.html              # Main HTML file (single page)
├── css/
│   └── style.css           # All styles, organised with section headers
├── js/
│   └── script.js           # Single IIFE-wrapped module
├── Images/                 # Local image assets
│   ├── profile_img.jpg     # Hero avatar / LCP image
│   ├── og-cover.jpg        # Open Graph social image
│   ├── haraka.png          # Project screenshot
│   └── …                   # Other project & favicon images
├── assets/
│   ├── hero.mp4            # Hero background video
│   ├── about.mp4           # About section video
│   └── hero-poster.jpg     # Mobile fallback poster
├── Documents/
│   └── RIDGE JUNIOR ABUTO 2026.pdf   # Downloadable CV
├── docs/                   # Documentation archive
├── tests/                  # Property-based & smoke tests
├── favicon.ico
├── .gitignore
└── README.md               # This file
```

## Getting Started

### Open Locally

No installation needed. Just open `index.html` in any modern browser:

```bash
# Option A: open the file directly
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux

# Option B: use a local static server (optional, needed for ES module imports)
npx serve .
# or
python -m http.server 8000
```

### Run Tests

Tests use fast-check loaded via CDN in an HTML test harness:

```bash
# Start a local server, then open tests/test-runner.html in a browser
npx serve .
# Navigate to http://localhost:3000/tests/test-runner.html
```

## Deployment

The site is fully static — deploy to any static hosting provider:

### Netlify

1. Push the repo to GitHub/GitLab.
2. Connect the repo in [Netlify](https://app.netlify.com/).
3. Set publish directory to `/` (root). No build command needed.

### Vercel

```bash
npx vercel --prod
```

### GitHub Pages

1. Go to **Settings → Pages** in the repository.
2. Set source to the `main` branch, root folder.
3. Save — the site deploys automatically.

### Manual Upload

Upload all files (index.html, css/, js/, Images/, assets/, Documents/, favicon.ico) to any web server or CDN bucket.

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is available for personal use.

---

Built by Ridge Junior Abuto
