/**
 * NetBankingPayment — Strategy for bank redirect / net-banking rails.
 */
import { IPaymentStrategy } from "./IPaymentStrategy";

export class NetBankingPayment implements IPaymentStrategy {
  constructor(private readonly bankName: string) {}

  pay(amount: number): boolean {
    console.log(
      `[NetBanking] Charging ₹${amount} via 3rd-party gateway (bank: ${this.bankName})`,
    );
    return true;
  }
}
