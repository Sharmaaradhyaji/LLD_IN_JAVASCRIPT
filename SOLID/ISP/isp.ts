/**
 * ISP — Interface Segregation Principle
 * =====================================
 *
 * Don't force clients to depend on methods they don't use.
 *
 * Demo: workers
 *   BAD  → fat Worker interface (work + eat) forces Robot.eat()
 *   GOOD → Workable + Eatable; Robot only implements Workable
 */

// ---------------------------------------------------------------------------
// BAD — fat interface
// ---------------------------------------------------------------------------

export interface BadWorker {
  work(): void;
  eat(): void;
}

export class BadHumanWorker implements BadWorker {
  work(): void {
    console.log("[Human] working");
  }
  eat(): void {
    console.log("[Human] eating lunch");
  }
}

export class BadRobotWorker implements BadWorker {
  work(): void {
    console.log("[Robot] working");
  }
  eat(): void {
    // forced to implement — meaningless
    throw new Error("Robots don't eat");
  }
}

// ---------------------------------------------------------------------------
// GOOD — segregated interfaces
// ---------------------------------------------------------------------------

export interface Workable {
  work(): void;
}

export interface Eatable {
  eat(): void;
}

export class HumanWorker implements Workable, Eatable {
  work(): void {
    console.log("[Human] working");
  }
  eat(): void {
    console.log("[Human] eating lunch");
  }
}

export class RobotWorker implements Workable {
  work(): void {
    console.log("[Robot] working");
  }
}

function runShift(workers: Workable[]): void {
  for (const w of workers) {
    w.work();
  }
}

function serveLunch(eaters: Eatable[]): void {
  for (const e of eaters) {
    e.eat();
  }
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== ISP: BAD ===");
  const badRobot = new BadRobotWorker();
  badRobot.work();
  try {
    badRobot.eat();
  } catch (err) {
    console.log("Forced fake method:", (err as Error).message);
  }

  console.log("\n=== ISP: GOOD ===");
  const human = new HumanWorker();
  const robot = new RobotWorker();

  runShift([human, robot]);
  serveLunch([human]); // robot simply isn't in this list — no fake eat()
}
