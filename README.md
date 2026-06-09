# Monetag Earn Pro — v2

**Ultra-Premium Glassmorphism Publisher Platform**

Black & white glassmorphism UI with dark/light mode, PWA support, global search, Monetag ads, and smooth 60fps animations.

## Features

- 🎨 Premium glassmorphism black/white UI with dark/light theme toggle
- ⚡ Ultra-smooth 60fps animations with `cubic-bezier(0.16, 1, 0.3, 1)`
- 🔍 Global full-text search (Ctrl+K / ⌘K)
- 💼 16+ government job listings with filters & detail modal
- 📋 12+ government schemes with card layout
- 📝 30+ competitive exams across 6 categories with tabs
- 🏆 Exam results, admit cards & answer keys
- 📱 Fully responsive — mobile hamburger nav, fluid typography
- 🌗 Dark/Light mode with system preference detection & persistence
- 🔔 Push notification prompt
- 💾 PWA with service worker & offline support
- 💰 Monetag ad slots (header, in-article×3, footer)
- ♿ Accessible — skip link, ARIA labels, keyboard navigation, reduced motion
- 🚀 Zero build step — pure HTML/CSS/JS
- 📦 Deploy to Netlify, Vercel, Cloudflare Pages, or GitHub Pages

## Quick Deploy

```bash
# Netlify
npx netlify deploy --prod --dir=.

# Vercel
npx vercel --prod

# Cloudflare Pages
# Connect repo → Framework: None → Publish: .
```

## Monetag Integration

Zone ID: `4d812b3e49e9fbb4acd04dbca11b6193`

Ad formats:
- Popunder/Vignette (`monetag/v/2025.js`)
- In-page Push (`monetag/p/2025.js`)
- Banner slots (header, in-article×3, footer)

## File Structure

```
├── index.html       # Main page (SEO, OG, JSON-LD, PWA manifest)
├── styles.css       # Full glassmorphism system + dark/light theme
├── app.js           # All logic (search, modal, service worker, tabs, ads)
├── sw.js            # Service worker (cache-first strategy)
├── offline.html     # Offline fallback page
├── favicon.svg      # SVG favicon
├── manifest.json    # PWA manifest
├── robots.txt       # SEO
├── sitemap.xml      # SEO
├── .env.example     # Zone ID config template
├── netlify.toml     # Netlify deployment config
└── vercel.json      # Vercel deployment config
```
