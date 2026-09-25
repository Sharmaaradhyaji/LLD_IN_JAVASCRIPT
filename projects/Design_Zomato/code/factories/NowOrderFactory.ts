/**
 * NowOrderFactory — creates an order for immediate fulfillment.
 *
 * Pattern: Factory (concrete)
 *
 * Teaching note:
 *   Zomato injects this factory when the user wants food "now".
 *   Delivery vs Pickup is still chosen via the `type` argument.
 */
import { Cart } from "../models/Cart";
import { DeliveryOrder, Order, PickupOrder } from "../models/Order";
import { User } from "../models/User";
import { IOrderFactory, OrderFulfillmentType } from "./IOrderFactory";

export class NowOrderFactory implements IOrderFactory {
  createOrder(type: OrderFulfillmentType, user: User, cart: Cart): Order {
    const restaurant = cart.getRestaurant();
    if (!restaurant) {
      throw new Error("Cart has no restaurant.");
    }

    if (type === "delivery") {
      // Deliver to the user's saved address.
      return new DeliveryOrder(user, cart, user.getAddress());
    }

    // Pickup: user goes to the restaurant location string.
    return new PickupOrder(user, cart, restaurant.getLoc());
  }
}
