# Porfolio Website Codex

A five-page personal portfolio for Joseph Shaker, based in Aberdeen, NJ. This repository is separate from Personal-Portfolio-Website and uses Joseph's supplied photos, screenshots, biography, and contact links.

## Pages

- Home: typed roles, cropped portrait card, technology ticker, animated stats, featured project links, services, process, and contact CTA.
- About: education, story, principles, everyday kit, interests, and 2026 / 2024 / 2023 timeline.
- Projects: three manually controlled, keyboard-accessible slides with deep links, readable no-JavaScript articles, build notes, and GitHub CTA.
- Skills: self-assessed language bars, tool chips, practices, roadmap, and current interests.
- Contact: AOL email, GitHub, LinkedIn, validated email-draft form, native FAQ accordions, and next steps. Resume available by email on request.

## Run

Open index.html, or run `python3 -m http.server 8000` and visit http://localhost:8000. No dependencies or build step are required. Optional Google Fonts fall back to system fonts when offline.

## Interactions and accessibility

The carousel supports Previous / Next, selection dots, Arrow Left / Right, Home, and End. Links such as `projects.html#project-2` select the correct slide. There is no autoplay. All project articles remain readable without JavaScript.

The mobile navigation supports Escape and closes after selecting a link. Shared motion includes a progress bar, shrinking blur header, expo-curve reveals, staggered hero text, bounded portrait parallax, image zoom, counters, and skill fills. Motion respects the system preference, including changes during a visit. Focus rings, skip links, image descriptions, live status messages, and field-specific form errors are included.

The contact form opens a `mailto:` draft after validation. The visitor must send the message in their email app. There is no backend, automatic email delivery, or success claim. Form content is retained if an email app is unavailable.

## Deploy

Push main to GitHub. In Settings → Pages, use Deploy from a branch, main, / (root). All local paths are relative and support GitHub Pages repository URLs. This existing deployment should update after each push.

## Edit

Content is in the five HTML files, styling in styles.css, shared interactions in script.js, and supplied images in assets/. Language bars are self-assessed confidence levels. This portfolio describes LubeLogger as a self-hosted deployment of an existing app, not an app Joseph authored.

## Digital contact card and QR

The separate contact page includes a downloadable QR code generated locally with `qrencode` and decoded with `zbarimg` during validation. It encodes the canonical GitHub Pages URL for `contact-card.html`. Scanning opens that page in the phone browser after the visitor taps the camera link. The website cannot control whether a scanner uses a new tab or an in-app browser.

The mobile card includes email, GitHub, LinkedIn, Aberdeen NJ, a share action with copy fallback, and a vCard download. No phone number was supplied, so none is invented. Contact details are public by design. Publish these files before distributing the QR code.

To regenerate if the deployed URL changes:

```sh
qrencode -o assets/contact-qr.png -s 8 -m 4 -l H 'https://Fiercejojo88862.github.io/Porfolio-Website-Codex/contact-card.html'
```

The visual upgrade adds locally rendered purple aurora lighting, an orbital portrait, pointer lighting, subtle card tilt, a searchable Ctrl/Cmd+K navigation dialog, project selectors, and a skill focus explorer. Reduced-motion preferences remain supported. QR rendering requires no third-party service.

The five portfolio pages include a compact bottom-right contact popup. Its native details toggle works without JavaScript. Escape, outside click, and the close button dismiss it when JavaScript is available. The phone card remains the QR destination.

Accent styling uses bright purple (#bf70ff), with coordinated purple gradients, glows, borders, controls, and keyboard focus rings. Supplied photos, logos, and screenshots retain their original colors.

A visible purple mouse spotlight follows viewport pointer coordinates, with hover spotlights on cards and panels. Updates are capped at one animation frame. The effects are decorative, ignore clicks, retain the normal cursor, and switch off for touch and reduced-motion preferences.
