/**
 * MenuItem — smallest building block of a restaurant menu.
 *
 * Teaching note:
 *   Pure data model. No payment, no cart, no managers.
 *   Start here when explaining bottom-up design.
 */
export class MenuItem {
  constructor(
    private readonly code: string,
    private readonly name: string,
    private readonly price: number,
  ) {}

  getCode(): string {
    return this.code;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  toString(): string {
    return `${this.name} (₹${this.price})`;
  }
}
