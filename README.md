# Kaeyan AI Studio — Website

A premium, single-page marketing site for **Kaeyan AI Studio** (*AI • Websites • Automation • Branding*), built with plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step.

## Project structure

```
kaeyan-ai-studio/
├── index.html          Full page markup (all sections)
├── style.css            Design tokens, layout and all animation styles
├── script.js             All interactivity (vanilla JS, no dependencies)
├── assets/
│   ├── favicon.svg       Placeholder favicon (logo mark)
│   └── og-cover.svg      Placeholder Open Graph / Twitter share image
└── README.md
```

## Running it locally

No build tools required. Either:

1. Double-click `index.html` to open it directly in a browser, or
2. Serve it locally for the best experience (some browsers restrict certain features on `file://`):

   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```

Then visit `http://localhost:8080` (or whichever port your tool prints).

## What's included

- **Sections**: sticky navbar, hero with canvas particle field + animated orb illustration, trusted-technologies marquee, about, 17-service accordion (features/deliverables/timeline/price per service), why-choose-us grid, 3-tier pricing, 6-step animated process timeline, portfolio grid, FAQ accordion, contact form with validation, and a full footer with newsletter signup.
- **Motion**: page-load sequence, scroll-reveal via `IntersectionObserver`, animated counters, magnetic buttons, button ripple, marquee loop, accordion open/close transitions, timeline scroll-progress fill, ambient cursor glow and floating gradient shapes — all built with CSS transitions/keyframes plus `requestAnimationFrame` where continuous motion is needed.
- **Accessibility**: semantic landmarks, visible focus states, `aria-expanded` on all accordions, `prefers-reduced-motion` support that disables non-essential motion.
- **SEO**: descriptive meta tags, Open Graph + Twitter Card tags, `Organization` JSON-LD schema, semantic heading structure.
- **Responsive**: fluid layout with breakpoints for desktop, laptop, tablet and mobile, including a slide-in mobile navigation drawer.

## Customizing

- **Colors, type scale and spacing** are all defined as CSS custom properties at the top of `style.css` under `:root` — change a value once and it updates everywhere.
- **Logo**: replace the `K` mark in the `.navbar__logo-mark` / `.footer__brand` elements in `index.html`, and swap `assets/favicon.svg` and `assets/og-cover.svg` with your final artwork.
- **Copy and pricing**: all text lives directly in `index.html` — service descriptions, pricing tiers, FAQ answers and portfolio case studies can be edited in place.
- **Contact form**: `script.js` currently validates fields client-side and shows a success message on submit (no backend). Wire the `contactForm` submit handler in `script.js` up to your endpoint of choice (e.g. Formspree, a serverless function, or your own API) when you're ready to receive real submissions.

## Browser support

Built with modern, broadly-supported CSS (custom properties, grid, backdrop-filter) and JS (`IntersectionObserver`, `requestAnimationFrame`). Backdrop blur gracefully degrades to a solid background on browsers without support.
