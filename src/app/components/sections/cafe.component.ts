import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { BRAND } from '../../core/config/brand.config';
import { RevealDirective } from '../motion/reveal.directive';
import { SplitWordsDirective } from '../motion/split-words.directive';
import { IconComponent } from '../ui/icon.component';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hour = (h: number) => `${h % 12 || 12} ${h < 12 ? 'am' : 'pm'}`;

@Component({
  selector: 'kiln-cafe',
  standalone: true,
  imports: [NgFor, NgIf, IconComponent, RevealDirective, SplitWordsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cafe.component.html',
  styleUrls: ['./cafe.component.scss'],
})
export class CafeComponent {
  readonly brand = BRAND;
  readonly mapsUrl = `https://www.google.com/maps/search/?api=1&query=${BRAND.address.mapsQuery}`;
  readonly today = new Date().getDay();
  readonly telHref = `tel:${BRAND.phone.replace(/[^+\d]/g, '')}`;

  // Monday-first listing, as on the door sign.
  readonly hours = [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const h = BRAND.hours[d];
    return { day: DAYS[d], d, text: h ? `${hour(h[0])} – ${hour(h[1])}` : 'Closed — roasting prep' };
  });

  readonly status = (() => {
    const now = new Date();
    const h = BRAND.hours[now.getDay()];
    const time = now.getHours() + now.getMinutes() / 60;
    if (h && time >= h[0] && time < h[1]) return { open: true, text: `Open now · until ${hour(h[1])}` };
    for (let i = 0; i < 7; i++) {
      const d = (now.getDay() + i) % 7;
      const next = BRAND.hours[d];
      if (next && (i > 0 || time < next[0])) {
        return { open: false, text: `Closed · opens ${i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d]} ${hour(next[0])}` };
      }
    }
    return { open: false, text: 'Closed' };
  })();

  readonly ringText = `${BRAND.legalName} · Roastery & bar · ${BRAND.city.split(',')[0]} · `;
}
