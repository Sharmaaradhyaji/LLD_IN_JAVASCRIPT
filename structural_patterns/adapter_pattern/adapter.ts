/**
 * ADAPTER — Payment Gateway Integration
 * ======================================
 *
 * Definition:
 *   Convert the interface of a class into another interface clients expect.
 *   The adapter sits between your code and a class you cannot (or should not) change.
 *
 * Real-life use case:
 *   Your checkout speaks ONE language: PaymentProcessor.pay(amountInRupees, orderId).
 *   Third-party SDKs (Stripe-like, Razorpay-like) each speak their OWN language —
 *   different method names, units (paise vs rupees), and response shapes.
 *   You cannot edit vendor SDK code, so you write an adapter per vendor.
 *
 * Flow:
 *   Checkout → PaymentProcessor (Target) → StripeAdapter → StripeSdk (Adaptee)
 */

// ---------------------------------------------------------------------------
// 1. Target — the interface YOUR app expects
// ---------------------------------------------------------------------------

export interface PaymentResult {
  success: boolean;
  transactionId: string;
}

export interface PaymentProcessor {
  pay(amountInRupees: number, orderId: string): PaymentResult;
}

// ---------------------------------------------------------------------------
// 2. Adaptees — vendor SDKs you cannot modify (simulated)
// ---------------------------------------------------------------------------

/** Stripe-style SDK: amount in smallest unit (paise), object in, object out. */
export class StripeSdk {
  createCharge(request: { amount: number; currency: string; metadata: { ref: string } }): {
    id: string;
    status: "succeeded" | "failed";
  } {
    console.log(
      `  [StripeSdk] createCharge amount=${request.amount} ${request.currency} ref=${request.metadata.ref}`,
    );
    return { id: `ch_${request.metadata.ref}`, status: "succeeded" };
  }
}

/** Razorpay-style SDK: amount as a string in rupees, positional args, numeric status code. */
export class RazorpaySdk {
  initiateTransaction(orderReference: string, amount: string): {
    txnRef: string;
    code: number;
  } {
    console.log(`  [RazorpaySdk] initiateTransaction ref=${orderReference} amount=₹${amount}`);
    return { txnRef: `rzp_${orderReference}`, code: 200 };
  }
}

// ---------------------------------------------------------------------------
// BAD — checkout talks to every SDK directly
// ---------------------------------------------------------------------------

export function badCheckout(
  gateway: "stripe" | "razorpay",
  amountInRupees: number,
  orderId: string,
): void {
  console.log(`Checkout ₹${amountInRupees} for ${orderId}`);

  if (gateway === "stripe") {
    const res = new StripeSdk().createCharge({
      amount: amountInRupees * 100,
      currency: "INR",
      metadata: { ref: orderId },
    });
    console.log(res.status === "succeeded" ? "Paid ✔\n" : "Failed ✘\n");
  } else if (gateway === "razorpay") {
    const res = new RazorpaySdk().initiateTransaction(orderId, amountInRupees.toFixed(2));
    console.log(res.code === 200 ? "Paid ✔\n" : "Failed ✘\n");
  }
  // Refunds, retries, and reports would each repeat this vendor-specific branching.
}

// ---------------------------------------------------------------------------
// GOOD — one adapter per vendor, all speaking PaymentProcessor
// ---------------------------------------------------------------------------

/** Translates PaymentProcessor calls into StripeSdk calls. */
export class StripeAdapter implements PaymentProcessor {
  constructor(private readonly stripe: StripeSdk) {}

  pay(amountInRupees: number, orderId: string): PaymentResult {
    const response = this.stripe.createCharge({
      amount: Math.round(amountInRupees * 100), // rupees → paise
      currency: "INR",
      metadata: { ref: orderId },
    });

    return {
      success: response.status === "succeeded",
      transactionId: response.id,
    };
  }
}

/** Translates PaymentProcessor calls into RazorpaySdk calls. */
export class RazorpayAdapter implements PaymentProcessor {
  constructor(private readonly razorpay: RazorpaySdk) {}

  pay(amountInRupees: number, orderId: string): PaymentResult {
    const response = this.razorpay.initiateTransaction(
      orderId,
      amountInRupees.toFixed(2), // number → string
    );

    return {
      success: response.code === 200,
      transactionId: response.txnRef,
    };
  }
}

/**
 * Client — only knows PaymentProcessor.
 * Swapping vendors never touches this class.
 */
export class Checkout {
  constructor(private readonly processor: PaymentProcessor) {}

  placeOrder(amountInRupees: number, orderId: string): void {
    console.log(`Checkout ₹${amountInRupees} for ${orderId}`);
    const result = this.processor.pay(amountInRupees, orderId);
    console.log(
      result.success ? `Paid ✔ (txn: ${result.transactionId})\n` : "Payment failed ✘\n",
    );
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:adapter
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Adapter: BAD (checkout knows every SDK) ===\n");
  badCheckout("stripe", 499, "ORD-1");
  badCheckout("razorpay", 199, "ORD-2");

  console.log("=== Adapter: GOOD (one interface, one adapter per vendor) ===\n");

  const stripeCheckout = new Checkout(new StripeAdapter(new StripeSdk()));
  stripeCheckout.placeOrder(499, "ORD-3");

  const razorpayCheckout = new Checkout(new RazorpayAdapter(new RazorpaySdk()));
  razorpayCheckout.placeOrder(199, "ORD-4");

  console.log("Checkout never imported StripeSdk or RazorpaySdk — only PaymentProcessor.");
}
