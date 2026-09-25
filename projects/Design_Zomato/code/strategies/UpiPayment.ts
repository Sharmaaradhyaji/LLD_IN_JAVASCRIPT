/**
 * UpiPayment — Strategy for UPI (common in India food apps).
 */
import { IPaymentStrategy } from "./IPaymentStrategy";

export class UpiPayment implements IPaymentStrategy {
  constructor(private readonly upiId: string) {}

  pay(amount: number): boolean {
    console.log(
      `[UPI] Charging ₹${amount} via 3rd-party gateway (VPA: ${this.upiId})`,
    );
    return true;
  }
}
