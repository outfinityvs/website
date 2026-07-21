# Outfinity presentation-site rules

## Default page model

- Every public content page outside the home page is a short, linked presentation.
- Keep `index.html` as the home/quick-presentation entry point. Keep footer legal pages (`legal-disclaimer.html`, `privacy-policy.html`, and `imprint.html`) as conventional documents.
- A presentation has a cover slide using the reusable `<outfinity-cover>` component—the established animated Outfinity Capital / `presentation.html` cover—followed by two or three concise essence slides. Use an approved multi-node diagram when the topic has real relationships; otherwise use two strong overview/essence slides, never a decorative single-box slide.
- Use the existing `<outfinity-presentation>` component and the tested diagram classes/layouts from `docs/presentation.html` or `docs/outfinity-capital.html`. Adapt content; do not create a competing visual system.
- Keep headings short (normally two to three words in diagram nodes) and retain the approved source wording in the underlying article rather than discarding it.

## Long-form content and navigation

- A `View Article …` action opens only the article's substantive text in the presentation popup. It must not navigate away from the current presentation and must omit `Continue Exploring`, contact/reach-out CTAs, forms, footer navigation, and other presentation navigation.
- Presentation-to-presentation links are allowed only for genuinely related topics. Configure them as node/detail links or the separate `Continue Exploring` slide.
- Keep a complete article payload in the page (or an explicitly referenced local article source) so no approved ideas are lost. Render it inside the popup on demand.
- Keep substantive article text discoverable in static HTML (`article.presentation-seo-source`) or expose an explicit local editorial article through `rel="alternate"`; do not rely solely on JavaScript-generated text or inert templates for indexing.
- Contact and `Continue Exploring` may be separate presentation slides only when they help the topic; they must never be included inside the article popup. A contact slide, when present, preserves the site contact wording and its Google document/form destination.

## Responsive and integration requirements

- Use the global navigation injected by `docs/js/nav.js`, keep it contained at tablet widths, and use `docs/css/presentation.css` plus the shared component script.
- Every presentation keeps the standard footer below the deck: `Outfinity Venture Validation Studio - Research-backed AI venture formation.` plus Legal Disclaimer, Privacy Policy, Imprint, Terms, Cookies, and Quizzes.
- Article popups begin with the article/page title, use compact top padding, and remove all contact, Continue Exploring, footer, and navigation material.
- On mobile, do not add nonessential animation/progress UI that increases vertical scrolling. Preserve the established radar/deck rules on home.
- Make each slide usable with keyboard navigation, details popup close behavior, and reduced-motion settings.
- Do not use a `tower.html` route. The public presentation route is `presentation.html`.

## Validation

- Run syntax checks for changed JavaScript, `git diff --check`, and verify every converted page has the shared component, reusable cover, at least a cover plus two substantive essence slides, and an article popup source. Verify optional contact/exploration slides are absent from the popup.
