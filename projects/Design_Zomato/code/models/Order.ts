/**
 * Order hierarchy — abstract Order + DeliveryOrder + PickupOrder.
 *
 * Teaching note:
 *   - Order holds an IPaymentStrategy (Strategy pattern).
 *   - Factories create Delivery vs Pickup so Tomato never `new`s these directly.
 *   - processPayment() delegates to the strategy — Order does not know UPI vs card.
 */
import { Cart } from "./Cart";
import { MenuItem } from "./MenuItem";
import { Restaurant } from "./Restaurant";
import { User } from "./User";
import { IPaymentStrategy } from "../strategies/IPaymentStrategy";

let nextOrderId = 1;

export abstract class Order {
  protected readonly id: number;
  protected readonly user: User;
  protected readonly restaurant: Restaurant;
  protected readonly items: MenuItem[];
  protected paymentStrategy: IPaymentStrategy | null = null;

  protected constructor(user: User, cart: Cart) {
    const restaurant = cart.getRestaurant();
    if (!restaurant || cart.isEmpty()) {
      throw new Error("Cannot create an order from an empty cart.");
    }

    this.id = nextOrderId++;
    this.user = user;
    this.restaurant = restaurant;
    // Snapshot items so later cart.clear() does not wipe the order history.
    this.items = [...cart.getItems()];
  }

  getId(): number {
    return this.id;
  }

  getUser(): User {
    return this.user;
  }

  getRestaurant(): Restaurant {
    return this.restaurant;
  }

  getItems(): readonly MenuItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getPrice(), 0);
  }

  setPaymentStrategy(strategy: IPaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  /**
   * Strategy in action: Order only calls pay(amount).
   * Which gateway / method is used is decided by the injected strategy.
   */
  processPayment(): boolean {
    if (!this.paymentStrategy) {
      throw new Error("Payment strategy not set on order.");
    }
    return this.paymentStrategy.pay(this.getTotal());
  }

  abstract getType(): string;
}

/** Food comes to the user's address. */
export class DeliveryOrder extends Order {
  constructor(
    user: User,
    cart: Cart,
    private readonly address: string,
  ) {
    super(user, cart);
  }

  getAddress(): string {
    return this.address;
  }

  getType(): string {
    return "Delivery";
  }
}

/** User picks up from the restaurant. */
export class PickupOrder extends Order {
  constructor(
    user: User,
    cart: Cart,
    private readonly restaurantAddress: string,
  ) {
    super(user, cart);
  }

  getRestaurantAddress(): string {
    return this.restaurantAddress;
  }

  getType(): string {
    return "Pickup";
  }
}
