/**
 * IOrderFactory — Factory contract
 * ================================
 *
 * Pattern: Factory
 *
 * Tomato asks: "create an order of this type from this cart."
 * Concrete factories decide WHEN (now vs schedule) and HOW (delivery vs pickup).
 */
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { User } from "../models/User";

export type OrderFulfillmentType = "delivery" | "pickup";

export interface IOrderFactory {
  createOrder(type: OrderFulfillmentType, user: User, cart: Cart): Order;
}
