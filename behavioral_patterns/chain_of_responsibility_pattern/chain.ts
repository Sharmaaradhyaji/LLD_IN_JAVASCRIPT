/**
 * CHAIN OF RESPONSIBILITY — Expense Approval
 * ===========================================
 *
 * Definition:
 *   Pass a request along a chain of handlers. Each handler either
 *   handles it or forwards it to the next one. The sender knows
 *   only the first handler, not who will actually approve.
 *
 * Use-case specific:
 *   Only when a request should be offered to a sequence of candidates,
 *   each of whom may deal with it or pass, and the sender must not
 *   hard-code who that candidate is.
 *
 * Problem it solves:
 *   One function that knows every approver's limit. A new role
 *   (CFO) means editing that function, and the submitter is coupled
 *   to the whole org chart.
 */

export interface ExpenseRequest {
  id: string;
  purpose: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// BAD — one function knows every limit and every title
// ---------------------------------------------------------------------------

export function badApprove(request: ExpenseRequest): void {
  const { amount, purpose, id } = request;

  if (amount <= 5_000) {
    console.log(`  [Manager Asha] Approved ₹${amount} for "${purpose}" (${id})`);
  } else if (amount <= 20_000) {
    console.log(`  [Director Rohit] Approved ₹${amount} for "${purpose}" (${id})`);
  } else if (amount <= 100_000) {
    console.log(`  [VP Meera] Approved ₹${amount} for "${purpose}" (${id})`);
  } else {
    // A CFO would be another branch here, and in every copy of this function.
    console.log(`  [Rejected] No approver can sign ₹${amount} for "${purpose}" (${id})`);
  }
}

// ---------------------------------------------------------------------------
// GOOD — Chain of Responsibility
// ---------------------------------------------------------------------------

/**
 * Handler. Knows its own rule and the next handler, nothing else.
 * setNext() returns the handler you just attached, so the chain reads
 * in order: manager.setNext(director).setNext(vp)
 * means manager → director → vp. Returning `this` would stack both
 * links on the manager and drop the director.
 */
export abstract class Approver {
  private next: Approver | null = null;

  constructor(
    protected readonly title: string,
    protected readonly name: string,
    private readonly limit: number,
  ) {}

  setNext(next: Approver): Approver {
    this.next = next;
    return next;
  }

  approve(request: ExpenseRequest): void {
    if (request.amount <= this.limit) {
      console.log(
        `  [${this.title} ${this.name}] Approved ₹${request.amount} for "${request.purpose}" (${request.id})`,
      );
      return;
    }

    if (this.next) {
      console.log(
        `  [${this.title} ${this.name}] ₹${request.amount} is above my ₹${this.limit} limit — passing on`,
      );
      this.next.approve(request);
      return;
    }

    console.log(
      `  [${this.title} ${this.name}] ₹${request.amount} is above my ₹${this.limit} limit, and nobody comes after me — rejected (${request.id})`,
    );
  }
}

/** Signs up to ₹5,000. Team lunches, software seats. */
export class Manager extends Approver {
  constructor(name: string) {
    super("Manager", name, 5_000);
  }
}

/** Signs up to ₹20,000. Conferences, hardware. */
export class Director extends Approver {
  constructor(name: string) {
    super("Director", name, 20_000);
  }
}

/** Signs up to ₹1,00,000. Offsites, annual tools. */
export class VP extends Approver {
  constructor(name: string) {
    super("VP", name, 100_000);
  }
}

/** Added later. Signs up to ₹10,00,000. No existing class is edited. */
export class CFO extends Approver {
  constructor(name: string) {
    super("CFO", name, 1_000_000);
  }
}

/**
 * The submitter. Holds the head of the chain and nothing else.
 * It does not know about managers, limits, or the CFO.
 */
export class ExpenseSubmitter {
  constructor(private readonly firstApprover: Approver) {}

  submit(request: ExpenseRequest): void {
    console.log(`Submit ${request.id}: "${request.purpose}" — ₹${request.amount}`);
    this.firstApprover.approve(request);
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:chain
// ---------------------------------------------------------------------------

if (require.main === module) {
  const requests: ExpenseRequest[] = [
    { id: "EX-1", purpose: "Team lunch", amount: 1_200 },
    { id: "EX-2", purpose: "Conference ticket", amount: 18_000 },
    { id: "EX-3", purpose: "Team offsite", amount: 75_000 },
    { id: "EX-4", purpose: "Office acquisition deposit", amount: 500_000 },
  ];

  console.log("=== Chain of Responsibility: BAD (one function, every limit) ===\n");
  for (const request of requests) {
    console.log(`Submit ${request.id}: ₹${request.amount}`);
    badApprove(request);
  }
  console.log("\nEX-4 is rejected. Signing it means editing badApprove().\n");

  console.log("=== Chain of Responsibility: GOOD (each approver knows only itself) ===\n");

  const manager = new Manager("Asha");
  const director = new Director("Rohit");
  const vp = new VP("Meera");
  manager.setNext(director).setNext(vp);

  const submitter = new ExpenseSubmitter(manager);
  for (const request of requests) {
    submitter.submit(request);
    console.log();
  }

  console.log("--- CFO joins the chain. Submitter and the other approvers stay as they are ---\n");
  vp.setNext(new CFO("Kabir"));
  submitter.submit(requests[3]);
}
