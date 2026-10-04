export type RoastStyle = 'bright' | 'balanced' | 'deep';

export interface Coffee {
  id: string;
  name: string;
  origin: string;
  region: string;
  producer: string;
  process: string;
  altitude: string;
  notes: string[];
  roast: RoastStyle;
  /** 0 → green, 1 → darkest roast. Drives bag dot + bean colour. */
  roastLevel: number;
  /** Price for 250 g, USD. */
  price: number;
  lot: string;
  bestFor: string;
  palette: { label: string; ink: string; band: string };
}

/** Placeholder line-up. Producers and lots are fictional. */
export const COFFEES: Coffee[] = [
  {
    id: 'guji-hambela',
    name: 'Hambela',
    origin: 'Ethiopia',
    region: 'Guji',
    producer: 'Dima washing station',
    process: 'Natural',
    altitude: '2,150 m',
    notes: ['Blueberry', 'Jasmine', 'Bergamot'],
    roast: 'bright',
    roastLevel: 0.48,
    price: 22,
    lot: 'ET-24-117',
    bestFor: 'Filter',
    palette: { label: '#E9D3E4', ink: '#3A1D36', band: '#7B3F6E' },
  },
  {
    id: 'huila-mirador',
    name: 'El Mirador',
    origin: 'Colombia',
    region: 'Huila',
    producer: 'Aurelia Ruiz',
    process: 'Washed',
    altitude: '1,780 m',
    notes: ['Red apple', 'Panela', 'Cocoa nib'],
    roast: 'balanced',
    roastLevel: 0.62,
    price: 19,
    lot: 'CO-24-052',
    bestFor: 'Filter or espresso',
    palette: { label: '#F3D9A8', ink: '#3B2412', band: '#C2461F' },
  },
  {
    id: 'nyeri-gatura',
    name: 'Gatura',
    origin: 'Kenya',
    region: 'Nyeri',
    producer: 'Gatura growers’ cooperative',
    process: 'Washed',
    altitude: '1,850 m',
    notes: ['Blackcurrant', 'Grapefruit', 'Brown sugar'],
    roast: 'bright',
    roastLevel: 0.5,
    price: 24,
    lot: 'KE-24-031',
    bestFor: 'Filter',
    palette: { label: '#CFE0D2', ink: '#12301F', band: '#2F6B48' },
  },
  {
    id: 'house-kiln',
    name: 'Kiln House',
    origin: 'Brazil + Colombia',
    region: 'Cerrado · Huila',
    producer: 'Two partner farms',
    process: 'Natural + washed',
    altitude: '1,100–1,700 m',
    notes: ['Milk chocolate', 'Hazelnut', 'Toffee'],
    roast: 'deep',
    roastLevel: 0.82,
    price: 17,
    lot: 'HB-24-W39',
    bestFor: 'Espresso & milk',
    palette: { label: '#2A1D17', ink: '#F1E4CF', band: '#D98A3A' },
  },
];

export const ROTATION_ID = 'rotation';
