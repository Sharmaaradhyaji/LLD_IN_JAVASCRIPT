/**
 * SRP — Single Responsibility Principle
 * =====================================
 *
 * One class → one reason to change.
 *
 * Demo: Invoice processing
 *   BAD  → one class calculates + saves + emails
 *   GOOD → split calculator / repository / mailer
 */

export interface Invoice {
  id: string;
  customerEmail: string;
  items: { name: string; price: number; qty: number }[];
  total?: number;
}

// ---------------------------------------------------------------------------
// BAD — many reasons to change in one place
// ---------------------------------------------------------------------------

export class BadInvoiceService {
  process(invoice: Invoice): void {
    // responsibility 1: calculation
    invoice.total = invoice.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    // responsibility 2: persistence
    console.log(`[Bad] Saving invoice ${invoice.id} to database...`);

    // responsibility 3: notification
    console.log(
      `[Bad] Emailing ${invoice.customerEmail}: total $${invoice.total}`,
    );
  }
}

// ---------------------------------------------------------------------------
// GOOD — each class has one job
// ---------------------------------------------------------------------------

export class InvoiceCalculator {
  calculateTotal(invoice: Invoice): number {
    return invoice.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}

export class InvoiceRepository {
  save(invoice: Invoice): void {
    console.log(`[Repo] Saved invoice ${invoice.id} (total $${invoice.total})`);
  }
}

export class InvoiceMailer {
  send(invoice: Invoice): void {
    console.log(
      `[Mail] Sent receipt to ${invoice.customerEmail} — $${invoice.total}`,
    );
  }
}

/** Orchestrator only — wiring, not business details. */
export class InvoiceService {
  constructor(
    private readonly calculator: InvoiceCalculator,
    private readonly repository: InvoiceRepository,
    private readonly mailer: InvoiceMailer,
  ) {}

  process(invoice: Invoice): void {
    invoice.total = this.calculator.calculateTotal(invoice);
    this.repository.save(invoice);
    this.mailer.send(invoice);
  }
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

if (require.main === module) {
  const invoice: Invoice = {
    id: "INV-101",
    customerEmail: "learner@example.com",
    items: [
      { name: "Maggi 12-pack", price: 10, qty: 2 },
      { name: "KitKat", price: 3, qty: 5 },
    ],
  };

  console.log("=== SRP: BAD (god class) ===");
  new BadInvoiceService().process({ ...invoice, items: [...invoice.items] });

  console.log("\n=== SRP: GOOD (split responsibilities) ===");
  const good = new InvoiceService(
    new InvoiceCalculator(),
    new InvoiceRepository(),
    new InvoiceMailer(),
  );
  good.process(invoice);
}
