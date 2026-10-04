import { Injectable, computed, signal } from '@angular/core';
import { COFFEES, Coffee, ROTATION_ID } from '../data/coffees.data';
import { getRoastSchedule } from '../utils/roast-schedule';

export type BrewMethod = 'espresso' | 'filter' | 'press';
export type Cadence = 'weekly' | 'fortnightly' | 'monthly' | 'once';

export const BREW_METHODS: { id: BrewMethod; label: string; dose: number; hint: string }[] = [
  { id: 'espresso', label: 'Espresso', dose: 18, hint: '18 g a shot' },
  { id: 'filter', label: 'Filter & pour-over', dose: 15, hint: '15 g a cup' },
  { id: 'press', label: 'French press & AeroPress', dose: 17, hint: '17 g a cup' },
];

export const CADENCES: { id: Cadence; label: string; days: number }[] = [
  { id: 'weekly', label: 'Weekly', days: 7 },
  { id: 'fortnightly', label: 'Every 2 weeks', days: 14 },
  { id: 'monthly', label: 'Monthly', days: 28 },
  { id: 'once', label: 'Just once', days: 14 },
];

/** Price multipliers vs. the 250 g price. */
const BAG_SIZES = [
  { grams: 1000, factor: 3.3 },
  { grams: 500, factor: 1.8 },
  { grams: 250, factor: 1 },
];
const ROTATION_PRICE = 20;
const SUBSCRIBER_DISCOUNT = 0.12;
const FREE_SHIPPING_FROM = 30;
const SHIPPING = 6;
/** Whole beans taste best within ~30 days of roast. */
const PEAK_DAYS = 30;

export interface Plan {
  coffee: Coffee | null;
  bags: { grams: number; count: number }[];
  totalGrams: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  perCup: number;
  cupsPerDelivery: number;
  daysPerBag: number;
  staysFresh: boolean;
}

/**
 * Shared state for the subscription builder. Other sections (e.g. the coffee
 * line-up) can pre-select a coffee; the builder and ticket render from signals.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionStore {
  readonly method = signal<BrewMethod>('filter');
  readonly cupsPerDay = signal(2);
  readonly coffeeId = signal<string>(ROTATION_ID);
  readonly cadence = signal<Cadence>('fortnightly');
  readonly schedule = signal(getRoastSchedule());

  readonly plan = computed<Plan>(() => {
    const method = BREW_METHODS.find((m) => m.id === this.method())!;
    const cadence = CADENCES.find((c) => c.id === this.cadence())!;
    const coffee = COFFEES.find((c) => c.id === this.coffeeId()) ?? null;
    const base = coffee?.price ?? ROTATION_PRICE;

    const cupsPerDelivery = this.cupsPerDay() * cadence.days;
    const needed = cupsPerDelivery * method.dose;
    let remaining = Math.max(250, Math.ceil(needed / 250) * 250);

    const bags = BAG_SIZES.map(({ grams }) => {
      const count = Math.floor(remaining / grams);
      remaining -= count * grams;
      return { grams, count };
    }).filter((b) => b.count > 0);

    const totalGrams = bags.reduce((s, b) => s + b.grams * b.count, 0);
    const subtotal = bags.reduce(
      (s, b) => s + b.count * base * BAG_SIZES.find((x) => x.grams === b.grams)!.factor,
      0,
    );
    const discount = cadence.id === 'once' ? 0 : subtotal * SUBSCRIBER_DISCOUNT;
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
    const total = afterDiscount + shipping;
    const smallestBag = Math.min(...bags.map((b) => b.grams));
    const daysPerBag = Math.round(smallestBag / (this.cupsPerDay() * method.dose));

    return {
      coffee,
      bags,
      totalGrams,
      subtotal,
      discount,
      shipping,
      total,
      perCup: total / Math.max(1, Math.floor(totalGrams / method.dose)),
      cupsPerDelivery,
      daysPerBag,
      staysFresh: daysPerBag <= PEAK_DAYS,
    };
  });

  selectCoffee(id: string): void {
    this.coffeeId.set(id);
    const coffee = COFFEES.find((c) => c.id === id);
    if (coffee?.bestFor.toLowerCase().startsWith('espresso')) this.method.set('espresso');
  }
}
