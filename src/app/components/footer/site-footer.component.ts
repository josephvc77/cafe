import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { BRAND } from '../../core/config/brand.config';

@Component({
  selector: 'kiln-site-footer',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer night">
      <div class="container">
        <div class="footer__top">
          <nav aria-label="Footer" class="footer__cols">
            <div>
              <p class="mono footer__label">Explore</p>
              <ul role="list">
                <li *ngFor="let n of brand.nav"><a [href]="n.href">{{ n.label }}</a></li>
                <li><a href="#subscribe">Subscriptions</a></li>
              </ul>
            </div>
            <div>
              <p class="mono footer__label">Work with us</p>
              <ul role="list">
                <li><a [href]="'mailto:' + brand.email + '?subject=Wholesale'">Wholesale</a></li>
                <li><a [href]="'mailto:' + brand.email + '?subject=Gift%20subscription'">Gift subscriptions</a></li>
                <li><a [href]="'mailto:' + brand.email + '?subject=Careers'">Careers</a></li>
              </ul>
            </div>
            <div>
              <p class="mono footer__label">Say hello</p>
              <ul role="list">
                <li><a [href]="'mailto:' + brand.email">{{ brand.email }}</a></li>
                <li *ngFor="let s of brand.social"><a [href]="s.href" rel="noopener">{{ s.label }}</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <p class="footer__word" aria-hidden="true">{{ brand.name }}</p>

        <div class="footer__base mono">
          <span>© {{ year }} {{ brand.legalName }}</span>
          <span>Roasted in {{ brand.city }}</span>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      @use 'mq' as *;

      :host {
        display: block;
      }

      .footer {
        padding-top: var(--space-9);
        padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
        overflow: hidden;

        @include down(md) {
          padding-bottom: calc(var(--space-9) + 3rem);
        }
      }

      .footer__cols {
        display: grid;
        gap: var(--space-6);

        @include up(md) {
          grid-template-columns: repeat(3, 1fr);
        }

        ul {
          display: grid;
          gap: var(--space-2);
        }

        a {
          text-decoration: none;
          color: var(--fg);

          @media (hover: hover) {
            &:hover {
              color: var(--accent);
            }
          }
        }
      }

      .footer__label {
        margin-bottom: var(--space-3);
        color: var(--fg-muted);
      }

      .footer__word {
        margin-block: var(--space-8) var(--space-5);
        font-family: var(--font-display);
        font-size: clamp(8rem, 38vw, 34rem);
        font-weight: 500;
        font-variation-settings: 'opsz' 144, 'SOFT' 100, 'WONK' 1;
        letter-spacing: -0.06em;
        line-height: 0.72;
        color: var(--accent);
        margin-left: -0.04em;
      }

      .footer__base {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--space-3);
        padding-top: var(--space-5);
        border-top: var(--hairline);
        color: var(--fg-muted);
      }
    `,
  ],
})
export class SiteFooterComponent {
  readonly brand = BRAND;
  readonly year = new Date().getFullYear();
}
