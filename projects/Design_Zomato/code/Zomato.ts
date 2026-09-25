/**
 * Zomato — orchestration / facade for the food-delivery app.
 * ==========================================================
 *
 * Teaching note:
 *   Zomato knows the USER JOURNEY (search → cart → checkout).
 *   It does NOT own restaurant storage (Singleton managers),
 *   does NOT construct Delivery/Pickup itself (Factory),
 *   and does NOT hard-code UPI vs card (Strategy).
 *
 * Patterns wired here:
 *   - Singleton  → RestaurantManager / OrderManager via getInstance()
 *   - Factory    → IOrderFactory.createOrder(...)
 *   - Strategy   → IPaymentStrategy passed into checkout
 */
import { IOrderFactory, OrderFulfillmentType } from "./factories/IOrderFactory";
import { OrderManager } from "./managers/OrderManager";
import { RestaurantManager } from "./managers/RestaurantManager";
import { MenuItem } from "./models/MenuItem";
import { Order } from "./models/Order";
import { Restaurant } from "./models/Restaurant";
import { User } from "./models/User";
import { NotificationService } from "./services/NotificationService";
import { IPaymentStrategy } from "./strategies/IPaymentStrategy";

export class Zomato {
  private readonly restaurantManager = RestaurantManager.getInstance();
  private readonly orderManager = OrderManager.getInstance();
  private readonly notificationService = new NotificationService();

  /** Functional requirement: search restaurants by location. */
  searchRestaurants(loc: string): Restaurant[] {
    return this.restaurantManager.searchByLoc(loc);
  }

  /** Bind the user's cart to one restaurant (clears cart if switching). */
  selectRestaurant(user: User, restaurant: Restaurant): void {
    user.getCart().setRestaurant(restaurant);
    console.log(
      `[Zomato] ${user.getName()} selected ${restaurant.toString()}`,
    );
  }

  /** Functional requirement: add items to cart. */
  addToCart(user: User, item: MenuItem): void {
    user.getCart().addItem(item);
    console.log(`[Zomato] Added ${item.toString()} to cart`);
  }

  /**
   * Functional requirements: checkout + payment + notify on success.
   *
   * @param orderType  "delivery" | "pickup" — Factory builds the right Order subclass
   * @param payment    Strategy chosen by the user (UPI / card / net-banking)
   * @param factory    Now vs Schedule factory injected by the caller
   */
  checkout(
    user: User,
    orderType: OrderFulfillmentType,
    payment: IPaymentStrategy,
    factory: IOrderFactory,
  ): Order {
    const cart = user.getCart();
    if (cart.isEmpty()) {
      throw new Error("Cart is empty — nothing to checkout.");
    }

    // 1) Factory creates DeliveryOrder or PickupOrder
    const order = factory.createOrder(orderType, user, cart);

    // 2) Strategy handles payment (3rd-party behind a thin class)
    order.setPaymentStrategy(payment);
    const paid = order.processPayment();
    if (!paid) {
      throw new Error("Payment failed.");
    }

    // 3) Singleton OrderManager records the order
    this.orderManager.addOrder(order);

    // 4) Lean notification to the user
    this.notificationService.notify(user, order);

    // 5) Cart lifecycle
    cart.clear();

    console.log(
      `[Zomato] Checkout complete → Order #${order.getId()} (${order.getType()})`,
    );
    return order;
  }

  listOrders(): readonly Order[] {
    return this.orderManager.listOrders();
  }
}
