import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { BRAND } from '../../core/config/brand.config';
import { MotionService } from '../../core/services/motion.service';
import { SubscriptionStore } from '../../core/state/subscription.store';
import { formatShort } from '../../core/utils/roast-schedule';
import { IconComponent } from '../ui/icon.component';

/**
 * Mobile-only persistent conversion bar. Appears once the hero CTA has scrolled
 * away; hides while the builder or footer is on screen (the CTA is already there).
 */
@Component({
  selector: 'kiln-mobile-cta-bar',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="bar__text">
        <span class="mono">Next roast {{ roastDate }}</span>
        <strong>Subscribers save 12%</strong>
      </p>
      <a class="btn" [href]="cta.href">
        Subscribe <span class="btn__arrow"><kiln-icon name="arrow-right" /></span>
      </a>
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: auto 0 0;
        z-index: var(--z-sticky);
        padding: var(--space-3) var(--gutter) calc(var(--space-3) + env(safe-area-inset-bottom));
        background: var(--frost-bg);
        border-top: 1px solid var(--frost-border);
        -webkit-backdrop-filter: blur(10px) saturate(1.3);
        backdrop-filter: blur(10px) saturate(1.3);
        transform: translateY(110%);
        transition: transform 500ms var(--ease-out);
        visibility: hidden;
      }

      :host(.is-visible) {
        transform: none;
        visibility: visible;
      }

      @media (min-width: 768px) {
        :host {
          display: none;
        }
      }

      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
      }

      .bar__text {
        display: grid;
        line-height: 1.25;
        font-size: 0.875rem;
        white-space: nowrap;

        .mono {
          color: var(--fg-muted);
          font-size: 0.625rem;
        }
      }

      .btn {
        min-height: 2.9rem;
        padding-left: var(--space-5);
      }
    `,
  ],
})
export class MobileCtaBarComponent implements AfterViewInit, OnDestroy {
  readonly cta = BRAND.primaryCta;
  readonly roastDate = formatShort(inject(SubscriptionStore).schedule().roast);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private io?: IntersectionObserver;

  ngAfterViewInit(): void {
    const targets = ['top', 'subscribe', 'site-footer']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const onScreen = new Set<string>();

    this.motion.outside(() => {
      this.io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          e.isIntersecting ? onScreen.add(e.target.id) : onScreen.delete(e.target.id);
        }
        this.host.nativeElement.classList.toggle('is-visible', onScreen.size === 0);
      });
      targets.forEach((t) => this.io!.observe(t));
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
