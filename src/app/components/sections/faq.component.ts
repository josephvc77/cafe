import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FAQ } from '../../core/data/content.data';
import { RevealDirective } from '../motion/reveal.directive';
import { IconComponent } from '../ui/icon.component';

/** Native <details> — keyboard, screen-reader and find-in-page support for free. */
@Component({
  selector: 'kiln-faq',
  standalone: true,
  imports: [NgFor, IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="faq section" aria-labelledby="faq-title">
      <div class="container faq__grid">
        <header class="faq__head">
          <p class="kicker">No. 07 — Questions</p>
          <h2 id="faq-title" class="display faq__title">The small print, <em>made large</em>.</h2>
        </header>
        <div class="faq__list" kilnReveal="stagger">
          <details *ngFor="let item of items; let first = first" class="qa" [open]="first">
            <summary>
              <span>{{ item.q }}</span>
              <span class="qa__icon"><kiln-icon name="plus" [size]="20" /></span>
            </summary>
            <p>{{ item.a }}</p>
          </details>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      @use 'mq' as *;

      .faq__grid {
        display: grid;
        gap: var(--space-7);

        @include up(lg) {
          grid-template-columns: 5fr 7fr;
          gap: var(--space-8);
        }
      }

      .faq__head {
        display: grid;
        gap: var(--space-5);
        align-content: start;
      }

      .faq__title {
        font-size: clamp(2.25rem, 1.5rem + 3vw, 4rem);

        em {
          color: var(--accent);
        }
      }

      .faq__list {
        border-top: var(--rule);
      }

      .qa {
        border-bottom: var(--hairline);

        summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          padding-block: var(--space-5);
          font-family: var(--font-display);
          font-size: clamp(1.2rem, 1.05rem + 0.6vw, 1.5rem);
          font-variation-settings: 'opsz' 36, 'SOFT' 50;
          letter-spacing: -0.01em;
          line-height: 1.25;
          cursor: pointer;
          list-style: none;

          &::-webkit-details-marker {
            display: none;
          }

          @media (hover: hover) {
            &:hover {
              color: var(--accent);
            }
          }
        }

        p {
          max-width: 40rem;
          padding-bottom: var(--space-5);
          color: var(--fg-muted);
        }
      }

      .qa__icon {
        display: grid;
        place-items: center;
        flex: none;
        width: 2.25rem;
        height: 2.25rem;
        border: 1px solid var(--line);
        border-radius: 50%;
        transition: transform var(--dur-base) var(--ease-out), background-color var(--dur-base);

        .qa[open] & {
          transform: rotate(45deg);
          background: var(--fg);
          color: var(--bg);
        }
      }
    `,
  ],
})
export class FaqComponent {
  readonly items = FAQ;
}
