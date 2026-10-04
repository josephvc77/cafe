import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';
import { BRAND } from '../../core/config/brand.config';
import { MotionService } from '../../core/services/motion.service';
import { SubscriptionStore } from '../../core/state/subscription.store';
import { ROAST_DURATION, formatClock, roastLevelAt, tempAt } from '../../core/utils/roast-curve';
import { formatCountdown, formatShort } from '../../core/utils/roast-schedule';
import { MagneticDirective } from '../motion/magnetic.directive';
import { SplitWordsDirective } from '../motion/split-words.directive';
import { RoastBeanComponent } from '../three/roast-bean.component';
import { IconComponent } from '../ui/icon.component';

/** Where the hero's intro roast stops: a medium roast, just past first crack. */
const HERO_ROAST = 0.84;

@Component({
  selector: 'kiln-hero',
  standalone: true,
  imports: [RoastBeanComponent, SplitWordsDirective, MagneticDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly brand = BRAND;
  private readonly schedule = inject(SubscriptionStore).schedule();
  readonly ticket = {
    batch: String(weekNumber(this.schedule.roast)).padStart(3, '0'),
    roast: formatShort(this.schedule.roast),
    cutoff: `${this.schedule.cutoff.toLocaleDateString('en-US', { weekday: 'short' })}, 6 pm`,
    delivery: formatShort(this.schedule.delivery),
    countdown: formatCountdown(this.schedule.hoursLeft),
  };

  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  @ViewChild(RoastBeanComponent, { static: true }) private bean!: RoastBeanComponent;
  @ViewChild('readout', { static: true }) private readout!: ElementRef<HTMLElement>;

  private readonly motion = inject(MotionService);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const root = this.root.nativeElement;

    if (this.motion.reduced()) {
      this.applyRoast(HERO_ROAST);
      return;
    }

    this.ctx = this.motion.context(root, () => {
      const roast = { p: 0 };
      this.applyRoast(0);

      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
        .from('.hero__kicker', { y: 16, autoAlpha: 0, duration: 0.9 })
        .from('.hero__title .split-word__inner', { yPercent: 115, rotate: 3, duration: 1.4, stagger: 0.07 }, 0.1)
        .from('.hero__visual', { autoAlpha: 0, scale: 0.92, duration: 2 }, 0.2)
        .to(roast, {
          p: HERO_ROAST,
          duration: 3.6,
          ease: 'power1.inOut',
          onUpdate: () => this.applyRoast(roast.p),
        }, 0.4)
        .from('.hero__lead', { y: 24, autoAlpha: 0, duration: 1.1 }, 0.7)
        .from('.hero__actions > *', { y: 20, autoAlpha: 0, stagger: 0.08, duration: 1 }, 0.85)
        .from('.hero__ticket', {
          autoAlpha: 0,
          scale: 1.35,
          rotate: -16,
          duration: 0.7,
          ease: 'back.out(2.2)',
        }, 1.7)
        .from('.hero__scroll', { autoAlpha: 0, duration: 1 }, 2.2);

      // Gentle depth on scroll — desktop only.
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.to('.hero__visual-inner', {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero__title', {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  /** Updates bean colour + the live roast readout without change detection. */
  private applyRoast(p: number): void {
    const seconds = p * ROAST_DURATION;
    this.bean.setProgress(roastLevelAt(p));
    const stage = p < 0.42 ? 'Drying' : p < 0.8 ? 'Browning' : 'First crack';
    this.readout.nativeElement.textContent =
      `${stage} · ${formatClock(seconds)} · ${Math.round(tempAt(seconds))} °C`;
  }
}

function weekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}
