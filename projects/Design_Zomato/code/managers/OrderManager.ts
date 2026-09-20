/**
 * OrderManager — SINGLETON
 * ========================
 *
 * Pattern: Singleton
 *
 * Why:
 *   After checkout we need one place that remembers every placed order
 *   (admin list, user history, demos). Same getInstance() idea as RestaurantManager.
 */
import { Order } from "../models/Order";

export class OrderManager {
  private static instance: OrderManager | null = null;
  private readonly orders: Order[] = [];

  private constructor() {}

  static getInstance(): OrderManager {
    if (!OrderManager.instance) {
      OrderManager.instance = new OrderManager();
    }
    return OrderManager.instance;
  }

  static resetInstance(): void {
    OrderManager.instance = null;
  }

  addOrder(order: Order): void {
    this.orders.push(order);
  }

  listOrders(): readonly Order[] {
    return this.orders;
  }
}
