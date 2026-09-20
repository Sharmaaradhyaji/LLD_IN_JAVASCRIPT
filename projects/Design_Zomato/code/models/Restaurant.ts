/**
 * Restaurant — a place with a location and a menu.
 *
 * Teaching note:
 *   Owns MenuItems (composition). RestaurantManager will hold many of these.
 */
import { MenuItem } from "./MenuItem";

export class Restaurant {
  private readonly menu: MenuItem[] = [];

  constructor(
    private readonly restaurantId: number,
    private readonly name: string,
    private readonly loc: string,
  ) {}

  getId(): number {
    return this.restaurantId;
  }

  getName(): string {
    return this.name;
  }

  getLoc(): string {
    return this.loc;
  }

  addMenuItem(item: MenuItem): void {
    this.menu.push(item);
  }

  getMenu(): readonly MenuItem[] {
    return this.menu;
  }

  toString(): string {
    return `${this.name} @ ${this.loc}`;
  }
}
