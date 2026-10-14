/**
 * TEMPLATE METHOD — Employee Data Import
 * =======================================
 *
 * Definition:
 *   A base class defines the SKELETON of an algorithm (the fixed order of
 *   steps) in one method. Subclasses fill in only the steps that differ.
 *
 * Use-case specific:
 *   Only reach for Template Method when several variants run the SAME
 *   steps in the SAME order, and only some steps change between them.
 *
 * Problem it solves:
 *   Each importer (CSV / JSON / XML) copies the whole pipeline. Shared
 *   steps drift apart, and one importer quietly skips validation.
 */

export interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
}

/** Simulated files on disk — real code would read with fs.readFileSync. */
const FILES: Record<string, string> = {
  "employees.csv": "id,name,email\nE1,Asha,asha@acme.com\nE2,Rohit,not-an-email",
  "employees.json": JSON.stringify([
    { id: "E3", name: "Meera", email: "meera@acme.com" },
    { id: "", name: "Ghost", email: "ghost@acme.com" },
  ]),
  "employees.xml":
    '<employees><employee id="E4" name="Kabir" email="kabir@acme.com"/></employees>',
};

/** Simulated database table. */
const database: EmployeeRecord[] = [];

// ---------------------------------------------------------------------------
// BAD — every importer re-writes the whole pipeline
// ---------------------------------------------------------------------------

export class BadCsvImporter {
  import(path: string): void {
    console.log(`[CSV] Reading ${path}`);
    const lines = FILES[path].split("\n").slice(1);
    const records = lines.map((line) => {
      const [id, name, email] = line.split(",");
      return { id, name, email };
    });

    const valid = records.filter((r) => r.id && r.email.includes("@"));
    console.log(`[CSV] Saving ${valid.length} record(s)`);
    console.log(`[CSV] Done — ${records.length - valid.length} rejected\n`);
  }
}

export class BadJsonImporter {
  import(path: string): void {
    console.log(`[JSON] Reading ${path}`);
    const records: EmployeeRecord[] = JSON.parse(FILES[path]);

    // Validation was copy-pasted into the CSV importer but forgotten here.
    console.log(`[JSON] Saving ${records.length} record(s)`);
    console.log("[JSON] Done\n"); // also a different summary format
  }
}

// ---------------------------------------------------------------------------
// GOOD — Template Method
// ---------------------------------------------------------------------------

/**
 * Abstract class — owns the algorithm skeleton.
 *
 * importFile() is the TEMPLATE METHOD: it fixes the order of steps.
 * Subclasses implement the abstract steps and may override the hook.
 */
export abstract class DataImporter {
  /** The template method. Subclasses must not override it — the step order is the contract. */
  importFile(path: string): void {
    console.log(`[${this.formatName()}] Importing ${path}`);

    const raw = this.readFile(path);
    const records = this.parse(raw);
    const valid = this.validate(records);
    this.save(valid);
    this.printSummary(records.length, valid.length);

    if (this.shouldNotifyHR()) {
      console.log(`  [${this.formatName()}] Notified HR about the import`);
    }
    console.log();
  }

  // ----- Steps every subclass MUST provide (they differ per format) -----

  protected abstract formatName(): string;
  protected abstract parse(raw: string): EmployeeRecord[];

  // ----- Steps shared by everyone (written once) -----

  protected readFile(path: string): string {
    const contents = FILES[path];
    if (contents === undefined) {
      throw new Error(`File not found: ${path}`);
    }
    return contents;
  }

  protected validate(records: EmployeeRecord[]): EmployeeRecord[] {
    return records.filter((record) => {
      const ok = record.id.trim() !== "" && record.email.includes("@");
      if (!ok) {
        console.log(`  [${this.formatName()}] Rejected invalid row: ${JSON.stringify(record)}`);
      }
      return ok;
    });
  }

  protected save(records: EmployeeRecord[]): void {
    database.push(...records);
    console.log(`  [${this.formatName()}] Saved ${records.length} record(s) to database`);
  }

  protected printSummary(total: number, saved: number): void {
    console.log(`  [${this.formatName()}] Summary: ${saved}/${total} imported, ${total - saved} rejected`);
  }

  // ----- Hook: optional step with a default; subclasses MAY override -----

  protected shouldNotifyHR(): boolean {
    return false;
  }
}

/** Concrete class — only knows how to parse CSV. */
export class CsvImporter extends DataImporter {
  protected formatName(): string {
    return "CSV";
  }

  protected parse(raw: string): EmployeeRecord[] {
    return raw
      .split("\n")
      .slice(1)
      .map((line) => {
        const [id, name, email] = line.split(",");
        return { id, name, email };
      });
  }
}

/** Concrete class — only knows how to parse JSON. Uses the hook. */
export class JsonImporter extends DataImporter {
  protected formatName(): string {
    return "JSON";
  }

  protected parse(raw: string): EmployeeRecord[] {
    return JSON.parse(raw) as EmployeeRecord[];
  }

  protected shouldNotifyHR(): boolean {
    return true;
  }
}

/** New format added later — the pipeline is reused untouched. */
export class XmlImporter extends DataImporter {
  protected formatName(): string {
    return "XML";
  }

  protected parse(raw: string): EmployeeRecord[] {
    const matches = raw.matchAll(/id="([^"]*)" name="([^"]*)" email="([^"]*)"/g);
    return [...matches].map(([, id, name, email]) => ({ id, name, email }));
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:template
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Template Method: BAD (each importer copies the pipeline) ===\n");
  new BadCsvImporter().import("employees.csv");
  new BadJsonImporter().import("employees.json");
  console.log("The JSON importer saved a record with an empty id — validation was never copied.\n");

  console.log("=== Template Method: GOOD (one skeleton, steps filled in) ===\n");
  const importers: DataImporter[] = [new CsvImporter(), new JsonImporter(), new XmlImporter()];
  const files = ["employees.csv", "employees.json", "employees.xml"];

  importers.forEach((importer, i) => importer.importFile(files[i]));

  console.log(`Database now holds ${database.length} valid employee(s):`);
  for (const employee of database) {
    console.log(`  • ${employee.id} ${employee.name} <${employee.email}>`);
  }
}
