/**
 * DIP — Dependency Inversion Principle
 * ====================================
 *
 * Depend on abstractions, not concretions.
 *
 * Demo: order checkout
 *   BAD  → OrderService hard-wires StripeGateway
 *   GOOD → OrderService depends on PaymentGateway; inject Stripe or PayPal
 */

// ---------------------------------------------------------------------------
// BAD — high-level module depends on a concrete low-level detail
// ---------------------------------------------------------------------------

export class StripeGateway {
  charge(amount: number): void {
    console.log(`[Stripe] Charged $${amount}`);
  }
}

export class BadOrderService {
  checkout(amount: number): void {
    const gateway = new StripeGateway(); // locked to Stripe
    gateway.charge(amount);
  }
}

// ---------------------------------------------------------------------------
// GOOD — both sides depend on the abstraction
// ---------------------------------------------------------------------------

export interface PaymentGateway {
  pay(amount: number): void;
}

export class StripePayment implements PaymentGateway {
  pay(amount: number): void {
    console.log(`[Stripe] Charged $${amount}`);
  }
}

export class PaypalPayment implements PaymentGateway {
  pay(amount: number): void {
    console.log(`[PayPal] Charged $${amount}`);
  }
}

/** High-level policy — knows WHAT to do, not WHICH vendor. */
export class OrderService {
  constructor(private readonly gateway: PaymentGateway) {}

  checkout(amount: number): void {
    console.log(`Placing order for $${amount}`);
    this.gateway.pay(amount);
  }
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== DIP: BAD (hard-wired Stripe) ===");
  new BadOrderService().checkout(49.99);

  console.log("\n=== DIP: GOOD (inject abstraction) ===");
  const stripeCheckout = new OrderService(new StripePayment());
  stripeCheckout.checkout(49.99);

  const paypalCheckout = new OrderService(new PaypalPayment());
  paypalCheckout.checkout(49.99);
}
