# Kiln Coffee Roasters — Creative Brief

> All business facts (name, address, prices, farms, quotes, stats) are **placeholder
> assumptions**. They live in `src/app/core/config/brand.config.ts` and
> `src/app/core/data/*.ts` so the site can be re-skinned for a real client.

## Business
Small-batch specialty roaster + café in Oakland. Roasts every Tuesday, only to order.
Every bag carries its roast date and farm lot. Revenue: subscriptions (primary),
café, one-off bags, wholesale. Differentiator: coffee arrives ~48h after roasting,
and the roaster publishes what it pays farms.

## Audience
- **Primary:** 25–45 home brewers who own a grinder, buy online, and are tired of stale beans.
  Objections: lock-in, choice paralysis, price.
- **Secondary:** Oakland café regulars, gift buyers, wholesale accounts.

## Goals
- **Primary:** start a subscription.
- **Secondary:** visit the café · trust through sourcing transparency · one-off orders
  (handled by the builder's "Just once" cadence).

## Brand
Crafted, candid, warm, slightly witty. A working roastery, not a luxury house.
Emotion: *confidence* ("they know what they're doing") + *appetite* ("I want this Thursday").

## Concept — "The Roast Ticket"
A roastery's own paperwork made beautiful: kraft, ink, stamped roast dates, perforated
tickets, ruled ledgers — around one coffee bean that roasts in front of you.
The subscription summary *is* a roast ticket.

## Visual language
| Token | Value | Use |
|---|---|---|
| Paper | `#F1EADC` | page |
| Ink | `#1D1511` | text |
| Ember | `#B8431D` | accent / CTA |
| Green coffee | `#7E8C5A` / `#55603A` | secondary |
| Night | `#15100D` | roast chapter, dark mode |

Type: **Fraunces** (display, opsz/SOFT/WONK axes) · **Instrument Sans** (body) ·
**IBM Plex Mono** (tickets, data). Shapes: hairlines, near-square corners, perforations,
stamps. Imagery: parameterised SVG bags, topographic lines, one 3D bean — no stock photos.
Material: paper + grain. Glass only on the scrolled header (steamed window).

## Motion — "slow heat"
Unhurried expo-out easing, masked word rises, stamps with a slight overshoot, one pinned
roast chapter. Magnetic CTAs on fine pointers only. Reduced motion: no pin, drawn curve,
static roasted bean, all text visible.

## 3D
One procedural bean (Three.js). Hero: roasts green → brown on load. Roast chapter:
scroll-driven roast. Lazy chunk, paused off-screen, disposed on destroy, SVG fallback for
no-WebGL / low-power / save-data.

## Page structure
Header → Hero → Proof strip → The Roast (pinned) → This week's coffees → Subscription
builder + live ticket → Sourcing ledger → Subscribers → Café (live open/closed) → FAQ →
Final cutoff call → Footer · Mobile sticky CTA.
