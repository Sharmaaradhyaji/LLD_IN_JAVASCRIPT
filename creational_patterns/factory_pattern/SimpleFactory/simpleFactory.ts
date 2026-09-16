/**
 * SIMPLE FACTORY — Nestlé Products
 * =================================
 *
 * Definition:
 *   One factory class creates products based on a type string.
 *   Client never calls `new Maggi()` / `new KitKat()` directly.
 *
 * Flow:
 *   client → NestleFactory.createProduct("maggi") → Maggi
 *   client → product.prepare()
 */

// ---------------------------------------------------------------------------
// 1. Product hierarchy — every snack knows how to prepare itself
// ---------------------------------------------------------------------------

/** Abstract product — client only depends on this. */
export abstract class NestleProduct {
  abstract prepare(): void;
}

export class Maggi extends NestleProduct {
  prepare(): void {
    console.log("Maggi: boil water → add masala → noodles ready!");
  }
}

export class KitKat extends NestleProduct {
  prepare(): void {
    console.log("KitKat: unwrap → snap → enjoy the break.");
  }
}

export class Milo extends NestleProduct {
  prepare(): void {
    console.log("Milo: scoop powder → mix with milk → energy drink!");
  }
}

// ---------------------------------------------------------------------------
// 2. Simple Factory — ONE place that knows which class to `new`
// ---------------------------------------------------------------------------

export type NestleProductType = "maggi" | "kitkat" | "milo";

/**
 * NestleFactory centralizes creation.
 *
 * Trade-off: adding "nescafe" means editing this class (OCP weak point).
 * That is OK for a small product list — and motivation for Factory Method which is next.
 */
export class NestleFactory {
  createProduct(type: NestleProductType): NestleProduct {
    switch (type) {
      case "maggi":
        return new Maggi();
      case "kitkat":
        return new KitKat();
      case "milo":
        return new Milo();
      default: {
        // Exhaustiveness guard — TypeScript helps here
        // TypeScript uses the never type—a type that represents values which should never occur. If your code handles every member of a union type, narrowing reduces the remaining type to never. If a new type is added later, it fails to narrow to never, causing a compiler error. [1] (https://gibbok.github.io/typescript-book/book/exhaustiveness-checking/), [2] (https://www.geeksforgeeks.org/typescript/typescript-exhaustiveness-checking/)
        const _exhaustive: never = type;
        throw new Error(`Unknown Nestlé product: ${_exhaustive}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Client — depends on NestleProduct, not Maggi/KitKat/Milo
// ---------------------------------------------------------------------------

function orderFromNestle(type: NestleProductType): void {
  const factory = new NestleFactory();
  const product = factory.createProduct(type);

  console.log(`\nOrder received: ${type}`);
  product.prepare();
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:simple-factory
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Simple Factory: Nestlé ===");
  orderFromNestle("maggi");
  orderFromNestle("kitkat");
  orderFromNestle("milo");
}
