import { Injectable } from '@angular/core';
import { Plan } from '../state/subscription.store';

export interface Contact {
  name: string;
  email: string;
  postcode: string;
}

/**
 * Integration seam for the client's commerce backend (Shopify, Stripe, Recharge…).
 * The demo resolves after a short delay; replace `reserve` with a real call that
 * returns a hosted-checkout URL or confirmation.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  reserve(plan: Plan, contact: Contact): Promise<{ reference: string }> {
    void plan;
    void contact;
    return new Promise((resolve) =>
      setTimeout(() => resolve({ reference: `K-${Math.random().toString(36).slice(2, 7).toUpperCase()}` }), 900),
    );
  }
}
