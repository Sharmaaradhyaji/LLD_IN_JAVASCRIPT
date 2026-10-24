/**
 * PROXY — Company Document Portal
 * ================================
 *
 * Definition:
 *   A stand-in object with the SAME interface as the real object.
 *   The client talks to the proxy; the proxy decides when, whether,
 *   and how to forward the call.
 *
 * Use-case specific:
 *   Only reach for Proxy when you need to control ACCESS to an object
 *   without changing the object or the code that uses it.
 *
 * Types in this file:
 *   Virtual    — delay an expensive load until first use
 *   Protection — block calls the current user is not allowed to make
 *   Caching    — reuse an expensive result
 *   Remote     — a local object that forwards calls to another machine
 */

export type Role = "GUEST" | "EMPLOYEE" | "ADMIN";

/** The interface both the real document and every proxy implement. */
export interface Document {
  getTitle(): string;
  view(): string;
  edit(newContent: string): void;
}

// ---------------------------------------------------------------------------
// Real subject — expensive to create, no idea who is calling
// ---------------------------------------------------------------------------

export class RealDocument implements Document {
  private content: string;

  constructor(
    private readonly title: string,
    path: string,
  ) {
    // Imagine reading a multi-megabyte file from disk or cloud storage.
    console.log(`  [Disk] Loading "${title}" from ${path}`);
    this.content = `Contents of ${title}`;
  }

  getTitle(): string {
    return this.title;
  }

  view(): string {
    return this.content;
  }

  edit(newContent: string): void {
    console.log(`  [Disk] Saving "${this.title}"`);
    this.content = newContent;
  }
}

/** Document service that lives on another server. */
export class RemoteDocumentService {
  private readonly store = new Map<string, string>([
    ["policy", "Leave policy v3 — 18 days a year."],
  ]);

  fetch(id: string): string {
    console.log(`  [Network] GET /documents/${id}`);
    const content = this.store.get(id);
    if (content === undefined) {
      throw new Error(`Document not found: ${id}`);
    }
    return content;
  }

  update(id: string, content: string): void {
    console.log(`  [Network] PUT /documents/${id}`);
    this.store.set(id, content);
  }
}

// ---------------------------------------------------------------------------
// BAD — the page loads every file, and permission checks are copy-pasted
// ---------------------------------------------------------------------------

export function badOpenLibrary(): RealDocument[] {
  console.log("Rendering the documents page (user has not opened anything yet)");
  return [
    new RealDocument("Handbook", "/docs/handbook.pdf"),
    new RealDocument("Payroll", "/docs/payroll.xlsx"),
    new RealDocument("Policy", "/docs/policy.pdf"),
  ];
}

export function badEdit(document: RealDocument, role: Role, content: string): void {
  if (role !== "ADMIN") {
    console.log(`  [Page A] ${role} blocked from editing "${document.getTitle()}"`);
    return;
  }
  document.edit(content);
}

// ---------------------------------------------------------------------------
// GOOD — one proxy class per kind of control
// ---------------------------------------------------------------------------

/**
 * Virtual proxy — same interface, but the heavy object is created
 * on the first view() or edit(), not when the list is rendered.
 * getTitle() stays cheap so a list of 1,000 docs costs nothing.
 */
export class VirtualDocumentProxy implements Document {
  private real: RealDocument | null = null;

  constructor(
    private readonly title: string,
    private readonly path: string,
  ) {}

  getTitle(): string {
    return this.title;
  }

  view(): string {
    return this.load().view();
  }

  edit(newContent: string): void {
    this.load().edit(newContent);
  }

  private load(): RealDocument {
    if (!this.real) {
      console.log(`  [VirtualProxy] First use of "${this.title}" — loading now`);
      this.real = new RealDocument(this.title, this.path);
    }
    return this.real;
  }
}

/**
 * Protection proxy — the document has no permission logic.
 * This wrapper refuses calls the role is not allowed to make.
 */
export class ProtectionDocumentProxy implements Document {
  constructor(
    private readonly document: Document,
    private readonly role: Role,
  ) {}

  getTitle(): string {
    return this.document.getTitle();
  }

  view(): string {
    if (this.role === "GUEST") {
      throw new Error("Guests cannot view documents.");
    }
    return this.document.view();
  }

  edit(newContent: string): void {
    if (this.role !== "ADMIN") {
      throw new Error(`${this.role} cannot edit documents. Admins only.`);
    }
    this.document.edit(newContent);
  }
}

