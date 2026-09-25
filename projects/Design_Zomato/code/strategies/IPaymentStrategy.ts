/**
 * IPaymentStrategy — Strategy contract for payment.
 * ==================================================
 *
 * Pattern: Strategy
 *
 * Why:
 *   Checkout should not hard-code "if UPI else if card…".
 *   Each concrete strategy knows ONE way to pay and calls a 3rd-party gateway.
 *
 * Interview line:
 *   "Order depends on IPaymentStrategy; we inject CreditCard / NetBanking / UPI at runtime."
 */
export interface IPaymentStrategy {
  /** Charge `amount`. Returns true on success (demo always succeeds). */
  pay(amount: number): boolean;
}
