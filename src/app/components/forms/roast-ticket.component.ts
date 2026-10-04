import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { BREW_METHODS, CADENCES, SubscriptionStore } from '../../core/state/subscription.store';
import { formatShort } from '../../core/utils/roast-schedule';
import { IconComponent } from '../ui/icon.component';

type Step = 'summary' | 'details' | 'sending' | 'done';

/** Live order summary styled as a roast ticket, with a two-step reserve flow. */
@Component({
  selector: 'kiln-roast-ticket',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roast-ticket.component.html',
  styleUrls: ['./roast-ticket.component.scss'],
})
export class RoastTicketComponent {
  readonly store = inject(SubscriptionStore);
  private readonly orders = inject(OrderService);
  private readonly fb = inject(FormBuilder);

  readonly step = signal<Step>('summary');
  readonly reference = signal('');
  readonly submitted = signal(false);

  readonly roastDate = formatShort(this.store.schedule().roast);
  readonly deliveryDate = formatShort(this.store.schedule().delivery);
  readonly roastDay = this.store.schedule().roast.toLocaleDateString('en-US', { weekday: 'long' });

  readonly plan = this.store.plan;
  readonly methodLabel = computed(() => BREW_METHODS.find((m) => m.id === this.store.method())!.label);
  readonly cadenceLabel = computed(() => CADENCES.find((c) => c.id === this.store.cadence())!.label);
  readonly isOnce = computed(() => this.store.cadence() === 'once');
  readonly bagsLabel = computed(() =>
    this.plan()
      .bags.map((b) => `${b.count} × ${b.grams >= 1000 ? b.grams / 1000 + ' kg' : b.grams + ' g'}`)
      .join(' + '),
  );

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    postcode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
  });

  @ViewChild('firstField') private firstField?: ElementRef<HTMLInputElement>;
  @ViewChild('doneHeading') private doneHeading?: ElementRef<HTMLElement>;

  begin(): void {
    this.step.set('details');
    setTimeout(() => this.firstField?.nativeElement.focus());
  }

  back(): void {
    this.step.set('summary');
  }

  showError(field: 'name' | 'email' | 'postcode'): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || this.submitted());
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Wait for the view to render aria-invalid before moving focus.
      setTimeout(() => document.querySelector<HTMLElement>('.signup [aria-invalid="true"]')?.focus());
      return;
    }
    this.step.set('sending');
    const { reference } = await this.orders.reserve(this.plan(), this.form.getRawValue());
    this.reference.set(reference);
    this.step.set('done');
    setTimeout(() => this.doneHeading?.nativeElement.focus());
  }
}
