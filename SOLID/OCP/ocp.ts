/**
 * OCP — Open/Closed Principle
 * ===========================
 *
 * Open for extension, closed for modification.
 *
 * Demo: applying discounts at checkout
 *   BAD  → edit if/else for every new discount type
 *   GOOD → new Discount class, Checkout untouched
 */

// ---------------------------------------------------------------------------
// BAD — must modify this class for every new discount
// ---------------------------------------------------------------------------

export class BadDiscountCalculator {
  apply(amount: number, type: string, value: number): number {
    if (type === "percent") {
      return amount - (amount * value) / 100;
    } else if (type === "flat") {
      return Math.max(0, amount - value);
    }
    // adding "bogo" means editing THIS method again
    return amount;
  }
}

// ---------------------------------------------------------------------------
// GOOD — extend by adding classes
// ---------------------------------------------------------------------------

export interface Discount {
  apply(amount: number): number;
}

export class PercentDiscount implements Discount {
  constructor(private readonly percent: number) {}

  apply(amount: number): number {
    return amount - (amount * this.percent) / 100;
  }
}

export class FlatDiscount implements Discount {
  constructor(private readonly off: number) {}

  apply(amount: number): number {
    return Math.max(0, amount - this.off);
  }
}

/** New behaviour = new class. Checkout does not change. */
export class BogoDiscount implements Discount {
  apply(amount: number): number {
    return amount / 2; // simplified: half off
  }
}

export class Checkout {
  total(amount: number, discount: Discount): number {
    return discount.apply(amount);
  }
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

if (require.main === module) {
  const amount = 100;

  console.log("=== OCP: BAD ===");
  const bad = new BadDiscountCalculator();
  console.log("percent 10%:", bad.apply(amount, "percent", 10));
  console.log("flat $15:", bad.apply(amount, "flat", 15));

  console.log("\n=== OCP: GOOD ===");
  const checkout = new Checkout();
  console.log("percent 10%:", checkout.total(amount, new PercentDiscount(10)));
  console.log("flat $15:", checkout.total(amount, new FlatDiscount(15)));
  console.log("bogo:", checkout.total(amount, new BogoDiscount()));
}
