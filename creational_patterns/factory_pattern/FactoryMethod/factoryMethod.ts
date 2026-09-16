/**
 * FACTORY METHOD — Nestlé Regional Plants
 * ========================================
 *
 * Definition:
 *   Define an abstract factory method. Subclasses override it and
 *   decide WHICH concrete product to return.
 *
 * vs Simple Factory:
 *   Simple Factory  → one class, one big switch
 *   Factory Method  → hierarchy of factories (India / Swiss)
 *
 * Flow:
 *   client → NestleFactory.createProduct("maggi")
 *         → IndiaNestleFactory returns Maggi
 *         → SwissNestleFactory returns MaggiAtta
 */

// ---------------------------------------------------------------------------
// 1. Product hierarchy
// ---------------------------------------------------------------------------

/** Abstract product — every Nestlé snack can prepare itself. */
export abstract class NestleProduct {
  abstract prepare(): void;
}

// --- India line ---

export class Maggi extends NestleProduct {
  prepare(): void {
    console.log("Maggi (India): classic masala noodles in 2 minutes.");
  }
}

export class KitKat extends NestleProduct {
  prepare(): void {
    console.log("KitKat (India): milk chocolate break.");
  }
}

export class Milo extends NestleProduct {
  prepare(): void {
    console.log("Milo (India): chocolate malt drink for the win.");
  }
}

// --- Swiss / premium line (different concrete classes, same abstract type) ---

export class MaggiAtta extends NestleProduct {
  prepare(): void {
    console.log(
      "Maggi Atta (Swiss line): whole-wheat noodles, healthier twist.",
    );
  }
}

export class KitKatDark extends NestleProduct {
  prepare(): void {
    console.log("KitKat Dark (Swiss line): rich dark chocolate snap.");
  }
}

export class MiloSwiss extends NestleProduct {
  prepare(): void {
    console.log("Milo Swiss: original Swiss formula, extra creamy.");
  }
}

// ---------------------------------------------------------------------------
// 2. Creator hierarchy — Factory Method lives here
// ---------------------------------------------------------------------------

export type ProductType = "maggi" | "kitkat" | "milo";

/**
 * Abstract creator.
 * Declares createProduct() — subclasses MUST implement it.
 */
export abstract class NestleFactory {
  /** Factory Method — subclasses decide the concrete NestleProduct. */
  abstract createProduct(type: ProductType): NestleProduct;

  /** Optional shared workflow: create then prepare. */
  order(type: ProductType): void {
    const product = this.createProduct(type);
    product.prepare();
  }
}

/** India plant — returns Maggi / KitKat / Milo. */
export class IndiaNestleFactory extends NestleFactory {
  createProduct(type: ProductType): NestleProduct {
    switch (type) {
      case "maggi":
        return new Maggi();
      case "kitkat":
        return new KitKat();
      case "milo":
        return new Milo();
      default: {
        const _exhaustive: never = type;
        throw new Error(`Unknown type: ${_exhaustive}`);
      }
    }
  }
}

/** Swiss plant — returns MaggiAtta / KitKatDark / MiloSwiss. */
export class SwissNestleFactory extends NestleFactory {
  createProduct(type: ProductType): NestleProduct {
    switch (type) {
      case "maggi":
        return new MaggiAtta();
      case "kitkat":
        return new KitKatDark();
      case "milo":
        return new MiloSwiss();
      default: {
        const _exhaustive: never = type;
        throw new Error(`Unknown type: ${_exhaustive}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Client — only knows NestleFactory + NestleProduct
// ---------------------------------------------------------------------------

function serveRegion(label: string, factory: NestleFactory): void {
  console.log(`\n=== ${label} ===`);
  factory.order("maggi");
  factory.order("kitkat");
  factory.order("milo");
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:factory-method
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("Factory Method: same order type, different regional products\n");

  serveRegion("India Nestlé Factory", new IndiaNestleFactory());
  serveRegion("Swiss Nestlé Factory", new SwissNestleFactory());

  // Extending later? Add JapanNestleFactory — no edits to India/Swiss.
}
