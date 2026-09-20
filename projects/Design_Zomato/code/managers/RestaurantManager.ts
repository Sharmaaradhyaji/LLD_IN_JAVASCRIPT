/**
 * RestaurantManager — SINGLETON
 * ==============================
 *
 * Pattern: Singleton
 *
 * Why:
 *   The whole app should see ONE catalog of restaurants.
 *   If every screen created its own manager, search results would diverge.
 *
 * How to explain:
 *   1. constructor is private → cannot `new RestaurantManager()` from outside
 *   2. getInstance() creates once, then always returns that same object
 *   3. searchByLoc fulfills the functional requirement: search by location
 */
import { Restaurant } from "../models/Restaurant";

export class RestaurantManager {
  private static instance: RestaurantManager | null = null;
  private readonly restaurants: Restaurant[] = [];

  private constructor() {
    // Intentionally empty — creation only via getInstance().
  }

  static getInstance(): RestaurantManager {
    if (!RestaurantManager.instance) {
      RestaurantManager.instance = new RestaurantManager();
    }
    return RestaurantManager.instance;
  }

  /** Test / demo helper so each demo run starts clean. */
  static resetInstance(): void {
    RestaurantManager.instance = null;
  }

  addRestaurant(restaurant: Restaurant): void {
    this.restaurants.push(restaurant);
  }

  searchByLoc(loc: string): Restaurant[] {
    const needle = loc.trim().toLowerCase();
    return this.restaurants.filter(
      (r) => r.getLoc().toLowerCase() === needle,
    );
  }

  listAll(): readonly Restaurant[] {
    return this.restaurants;
  }
}
