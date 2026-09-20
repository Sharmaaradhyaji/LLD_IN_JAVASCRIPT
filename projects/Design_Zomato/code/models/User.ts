/**
 * User — customer who owns a Cart.
 *
 * Teaching note:
 *   User is a model. Tomato (orchestrator) drives what the user does.
 */
import { Cart } from "./Cart";

export class User {
  private readonly cart: Cart = new Cart();

  constructor(
    private readonly userId: number,
    private readonly name: string,
    private readonly address: string,
  ) {}

  getId(): number {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getAddress(): string {
    return this.address;
  }

  getCart(): Cart {
    return this.cart;
  }
}
