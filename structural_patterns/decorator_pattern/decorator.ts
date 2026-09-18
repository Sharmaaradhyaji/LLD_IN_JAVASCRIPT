/**
 * DECORATOR — Coffee Shop Toppings
 * =================================
 *
 * Definition:
 *   Wrap an object with the SAME interface to add behaviour dynamically.
 *   Stack wrappers instead of creating MilkSugarWhipCoffee subclasses.
 *
 * Flow:
 *   SimpleCoffee → MilkDecorator → SugarDecorator → WhipDecorator
 *   Each layer adds cost + description, then delegates inward.
 */

// ---------------------------------------------------------------------------
// 1. Component interface — everyone looks the same to the client
// ---------------------------------------------------------------------------

export interface Beverage {
  cost(): number;
  description(): string;
}

// ---------------------------------------------------------------------------
// 2. Concrete component — the base drink
// ---------------------------------------------------------------------------

export class SimpleCoffee implements Beverage {
  cost(): number {
    return 2;
  }

  description(): string {
    return "Simple coffee";
  }
}

// ---------------------------------------------------------------------------
// 3. Base decorator — holds a Beverage and forwards calls
// ---------------------------------------------------------------------------

export abstract class BeverageDecorator implements Beverage {
  constructor(protected readonly beverage: Beverage) {}

  cost(): number {
    return this.beverage.cost();
  }

  description(): string {
    return this.beverage.description();
  }
}

// ---------------------------------------------------------------------------
// 4. Concrete decorators — each adds one topping
// ---------------------------------------------------------------------------

export class MilkDecorator extends BeverageDecorator {
  cost(): number {
    return this.beverage.cost() + 0.5;
  }

  description(): string {
    return `${this.beverage.description()}, milk`;
  }
}

export class SugarDecorator extends BeverageDecorator {
  cost(): number {
    return this.beverage.cost() + 0.2;
  }

  description(): string {
    return `${this.beverage.description()}, sugar`;
  }
}

export class WhipDecorator extends BeverageDecorator {
  cost(): number {
    return this.beverage.cost() + 0.7;
  }

  description(): string {
    return `${this.beverage.description()}, whip`;
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:decorator
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Decorator: Coffee Shop ===\n");

  let order: Beverage = new SimpleCoffee();
  console.log(`1. ${order.description()} — $${order.cost().toFixed(2)}`);

  order = new MilkDecorator(order);
  console.log(`2. ${order.description()} — $${order.cost().toFixed(2)}`);

  order = new SugarDecorator(order);
  console.log(`3. ${order.description()} — $${order.cost().toFixed(2)}`);

  order = new WhipDecorator(order);
  console.log(`4. ${order.description()} — $${order.cost().toFixed(2)}`);

  console.log("\n--- Another combo: sugar only ---");
  const light: Beverage = new SugarDecorator(new SimpleCoffee());
  console.log(`${light.description()} — $${light.cost().toFixed(2)}`);
}
