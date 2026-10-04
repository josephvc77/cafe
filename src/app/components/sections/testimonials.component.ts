import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TESTIMONIALS } from '../../core/data/content.data';
import { RevealDirective } from '../motion/reveal.directive';

@Component({
  selector: 'kiln-testimonials',
  standalone: true,
  imports: [NgFor, NgIf, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="voices section" aria-labelledby="voices-title">
      <div class="container voices__grid">
        <header class="voices__head">
          <p class="kicker">No. 05 — Subscribers</p>
          <h2 id="voices-title" class="visually-hidden">What subscribers say</h2>
          <p class="voices__score" kilnReveal>
            <span class="voices__num">4.9</span>
            <span class="voices__meta mono">Average from 2,140 reviews<br />3,800+ active subscribers</span>
          </p>
        </header>

        <figure *ngFor="let t of featured" class="quote quote--featured" kilnReveal>
          <blockquote><p>“{{ t.quote }}”</p></blockquote>
          <figcaption><strong>{{ t.name }}</strong><span class="mono">{{ t.meta }}</span></figcaption>
        </figure>

        <div class="voices__small" kilnReveal="stagger">
          <figure *ngFor="let t of rest" class="quote">
            <blockquote><p>“{{ t.quote }}”</p></blockquote>
            <figcaption><strong>{{ t.name }}</strong><span class="mono">{{ t.meta }}</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      @use 'mq' as *;

      .voices__grid {
        display: grid;
        gap: var(--space-7);

        @include up(lg) {
          grid-template-columns: 4fr 8fr;
          column-gap: var(--space-8);
          row-gap: var(--space-8);
        }
      }

      .voices__head {
        display: grid;
        gap: var(--space-5);
        align-content: start;

        @include up(lg) {
          grid-row: span 2;
        }
      }

      .voices__score {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }

      .voices__num {
        font-family: var(--font-display);
        font-size: clamp(4rem, 3rem + 4vw, 7rem);
        font-weight: 330;
        font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
        letter-spacing: -0.05em;
        line-height: 0.85;
        color: var(--accent);
      }

      .voices__meta {
        color: var(--fg-muted);
        line-height: 1.7;
      }

      .quote {
        display: grid;
        gap: var(--space-4);

        blockquote {
          margin: 0;
        }

        p {
          font-family: var(--font-display);
          font-size: var(--fs-h3);
          font-variation-settings: 'opsz' 48, 'SOFT' 80;
          letter-spacing: -0.015em;
          line-height: 1.2;
          text-wrap: pretty;
        }

        figcaption {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: var(--space-2) var(--space-3);
          font-size: var(--fs-small);

          .mono {
            color: var(--fg-muted);
          }
        }
      }

      .quote--featured p {
        font-size: clamp(1.75rem, 1.2rem + 2.2vw, 3.25rem);
        font-style: italic;
        font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
        font-weight: 340;
        line-height: 1.1;
        letter-spacing: -0.025em;
        text-indent: -0.4em;
      }

      .voices__small {
        display: grid;
        gap: var(--space-7);
        padding-top: var(--space-7);
        border-top: var(--rule);

        @include up(md) {
          grid-template-columns: 1fr 1fr;
          gap: var(--space-7);
        }

        .quote p {
          font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem);
        }
      }
    `,
  ],
})
export class TestimonialsComponent {
  readonly featured = TESTIMONIALS.filter((t) => t.featured);
  readonly rest = TESTIMONIALS.filter((t) => !t.featured);
}
