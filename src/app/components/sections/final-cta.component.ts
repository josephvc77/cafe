import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BRAND } from '../../core/config/brand.config';
import { SubscriptionStore } from '../../core/state/subscription.store';
import { formatCountdown } from '../../core/utils/roast-schedule';
import { MagneticDirective } from '../motion/magnetic.directive';
import { RevealDirective } from '../motion/reveal.directive';
import { SplitWordsDirective } from '../motion/split-words.directive';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'kiln-final-cta',
  standalone: true,
  imports: [IconComponent, MagneticDirective, RevealDirective, SplitWordsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="final" aria-labelledby="final-title">
      <div class="container final__inner">
        <p class="kicker final__kicker">Order cutoff · Monday 6 pm</p>
        <h2 class="display final__title" id="final-title" kilnSplitWords kilnReveal="words">
          Tuesday’s roast closes in <em>{{ countdown }}</em>.
        </h2>
        <div class="final__actions" kilnReveal revealDelay="0.3">
          <a class="btn btn--ink" [href]="brand.primaryCta.href" kilnMagnetic>
            {{ brand.primaryCta.label }}
            <span class="btn__arrow"><kiln-icon name="arrow-right" /></span>
          </a>
          <p class="final__assure">Pause, skip or cancel any time.</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      @use 'mq' as *;

      .final {
        padding-block: var(--space-section);
        background: var(--accent);
        color: var(--accent-fg);
        --fg: var(--accent-fg);
        --bg: var(--palette-ink);
        --fg-muted: color-mix(in srgb, var(--accent-fg) 78%, transparent);
        --focus: var(--accent-fg);

        @media (prefers-color-scheme: dark) {
          --bg: #fff7ec;
        }
      }

      .final__inner {
        display: grid;
        gap: var(--space-6);
      }

      .final__title {
        max-width: 16ch;
        font-size: clamp(2.75rem, 1.4rem + 6vw, 8rem);

        em {
          white-space: nowrap;
        }
      }

      .final__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-4) var(--space-6);
      }

      .final .btn--ink {
        --btn-bg: var(--palette-ink);
        --btn-fg: #fff7ec;
        --btn-fill: #000;

        @media (prefers-color-scheme: dark) {
          --btn-bg: #fff7ec;
          --btn-fg: #1a0f0a;
          --btn-fill: #fff;
        }
      }

      .final__assure {
        color: var(--fg-muted);
      }
    `,
  ],
})
export class FinalCtaComponent {
  readonly brand = BRAND;
  readonly countdown = formatCountdown(inject(SubscriptionStore).schedule().hoursLeft);
}
