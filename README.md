# Kaeyan AI Studio — Website

A premium, single-page website for an AI product/design studio. Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build step.

## Structure

```
kaeyan-ai-studio/
├── index.html      # All markup/sections
├── style.css        # Design tokens, layout, responsive, animations
├── script.js         # Interactivity, data, and animations
├── assets/
│   └── logo.svg      # Placeholder logo/favicon — swap for your real mark
└── README.md
```

## Running it

No build tools needed. Either:

- Open `index.html` directly in a browser, **or**
- Serve it locally for the best experience (some browsers restrict certain features on `file://`):

```bash
npx serve .
# or
python3 -m http.server 8080
```

## What's inside

- Hero with a mouse-reactive canvas "neural network" (signature visual element)
- Sticky glass navbar, mobile menu, dark/light theme toggle (remembered via `localStorage`)
- Scroll-reveal animations, animated counters, custom cursor, magnetic CTA buttons
- Services grid — 9 practice areas (covering all 35+ requested specialisations) with expandable detail panels
- Bento-grid "Why choose us" section
- Animated 7-stage process timeline
- Portfolio grid with a full case-study modal (overview, problem, research, process, design system, outcome) and keyboard/prev-next navigation
- Pricing tiers, infinite testimonial marquee, accordion FAQ
- Contact form (client-side validated demo — wire up to your backend/email service) + newsletter field
- SEO basics: meta description, Open Graph tags, JSON-LD schema, semantic headings
- Respects `prefers-reduced-motion`, visible focus states, keyboard navigation throughout

## Before you launch

1. Replace `assets/logo.svg` with your real logo/wordmark and favicon.
2. Swap the placeholder gradient thumbnails in Services/Portfolio for real photography and screenshots.
3. Connect the contact form and newsletter form to a real backend (e.g. Formspree, a serverless function, or your CRM).
4. Add a real Google Maps embed in place of the map placeholder in the Contact section.
5. Update copy (pricing, team stats, testimonials) with your actual numbers.
6. Add a proper `og-image` and run a Lighthouse pass once real assets are in place.

## Design tokens (for reference)

| Token | Value |
|---|---|
| Background | `#050816` |
| Secondary background | `#0C1124` |
| Primary | `#0E183C` |
| Gradient | `#3171F3 → #8438E6` |
| Accent | `#8A6CFF` |
| Success | `#00E0A4` |
| Text primary / secondary | `#FFFFFF` / `#B8B8C0` |
| Display font | Space Grotesk |
| Body font | Inter |
