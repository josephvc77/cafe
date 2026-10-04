import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { LEDGER } from '../../core/data/content.data';
import { RevealDirective } from '../motion/reveal.directive';
import { SplitWordsDirective } from '../motion/split-words.directive';

/** Contour lines for the background — generated once, static SVG. */
function contours(count: number, w: number, h: number): string[] {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const r = 40 + i * 34;
    let d = '';
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const wobble = 1 + 0.12 * Math.sin(t * 3 + i * 0.6) + 0.06 * Math.sin(t * 5 - i * 0.4);
      const x = w * 0.18 + Math.cos(t) * r * 1.35 * wobble;
      const y = h * 0.62 + Math.sin(t) * r * wobble;
      d += `${a ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(d + 'Z');
  }
  return paths;
}

@Component({
  selector: 'kiln-sourcing-ledger',
  standalone: true,
  imports: [NgFor, RevealDirective, SplitWordsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sourcing-ledger.component.html',
  styleUrls: ['./sourcing-ledger.component.scss'],
})
export class SourcingLedgerComponent {
  readonly rows = LEDGER;
  readonly lines = contours(14, 1200, 800);
}
