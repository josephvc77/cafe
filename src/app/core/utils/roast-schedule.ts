import { BRAND } from '../config/brand.config';

export interface RoastSchedule {
  cutoff: Date;
  roast: Date;
  delivery: Date;
  /** Whole hours until the order cutoff. */
  hoursLeft: number;
}

const DAY = 86_400_000;

function nextWeekday(from: Date, weekday: number): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7));
  return d;
}

/** Computes the next roast the visitor can still make, from `now`. */
export function getRoastSchedule(now = new Date()): RoastSchedule {
  const { cutoffWeekday, cutoffHour, deliveryDays } = BRAND.schedule;
  const cutoff = nextWeekday(now, cutoffWeekday);
  cutoff.setHours(cutoffHour);
  if (cutoff.getTime() <= now.getTime()) cutoff.setTime(cutoff.getTime() + 7 * DAY);

  const roast = new Date(cutoff);
  roast.setHours(0);
  roast.setDate(roast.getDate() + ((BRAND.schedule.roastWeekday - cutoff.getDay() + 7) % 7 || 7));

  const delivery = new Date(roast);
  delivery.setDate(delivery.getDate() + deliveryDays);

  return {
    cutoff,
    roast,
    delivery,
    hoursLeft: Math.max(0, Math.floor((cutoff.getTime() - now.getTime()) / 3_600_000)),
  };
}

const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

export const formatShort = (d: Date) => fmt.format(d);
export const formatLong = (d: Date) => fmtLong.format(d);

export function formatCountdown(hours: number): string {
  const days = Math.floor(hours / 24);
  const h = hours % 24;
  if (days === 0) return `${h} hour${h === 1 ? '' : 's'}`;
  return `${days} day${days === 1 ? '' : 's'}, ${h} hour${h === 1 ? '' : 's'}`;
}
