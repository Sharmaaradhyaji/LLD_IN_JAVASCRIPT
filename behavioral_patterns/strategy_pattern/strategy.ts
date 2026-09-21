/**
 * STRATEGY — Payment Checkout
 * ============================
 *
 * Definition:
 *   Family of interchangeable algorithms (Card / UPI / Wallet)
 *   behind one interface. Context (Checkout) delegates to the strategy.
 *
 * Problem it solves:
 *   Giant if/else for payment type — duplicated across pay/refund/validate (DRY break).
 *
 * DRY win:
 *   Each payment method’s rules live in ONE class. Checkout is written once.
 */

// ---------------------------------------------------------------------------
// BAD — same branching grows (and gets copied) everywhere
// ---------------------------------------------------------------------------

export function badCheckout(amount: number, method: string, detail: string): void {
  console.log(`Checkout ₹${amount}`);

  if (method === "card") {
    console.log(`[Card] Charging ****${detail.slice(-4)}`);
  } else if (method === "upi") {
    console.log(`[UPI] Collecting from ${detail}`);
  } else if (method === "wallet") {
    console.log(`[Wallet] Debiting wallet ${detail}`);
  } else {
    throw new Error(`Unknown method: ${method}`);
  }

  // Imagine refund() and validate() copy this whole if/else again → not DRY
  console.log("Receipt sent.\n");
}

// ---------------------------------------------------------------------------
// GOOD — Strategy
// ---------------------------------------------------------------------------

/** Strategy interface — every payment algorithm looks the same to Checkout. */
export interface PaymentStrategy {
  pay(amount: number): void;
}

export class CardPayment implements PaymentStrategy {
  constructor(private readonly cardNumber: string) {}

  pay(amount: number): void {
    const last4 = this.cardNumber.slice(-4);
    console.log(`[Card] Charging ****${last4} for ₹${amount}`);
  }
}

export class UpiPayment implements PaymentStrategy {
  constructor(private readonly vpa: string) {}

  pay(amount: number): void {
    console.log(`[UPI] Collecting ₹${amount} from ${this.vpa}`);
  }
}

export class WalletPayment implements PaymentStrategy {
  constructor(private readonly walletId: string) {}

  pay(amount: number): void {
    console.log(`[Wallet] Debiting ${this.walletId} for ₹${amount}`);
  }
}

/**
 * Context — owns the flow, not the algorithm.
 * Written ONCE; works with any PaymentStrategy (DRY + OCP).
 */
export class Checkout {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  process(amount: number): void {
    console.log(`Checkout ₹${amount}`);
    this.strategy.pay(amount); // delegate — no if/else
    console.log("Receipt sent.\n");
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:strategy
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Strategy: BAD (if/else, not DRY-friendly) ===\n");
  badCheckout(499, "card", "4111111111111111");
  badCheckout(199, "upi", "learner@okaxi");

  console.log("=== Strategy: GOOD (interchangeable algorithms) ===\n");

  const checkout = new Checkout(new CardPayment("4111111111111111"));
  checkout.process(499);

  // Swap strategy at runtime — Checkout code unchanged
  checkout.setStrategy(new UpiPayment("learner@okaxi"));
  checkout.process(199);

  checkout.setStrategy(new WalletPayment("WALLET-42"));
  checkout.process(99);

  console.log("DRY check: payment rules live in Card/UPI/Wallet classes once.");
  console.log("Checkout.process() was not duplicated for each method.");
}
