/** Placeholder editorial content. Replace per client. */

export const PROOF_POINTS = [
  { value: '48h', label: 'Roaster to doorstep' },
  { value: '9', label: 'Partner farms, named on every bag' },
  { value: '2.3×', label: 'Average price paid over commodity' },
  { value: '0', label: 'Bags roasted “for stock”' },
];

export const ROAST_STAGES = [
  {
    id: 'drying',
    time: '0:00–4:30',
    temp: '→ 150 °C',
    title: 'Drying',
    body: 'Green coffee is 11% water. We drive it out gently, so the bean heats evenly to its core.',
    at: 0,
  },
  {
    id: 'maillard',
    time: '4:30–8:40',
    temp: '150 → 196 °C',
    title: 'Browning',
    body: 'Sugars and amino acids react. Sweetness, body and the first cocoa-and-bread aromas are built here.',
    at: 0.38,
  },
  {
    id: 'crack',
    time: '8:40',
    temp: '196 °C',
    title: 'First crack',
    body: 'Steam pressure splits the bean with an audible pop. From here, every ten seconds changes the cup.',
    at: 0.7,
  },
  {
    id: 'development',
    time: '8:40–10:50',
    temp: '196 → 205 °C',
    title: 'Development',
    body: 'We drop each lot by taste, not by clock — then it is bagged, dated, and on a truck the same afternoon.',
    at: 0.84,
  },
];

export const LEDGER = [
  { farm: 'Dima washing station', country: 'Ethiopia', years: 4, paid: '$4.60', ratio: '2.6×' },
  { farm: 'Finca El Mirador', country: 'Colombia', years: 6, paid: '$4.10', ratio: '2.3×' },
  { farm: 'Gatura cooperative', country: 'Kenya', years: 3, paid: '$5.20', ratio: '2.9×' },
  { farm: 'Fazenda Boa Vista', country: 'Brazil', years: 5, paid: '$3.05', ratio: '1.7×' },
  { farm: 'Las Nubes', country: 'Guatemala', years: 2, paid: '$3.90', ratio: '2.2×' },
];

export const TESTIMONIALS = [
  {
    quote:
      'I stopped buying coffee at the store the week I tasted a bag that was two days old. The Thursday box is the best part of my week, and I am only slightly embarrassed about that.',
    name: 'Priya N.',
    meta: 'Subscriber since 2022 · V60',
    featured: true,
  },
  {
    quote: 'Paused it for a month while travelling with one tap. No email chain, no guilt.',
    name: 'Marcus L.',
    meta: 'Espresso, every 2 weeks',
  },
  {
    quote: 'The roast date is always Tuesday. Every single time. That is the whole review.',
    name: 'Dana O.',
    meta: 'Kiln House, weekly',
  },
];

export const FAQ = [
  {
    q: 'Can I pause, skip or cancel?',
    a: 'Any time, from your account or by replying to any shipping email. There is no minimum term and no cancellation fee.',
  },
  {
    q: 'Whole bean or ground?',
    a: 'Whole bean by default — it stays fresh far longer. If you do not own a grinder yet, tell us your brewer at checkout and we will grind to order on roast day.',
  },
  {
    q: 'When will my coffee arrive?',
    a: 'Orders placed before Monday 6 pm are roasted on Tuesday and delivered Thursday across California, Friday elsewhere in the continental US.',
  },
  {
    q: 'What does “Roaster’s rotation” mean?',
    a: 'Each delivery is the coffee we are most excited about that week, chosen to suit your brew method. Most subscribers pick it — it is the best way to taste the whole line-up.',
  },
  {
    q: 'Are the bags recyclable?',
    a: 'They are home-compostable paper with a plant-based lining and a paper-backed valve. The label is printed with soy ink.',
  },
];
