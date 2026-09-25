/**
 * CreditCardPayment — one Strategy implementation.
 *
 * Teaching note:
 *   We do NOT implement PCI, tokenization, or bank APIs here.
 *   This class is a thin stand-in for "call Razorpay / Stripe with card method."
 */
import { IPaymentStrategy } from "./IPaymentStrategy";

export class CreditCardPayment implements IPaymentStrategy {
  constructor(private readonly cardNumberMasked: string) {}

  pay(amount: number): boolean {
    console.log(
      `[CreditCard] Charging ₹${amount} via 3rd-party gateway (card ${this.cardNumberMasked})`,
    );
    // Imagine: razorpay.charge({ method: "card", amount })
    return true;
  }
}
