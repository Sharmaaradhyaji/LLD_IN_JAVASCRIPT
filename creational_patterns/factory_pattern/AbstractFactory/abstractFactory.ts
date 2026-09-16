/**
 * ABSTRACT FACTORY — Nestlé Combo Pack
 * =====================================
 *
 * Definition:
 *   Provide an interface to create a FAMILY of related products
 *   (noodles + chocolate + drink) without naming concrete classes.
 *
 * vs Factory Method:
 *   Factory Method  → create ONE product (createProduct(type))
 *   Abstract Factory → create a MATCHING SET (createNoodles + createChocolate + createDrink)
 *
 * Flow:
 *   client → NestleFactory (India or Swiss)
 *         → createNoodles() / createChocolate() / createDrink()
 *         → prepare() each — all from the same region
 */

// ---------------------------------------------------------------------------
// 1. Abstract products — three slots in every Nestlé combo
// ---------------------------------------------------------------------------

export abstract class Noodles {
  abstract prepare(): void;
}

export abstract class Chocolate {
  abstract prepare(): void;
}

export abstract class Drink {
  abstract prepare(): void;
}

// ---------------------------------------------------------------------------
// 2. India family
// ---------------------------------------------------------------------------

export class Maggi extends Noodles {
  prepare(): void {
    console.log("Maggi (India): classic masala noodles.");
  }
}

export class KitKat extends Chocolate {
  prepare(): void {
    console.log("KitKat (India): milk chocolate break.");
  }
}

export class Milo extends Drink {
  prepare(): void {
    console.log("Milo (India): chocolate malt drink.");
  }
}

// ---------------------------------------------------------------------------
// 3. Swiss family (related products that belong together)
// ---------------------------------------------------------------------------

export class MaggiAtta extends Noodles {
  prepare(): void {
    console.log("Maggi Atta (Swiss): whole-wheat noodles.");
  }
}

export class KitKatDark extends Chocolate {
  prepare(): void {
    console.log("KitKat Dark (Swiss): rich dark chocolate.");
  }
}

export class MiloSwiss extends Drink {
  prepare(): void {
    console.log("Milo Swiss: original Swiss creamy formula.");
  }
}

// ---------------------------------------------------------------------------
// 4. Abstract Factory — creates the whole family
// ---------------------------------------------------------------------------

/**
 * Abstract factory: one method per product slot.
 * Concrete factories return a consistent regional set.
 */
export abstract class NestleFactory {
  abstract createNoodles(): Noodles;
  abstract createChocolate(): Chocolate;
  abstract createDrink(): Drink;
}

/** India plant — Maggi + KitKat + Milo always travel together. */
export class IndiaNestleFactory extends NestleFactory {
  createNoodles(): Noodles {
    return new Maggi();
  }

  createChocolate(): Chocolate {
    return new KitKat();
  }

  createDrink(): Drink {
    return new Milo();
  }
}

/** Swiss plant — MaggiAtta + KitKatDark + MiloSwiss always travel together. */
export class SwissNestleFactory extends NestleFactory {
  createNoodles(): Noodles {
    return new MaggiAtta();
  }

  createChocolate(): Chocolate {
    return new KitKatDark();
  }

  createDrink(): Drink {
    return new MiloSwiss();
  }
}

// ---------------------------------------------------------------------------
// 5. Client — depends only on NestleFactory + abstract products
// ---------------------------------------------------------------------------

function serveCombo(label: string, factory: NestleFactory): void {
  console.log(`\n=== ${label} combo pack ===`);

  const noodles = factory.createNoodles();
  const chocolate = factory.createChocolate();
  const drink = factory.createDrink();

  noodles.prepare();
  chocolate.prepare();
  drink.prepare();
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:abstract-factory
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("Abstract Factory: swap the factory → entire family switches\n");

  serveCombo("India Nestlé", new IndiaNestleFactory());
  serveCombo("Swiss Nestlé", new SwissNestleFactory());

  // New JapanNestleFactory later? Client serveCombo() stays untouched.
}
