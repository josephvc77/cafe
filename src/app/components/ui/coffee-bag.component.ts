import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { BRAND } from '../../core/config/brand.config';
import { Coffee } from '../../core/data/coffees.data';
import { roastCss } from '../../core/utils/roast-color';

let uid = 0;

/**
 * Parameterised kraft bag illustration. Label colours, name, origin and roast
 * level all come from the coffee data — so a new coffee gets a new bag for free.
 */
@Component({
  selector: 'kiln-coffee-bag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bag' },
  styles: [
    `
      :host {
        display: block;
        aspect-ratio: 300 / 420;
      }
      svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .t-name {
        font-family: var(--font-display);
        font-variation-settings: 'opsz' 72, 'SOFT' 60;
        font-weight: 460;
        letter-spacing: -0.02em;
      }
      .t-mono {
        font-family: var(--font-mono);
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
    `,
  ],
  template: `
    <svg viewBox="0 0 300 420" role="img" [attr.aria-label]="coffee.name + ' coffee bag, ' + coffee.origin">
      <defs>
        <linearGradient [attr.id]="id + 'k'" x1="0" x2="1">
          <stop offset="0" stop-color="#b8956a" />
          <stop offset=".18" stop-color="#d0b087" />
          <stop offset=".55" stop-color="#c8a67b" />
          <stop offset=".86" stop-color="#b48f63" />
          <stop offset="1" stop-color="#9c7a50" />
        </linearGradient>
        <filter [attr.id]="id + 'n'" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .22 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <!-- floor shadow -->
      <ellipse cx="150" cy="412" rx="118" ry="9" fill="rgb(40 24 12 / .28)" />

      <!-- bag body -->
      <path [attr.fill]="'url(#' + id + 'k)'"
        d="M34 70 L266 70 L272 396 Q272 406 262 406 L38 406 Q28 406 28 396 Z" />
      <path [attr.filter]="'url(#' + id + 'n)'" fill="#fff"
        d="M34 70 L266 70 L272 396 Q272 406 262 406 L38 406 Q28 406 28 396 Z" />
      <!-- gusset shading -->
      <path d="M34 70 L52 70 L46 406 L38 406 Q28 406 28 396 Z" fill="rgb(60 36 16 / .14)" />
      <path d="M248 70 L266 70 L272 396 Q272 406 262 406 L254 406 Z" fill="rgb(60 36 16 / .18)" />

      <!-- folded top + tin tie -->
      <path d="M30 18 L270 18 L266 72 L34 72 Z" fill="#c09b6e" />
      <path d="M30 18 L270 18 L268 30 L32 30 Z" fill="rgb(255 255 255 / .12)" />
      <rect x="22" y="40" width="256" height="9" rx="2" fill="#8d8a86" />
      <rect x="22" y="40" width="256" height="3" rx="1.5" fill="#bdbab5" />

      <!-- label -->
      <rect x="62" y="116" width="176" height="228" rx="3" [attr.fill]="coffee.palette.label" />
      <rect x="62" y="116" width="176" height="36" [attr.fill]="coffee.palette.band" />
      <text x="150" y="139" text-anchor="middle" class="t-mono" font-size="10" [attr.fill]="coffee.palette.label">
        {{ brand }}
      </text>
      <text x="150" y="200" text-anchor="middle" class="t-name" [attr.font-size]="nameSize"
        [attr.fill]="coffee.palette.ink">{{ coffee.name }}</text>
      <text x="150" y="224" text-anchor="middle" class="t-mono" font-size="9.5" [attr.fill]="coffee.palette.ink">
        {{ coffee.origin }}
      </text>
      <line x1="84" y1="246" x2="216" y2="246" [attr.stroke]="coffee.palette.ink" stroke-opacity=".3" />
      <text x="84" y="270" class="t-mono" font-size="8.5" [attr.fill]="coffee.palette.ink" fill-opacity=".75">
        {{ coffee.process }}
      </text>
      <text x="216" y="270" text-anchor="end" class="t-mono" font-size="8.5" [attr.fill]="coffee.palette.ink"
        fill-opacity=".75">250 g</text>

      <!-- roast level dots -->
      <g [attr.transform]="'translate(84 292)'">
        <circle *ngFor="let d of dots; let i = index" [attr.cx]="i * 12" cy="0" r="4"
          [attr.fill]="i < filled ? roast : 'none'" [attr.stroke]="coffee.palette.ink" stroke-opacity=".5" />
      </g>
      <text x="216" y="295" text-anchor="end" class="t-mono" font-size="7" [attr.fill]="coffee.palette.ink"
        fill-opacity=".6">Lot {{ coffee.lot }}</text>

      <!-- roast-date stamp -->
      <g transform="translate(212 356) rotate(-10)">
        <circle r="30" fill="none" stroke="#b8431d" stroke-width="1.5" opacity=".85" />
        <circle r="25" fill="none" stroke="#b8431d" stroke-width=".75" opacity=".6" />
        <text y="-4" text-anchor="middle" class="t-mono" font-size="7" fill="#b8431d">Roasted</text>
        <text y="8" text-anchor="middle" class="t-mono" font-size="9" fill="#b8431d">Tue</text>
      </g>

      <!-- valve -->
      <circle cx="150" cy="96" r="7" fill="rgb(60 36 16 / .2)" />
      <circle cx="150" cy="96" r="3" fill="rgb(60 36 16 / .25)" />
    </svg>
  `,
  imports: [NgFor],
})
export class CoffeeBagComponent {
  @Input({ required: true }) coffee!: Coffee;

  readonly id = `bag${uid++}`;
  readonly brand = `${BRAND.name} · ${BRAND.city.split(',')[0]}`;
  readonly dots = [0, 1, 2, 3, 4];

  get filled(): number {
    return Math.max(1, Math.round(this.coffee.roastLevel * 5));
  }

  get roast(): string {
    return roastCss(this.coffee.roastLevel);
  }

  get nameSize(): number {
    return this.coffee.name.length > 9 ? 30 : 38;
  }
}
