/**
 * BRIDGE — Payroll Reports
 * ========================
 *
 * Definition:
 *   Split one thing that varies in TWO independent directions into two
 *   hierarchies, and connect them with a reference. The abstraction
 *   (what the report says) holds an implementor (how it is drawn).
 *
 * Use-case specific:
 *   Only when BOTH sides will grow. Otherwise you just have a strategy.
 *   3 report types × 3 formats is 9 classes without a bridge, and 6 with one.
 *
 * Problem it solves:
 *   SalarySlipPdf, SalarySlipHtml, TaxSummaryPdf, TaxSummaryHtml.
 *   A new format means a new class for every report. A new report means
 *   a new class for every format.
 */

export interface Employee {
  name: string;
  netPay: number;
  tax: number;
  daysPresent: number;
}

// ---------------------------------------------------------------------------
// BAD — every combination is its own function. The grid is the design.
// ---------------------------------------------------------------------------

export function badPrint(
  kind: "salary" | "tax",
  format: "pdf" | "html",
  employee: Employee,
): string {
  if (kind === "salary" && format === "pdf") {
    return [
      "PDF :: Salary slip",
      `  Employee: ${employee.name}`,
      `  Net pay: ₹${employee.netPay}`,
      "PDF :: end",
    ].join("\n");
  }
  if (kind === "salary" && format === "html") {
    return [
      "<h1>Salary slip</h1>",
      `<p>Employee: ${employee.name}</p>`,
      `<p>Net pay: ₹${employee.netPay}</p>`,
    ].join("\n");
  }
  if (kind === "tax" && format === "pdf") {
    return [
      "PDF :: Tax summary",
      `  Employee: ${employee.name}`,
      `  Tax deducted: ₹${employee.tax}`,
      "PDF :: end",
    ].join("\n");
  }
  // kind === "tax" && format === "html"
  // Attendance × CSV would be more branches in this function.
  return [
    "<h1>Tax summary</h1>",
    `<p>Employee: ${employee.name}</p>`,
    `<p>Tax deducted: ₹${employee.tax}</p>`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// GOOD — Bridge
// ---------------------------------------------------------------------------

/** Implementor. Knows how to draw a header, a line, and a footer. Not what they mean. */
export interface Renderer {
  header(title: string): string;
  line(label: string, value: string): string;
  footer(): string;
}

export class PdfRenderer implements Renderer {
  header(title: string): string {
    return `PDF :: ${title}`;
  }

  line(label: string, value: string): string {
    return `  ${label}: ${value}`;
  }

  footer(): string {
    return "PDF :: end";
  }
}

export class HtmlRenderer implements Renderer {
  header(title: string): string {
    return `<h1>${title}</h1>`;
  }

  line(label: string, value: string): string {
    return `<p>${label}: ${value}</p>`;
  }

  footer(): string {
    return "";
  }
}

/** Added later. No report class changes. */
export class CsvRenderer implements Renderer {
  header(title: string): string {
    return title;
  }

  line(label: string, value: string): string {
    return `${label},${value}`;
  }

  footer(): string {
    return "";
  }
}

/**
 * Abstraction. Knows what the report says, and asks the renderer to draw it.
 * The renderer is the bridge: swap it and the same report comes out in another format.
 */
export abstract class Report {
  constructor(protected readonly renderer: Renderer) {}

  protected abstract title(): string;
  protected abstract rows(): ReadonlyArray<readonly [string, string]>;

  print(): string {
    const parts = [this.renderer.header(this.title())];
    for (const [label, value] of this.rows()) {
      parts.push(this.renderer.line(label, value));
    }
    const footer = this.renderer.footer();
    if (footer) parts.push(footer);
    return parts.join("\n");
  }
}

export class SalarySlip extends Report {
  constructor(
    renderer: Renderer,
    private readonly employee: Employee,
  ) {
    super(renderer);
  }

  protected title(): string {
    return "Salary slip";
  }

  protected rows(): ReadonlyArray<readonly [string, string]> {
    return [
      ["Employee", this.employee.name],
      ["Net pay", `₹${this.employee.netPay}`],
    ];
  }
}

export class TaxSummary extends Report {
  constructor(
    renderer: Renderer,
    private readonly employee: Employee,
  ) {
    super(renderer);
  }

  protected title(): string {
    return "Tax summary";
  }

  protected rows(): ReadonlyArray<readonly [string, string]> {
    return [
      ["Employee", this.employee.name],
      ["Tax deducted", `₹${this.employee.tax}`],
    ];
  }
}

/** Added later. No renderer changes. */
export class AttendanceReport extends Report {
  constructor(
    renderer: Renderer,
    private readonly employee: Employee,
  ) {
    super(renderer);
  }

  protected title(): string {
    return "Attendance";
  }

  protected rows(): ReadonlyArray<readonly [string, string]> {
    return [
      ["Employee", this.employee.name],
      ["Days present", String(this.employee.daysPresent)],
    ];
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:bridge
// ---------------------------------------------------------------------------

if (require.main === module) {
  const asha: Employee = { name: "Asha", netPay: 80000, tax: 12000, daysPresent: 22 };

  console.log("=== Bridge: BAD (one branch per report × format) ===\n");
  console.log(badPrint("salary", "pdf", asha));
  console.log();
  console.log(badPrint("salary", "html", asha));
  console.log();
  console.log("2 reports × 2 formats = 4 branches. Attendance + CSV means 3 × 3 = 9.\n");

  console.log("=== Bridge: GOOD (reports and formats vary on their own) ===\n");

  const pdf = new PdfRenderer();
  const html = new HtmlRenderer();

  console.log("--- Same salary slip, two renderers ---");
  console.log(new SalarySlip(pdf, asha).print());
  console.log();
  console.log(new SalarySlip(html, asha).print());
  console.log();

  console.log("--- Same PDF renderer, a different report ---");
  console.log(new TaxSummary(pdf, asha).print());
  console.log();

  console.log("--- New format: CSV. SalarySlip was not edited ---");
  console.log(new SalarySlip(new CsvRenderer(), asha).print());
  console.log();

  console.log("--- New report: Attendance. The renderers were not edited ---");
  console.log(new AttendanceReport(pdf, asha).print());
  console.log();
  console.log(new AttendanceReport(html, asha).print());
  console.log();

  console.log("3 reports + 3 renderers = 6 classes, not 9 combinations.");
}
