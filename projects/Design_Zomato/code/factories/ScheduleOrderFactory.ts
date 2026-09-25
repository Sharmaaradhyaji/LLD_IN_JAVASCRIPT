/**
 * ScheduleOrderFactory — creates an order for a future time slot.
 *
 * Pattern: Factory (concrete)
 *
 * Teaching note:
 *   Same Delivery / Pickup products as NowOrderFactory, but we capture
 *   scheduleTime. In a real app this would feed a scheduler / kitchen queue.
 *   For LLD we store it and log it so the pattern is visible.
 */
import { Cart } from "../models/Cart";
import { DeliveryOrder, Order, PickupOrder } from "../models/Order";
import { User } from "../models/User";
import { IOrderFactory, OrderFulfillmentType } from "./IOrderFactory";

export class ScheduleOrderFactory implements IOrderFactory {
  constructor(private readonly scheduleTime: string) {}

  getScheduleTime(): string {
    return this.scheduleTime;
  }

  createOrder(type: OrderFulfillmentType, user: User, cart: Cart): Order {
    console.log(
      `[ScheduleOrderFactory] Scheduling order for ${this.scheduleTime}`,
    );

    const restaurant = cart.getRestaurant();
    if (!restaurant) {
      throw new Error("Cart has no restaurant.");
    }

    if (type === "delivery") {
      return new DeliveryOrder(user, cart, user.getAddress());
    }

    return new PickupOrder(user, cart, restaurant.getLoc());
  }
}
