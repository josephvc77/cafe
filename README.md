# Kiln Coffee Roasters — premium Angular storefront

A single-page subscription storefront for a small-batch roaster, built as a reusable
commercial foundation. Creative direction: [`docs/CREATIVE_BRIEF.md`](docs/CREATIVE_BRIEF.md).

```bash
npm install
npm start        # http://localhost:4200
npm run build    # production build → dist/frontend
```

Angular 16 (standalone components + signals) · SCSS tokens · GSAP + ScrollTrigger · Three.js (lazy).

## Re-skinning for another client

| Change | Where |
|---|---|
| Name, address, hours, roast schedule, nav, CTA | `src/app/core/config/brand.config.ts` |
| Products | `src/app/core/data/coffees.data.ts` |
| Editorial copy, FAQ, testimonials, sourcing ledger | `src/app/core/data/content.data.ts` |
| Colours, type, spacing, motion, frost | `src/styles/_tokens.scss` (raw palette → semantic tokens) |
| Pricing & bag-sizing logic | `src/app/core/state/subscription.store.ts` |
| Checkout / CRM integration | `src/app/core/services/order.service.ts` (demo stub) |
| Section order | `src/app/app.component.ts` |

All business facts in the demo are placeholders.

## Architecture

```
src/app/
  core/        config · data · state (signals) · services (motion, device, order) · utils
  components/
    navigation/  header + mobile sheet, mobile sticky CTA
    hero/        hero composition + intro timeline
    sections/    proof strip, roast story, line-up, ledger, voices, café, FAQ, final CTA
    forms/       subscription builder + roast-ticket summary/checkout
    three/       BeanScene (framework-free) + RoastBeanComponent (lifecycle, fallback)
    motion/      kilnReveal, kilnSplitWords, kilnMagnetic directives
    ui/          coffee bag SVG, icons
src/styles/    tokens · base · type · materials (paper, ticket, frost, night) · buttons · mq
```

## Motion & performance rules

- All GSAP work runs outside Angular's zone; scroll-driven values are written to the DOM
  directly, never through change detection.
- `prefers-reduced-motion`: no scrubbing or reveals, curve fully drawn, bean static.
- Three.js is a separate lazy chunk, loaded only when the bean nears the viewport, paused
  off-screen, disposed on destroy. An SVG bean in the same roast colour shows first and
  remains the fallback for no-WebGL / Save-Data.
