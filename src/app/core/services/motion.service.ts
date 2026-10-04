import { Injectable, NgZone, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Central motion policy: registers GSAP plugins once, exposes the reduced-motion
 * preference as a signal and runs animation work outside Angular's zone so
 * scroll/tween ticks never trigger change detection.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly zone = inject(NgZone);
  private readonly query =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  readonly reduced = signal(this.query?.matches ?? true);
  readonly finePointer =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'expo.out', duration: 1.1 });
    this.query?.addEventListener('change', (e) => {
      this.reduced.set(e.matches);
      // Simplest correct behaviour: rebuild the page's motion from scratch.
      window.location.reload();
    });
  }

  /** Run animation setup outside Angular; returns the created gsap context. */
  context(scope: Element, fn: (ctx: gsap.Context) => void): gsap.Context {
    return this.zone.runOutsideAngular(() => gsap.context(fn, scope));
  }

  outside<T>(fn: () => T): T {
    return this.zone.runOutsideAngular(fn);
  }

  /** Re-enter Angular (for rare state changes triggered by scroll). */
  inside<T>(fn: () => T): T {
    return this.zone.run(fn);
  }

  refresh(): void {
    this.zone.runOutsideAngular(() => ScrollTrigger.refresh());
  }
}
