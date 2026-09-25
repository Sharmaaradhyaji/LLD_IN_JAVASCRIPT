/**
 * Cart — items a user intends to order from ONE restaurant.
 *
 * Teaching note:
 *   We bind the cart to a restaurant so you cannot mix Pizza Hut + Domino's
 *   in the same checkout (common food-app rule, keeps the demo honest).
 */
import { MenuItem } from "./MenuItem";
import { Restaurant } from "./Restaurant";

export class Cart {
  private restaurant: Restaurant | null = null;
  private readonly items: MenuItem[] = [];

  setRestaurant(restaurant: Restaurant): void {
    // Switching restaurants clears previous items — keeps the invariant.
    if (this.restaurant && this.restaurant.getId() !== restaurant.getId()) {
      this.items.length = 0;
    }
    this.restaurant = restaurant;
  }

  getRestaurant(): Restaurant | null {
    return this.restaurant;
  }

  addItem(item: MenuItem): void {
    if (!this.restaurant) {
      throw new Error("Select a restaurant before adding items to the cart.");
    }
    this.items.push(item);
  }

  getItems(): readonly MenuItem[] {
    return this.items;
  }

  totalCost(): number {
    return this.items.reduce((sum, item) => sum + item.getPrice(), 0);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items.length = 0;
    this.restaurant = null;
  }
}
