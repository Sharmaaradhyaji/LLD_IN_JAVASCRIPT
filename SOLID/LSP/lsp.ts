/**
 * LSP — Liskov Substitution Principle
 * ===================================
 *
 * Subtypes must be safely substitutable for their base type.
 *
 * Demo: Bird hierarchy
 *   BAD  → Penguin extends Bird with fly() that throws
 *   GOOD → only FlyingBird has fly(); Penguin just moves
 */

// ---------------------------------------------------------------------------
// BAD — Penguin is a Bird but cannot honour fly()
// ---------------------------------------------------------------------------

export class BadBird {
  fly(): void {
    console.log("Flying...");
  }
}

export class BadPenguin extends BadBird {
  override fly(): void {
    throw new Error("Penguins can't fly!"); // breaks callers of Bird.fly()
  }
}

function makeBadBirdsFly(birds: BadBird[]): void {
  for (const bird of birds) {
    bird.fly(); // unsafe when a Penguin is in the list
  }
}

// ---------------------------------------------------------------------------
// GOOD — don’t put fly() on birds that can’t fly
// ---------------------------------------------------------------------------

export class Bird {
  move(): void {
    console.log(`${this.constructor.name} is moving`);
  }
}

export class FlyingBird extends Bird {
  fly(): void {
    console.log(`${this.constructor.name} is flying`);
  }
}

export class Sparrow extends FlyingBird {}

export class Penguin extends Bird {
  override move(): void {
    console.log("Penguin is swimming / waddling");
  }
}

function makeFlyingBirdsFly(birds: FlyingBird[]): void {
  for (const bird of birds) {
    bird.fly(); // safe — type system only allows flyers
  }
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== LSP: BAD ===");
  try {
    makeBadBirdsFly([new BadBird(), new BadPenguin()]);
  } catch (err) {
    console.log("Crashed:", (err as Error).message);
  }

  console.log("\n=== LSP: GOOD ===");
  const flyers: FlyingBird[] = [new Sparrow()];
  makeFlyingBirdsFly(flyers);

  const allBirds: Bird[] = [new Sparrow(), new Penguin()];
  for (const bird of allBirds) {
    bird.move(); // shared contract — every Bird can honour this
  }
}
