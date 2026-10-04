/**
 * Single source of truth for business information.
 * Re-skinning for another client starts here (plus design tokens in styles/_tokens.scss).
 * All values below are placeholder content.
 */
export const BRAND = {
  name: 'Kiln',
  legalName: 'Kiln Coffee Roasters',
  tagline: 'Roasted Tuesday. In your cup by Thursday.',
  city: 'Oakland, California',
  email: 'hello@kilnroasters.example',
  phone: '+1 (510) 555-0142',
  address: {
    line1: '418 Foundry Lane',
    line2: 'Oakland, CA 94607',
    mapsQuery: 'Foundry+Lane+Oakland+CA',
  },
  /** Weekly roast schedule — drives every date shown on the site. */
  schedule: {
    roastWeekday: 2, // Tuesday (0 = Sunday)
    cutoffWeekday: 1, // Monday
    cutoffHour: 18,
    deliveryDays: 2,
  },
  /** Café opening hours, keyed by weekday (0 = Sunday). null = closed. */
  hours: {
    0: [9, 15],
    1: null,
    2: [7, 16],
    3: [7, 16],
    4: [7, 16],
    5: [7, 17],
    6: [8, 17],
  } as Record<number, [number, number] | null>,
  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Journal', href: '#' },
  ],
  nav: [
    { label: 'The roast', href: '#roast' },
    { label: 'Coffees', href: '#coffees' },
    { label: 'Sourcing', href: '#sourcing' },
    { label: 'Café', href: '#cafe' },
  ],
  primaryCta: { label: 'Build your subscription', href: '#subscribe' },
} as const;
