import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { COFFEES, ROTATION_ID } from '../../core/data/coffees.data';
import {
  BREW_METHODS,
  BrewMethod,
  CADENCES,
  Cadence,
  SubscriptionStore,
} from '../../core/state/subscription.store';
import { RevealDirective } from '../motion/reveal.directive';
import { SplitWordsDirective } from '../motion/split-words.directive';
import { RoastTicketComponent } from './roast-ticket.component';

/**
 * The primary conversion point. Four plain-language questions on the left,
 * a live "roast ticket" summary on the right. Native radio groups + range input
 * so keyboard and screen-reader behaviour comes for free.
 */
@Component({
  selector: 'kiln-subscription-builder',
  standalone: true,
  imports: [NgFor, RoastTicketComponent, RevealDirective, SplitWordsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subscription-builder.component.html',
  styleUrls: ['./subscription-builder.component.scss'],
})
export class SubscriptionBuilderComponent {
  readonly store = inject(SubscriptionStore);
  readonly methods = BREW_METHODS;
  readonly cadences = CADENCES;
  readonly coffees = COFFEES;
  readonly rotationId = ROTATION_ID;

  setMethod(id: BrewMethod): void {
    this.store.method.set(id);
  }

  setCadence(id: Cadence): void {
    this.store.cadence.set(id);
  }

  setCups(e: Event): void {
    this.store.cupsPerDay.set(Number((e.target as HTMLInputElement).value));
  }

  setCoffee(id: string): void {
    this.store.coffeeId.set(id);
  }

  cupsLabel(n: number): string {
    return n === 1 ? '1 cup a day' : `${n} cups a day`;
  }
}
