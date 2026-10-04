import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe, NgFor } from '@angular/common';
import { COFFEES, ROTATION_ID } from '../../core/data/coffees.data';
import { MotionService } from '../../core/services/motion.service';
import { SubscriptionStore } from '../../core/state/subscription.store';
import { formatShort } from '../../core/utils/roast-schedule';
import { RevealDirective } from '../motion/reveal.directive';
import { SplitWordsDirective } from '../motion/split-words.directive';
import { CoffeeBagComponent } from '../ui/coffee-bag.component';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'kiln-coffee-lineup',
  standalone: true,
  imports: [NgFor, CurrencyPipe, CoffeeBagComponent, IconComponent, RevealDirective, SplitWordsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coffee-lineup.component.html',
  styleUrls: ['./coffee-lineup.component.scss'],
})
export class CoffeeLineupComponent {
  readonly coffees = COFFEES;
  readonly active = signal(COFFEES[1].id);
  readonly rotationId = ROTATION_ID;

  private readonly store = inject(SubscriptionStore);
  private readonly motion = inject(MotionService);
  readonly roastDate = formatShort(this.store.schedule().roast);

  choose(id: string): void {
    this.store.selectCoffee(id);
    const target = document.getElementById('subscribe');
    target?.scrollIntoView({ behavior: this.motion.reduced() ? 'auto' : 'smooth', block: 'start' });
    document.getElementById('builder-title')?.focus({ preventScroll: true });
  }

  roastWidth(level: number): string {
    return `${Math.round(level * 100)}%`;
  }
}
