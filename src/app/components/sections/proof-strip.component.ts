import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { PROOF_POINTS } from '../../core/data/content.data';
import { RevealDirective } from '../motion/reveal.directive';

@Component({
  selector: 'kiln-proof-strip',
  standalone: true,
  imports: [NgFor, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="proof container" aria-label="Why Kiln">
      <ul role="list" class="proof__list" kilnReveal="stagger">
        <li *ngFor="let p of points" class="proof__item">
          <span class="proof__value">{{ p.value }}</span>
          <span class="proof__label">{{ p.label }}</span>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      @use 'mq' as *;

      .proof__list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        border-block: var(--rule);

        @include up(lg) {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      .proof__item {
        display: grid;
        align-content: start;
        gap: var(--space-2);
        padding: var(--space-5) var(--space-4) var(--space-6);

        &:nth-child(odd) {
          padding-left: 0;
        }

        &:nth-child(even) {
          border-left: var(--hairline);
        }

        &:nth-child(n + 3) {
          border-top: var(--hairline);
        }

        @include up(lg) {
          padding: var(--space-6) var(--space-5) var(--space-7);

          &:nth-child(n) {
            border-top: 0;
          }

          &:not(:first-child) {
            border-left: var(--hairline);
          }

          &:first-child {
            padding-left: 0;
          }
        }
      }

      .proof__value {
        font-family: var(--font-display);
        font-size: clamp(2.5rem, 1.8rem + 2.6vw, 4.5rem);
        font-weight: 360;
        font-variation-settings: 'opsz' 144, 'SOFT' 40;
        letter-spacing: -0.04em;
        line-height: 1;
        font-variant-numeric: lining-nums;
      }

      .proof__label {
        max-width: 16ch;
        color: var(--fg-muted);
        font-size: var(--fs-small);
        line-height: 1.35;
      }
    `,
  ],
})
export class ProofStripComponent {
  readonly points = PROOF_POINTS;
}