/**
 * Caching proxy — view() hits the wrapped document once,
 * then serves the saved string. edit() drops the cache.
 */
export class CachingDocumentProxy implements Document {
  private cachedView: string | null = null;

  constructor(private readonly document: Document) {}

  getTitle(): string {
    return this.document.getTitle();
  }

  view(): string {
    if (this.cachedView !== null) {
      console.log("  [CachingProxy] Cache hit — no second fetch");
      return this.cachedView;
    }
    console.log("  [CachingProxy] Cache miss");
    this.cachedView = this.document.view();
    return this.cachedView;
  }

  edit(newContent: string): void {
    this.document.edit(newContent);
    this.cachedView = null;
  }
}

/**
 * Remote proxy — looks like a local Document.
 * Every call is actually a request to RemoteDocumentService.
 */
export class RemoteDocumentProxy implements Document {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly service: RemoteDocumentService,
  ) {}

  getTitle(): string {
    return this.title;
  }

  view(): string {
    return this.service.fetch(this.id);
  }

  edit(newContent: string): void {
    this.service.update(this.id, newContent);
  }
}

function tryCall(label: string, action: () => void): void {
  try {
    action();
    console.log(`  ${label}: allowed`);
  } catch (error) {
    console.log(`  ${label}: ${(error as Error).message}`);
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:proxy
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Proxy: BAD (load everything, check permissions by hand) ===\n");
  const loaded = badOpenLibrary();
  console.log(`User then opens only "${loaded[0].getTitle()}". The other two were loaded for nothing.\n`);
  badEdit(loaded[0], "EMPLOYEE", "changed");
  console.log("A second screen forgets the check and calls edit() directly:");
  loaded[0].edit("changed from the screen that forgot the check");

  console.log("\n=== 1) Virtual proxy — titles are free, content loads on open ===\n");
  const library: Document[] = [
    new VirtualDocumentProxy("Handbook", "/docs/handbook.pdf"),
    new VirtualDocumentProxy("Payroll", "/docs/payroll.xlsx"),
    new VirtualDocumentProxy("Policy", "/docs/policy.pdf"),
  ];
  console.log("Page rendered:", library.map((doc) => doc.getTitle()).join(", "));
  console.log("User opens Handbook:");
  console.log(`  → ${library[0].view()}`);
  console.log("User opens Handbook again (already loaded, no second disk read):");
  console.log(`  → ${library[0].view()}`);

  console.log("\n=== 2) Protection proxy — the check lives in one place ===\n");
  const handbook = new RealDocument("Handbook", "/docs/handbook.pdf");
  const guestView = new ProtectionDocumentProxy(handbook, "GUEST");
  const employeeView = new ProtectionDocumentProxy(handbook, "EMPLOYEE");
  const adminView = new ProtectionDocumentProxy(handbook, "ADMIN");

  tryCall("Guest view", () => console.log(`  → ${guestView.view()}`));
  tryCall("Employee view", () => console.log(`  → ${employeeView.view()}`));
  tryCall("Employee edit", () => employeeView.edit("new handbook"));
  tryCall("Admin edit", () => adminView.edit("Handbook v2"));

  console.log("\n=== 3) Caching proxy — second view skips the expensive call ===\n");
  const service = new RemoteDocumentService();
  const cached = new CachingDocumentProxy(new RemoteDocumentProxy("policy", "Policy", service));
  console.log(`  → ${cached.view()}`);
  console.log(`  → ${cached.view()}`);

  console.log("\n=== 4) Remote proxy — client code looks local, calls go over the network ===\n");
  const policy: Document = new RemoteDocumentProxy("policy", "Policy", service);
  console.log(`Client calls policy.view() → "${policy.view()}"`);
  policy.edit("Leave policy v4 — 20 days a year.");
  console.log(`Client calls policy.view() → "${policy.view()}"`);

  console.log("\n=== Stacked — protection + cache + remote, one interface ===\n");
  const portal: Document = new ProtectionDocumentProxy(
    new CachingDocumentProxy(new RemoteDocumentProxy("policy", "Policy", service)),
    "EMPLOYEE",
  );
  console.log(`Employee opens Policy → "${portal.view()}"`);
  console.log("Employee opens Policy again:");
  console.log(`  → "${portal.view()}"`);
  tryCall("Employee edit through the stack", () => portal.edit("nope"));
}
