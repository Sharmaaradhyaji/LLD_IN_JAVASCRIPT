/**
 * IMPROVED IMPLEMENTATION — SOLID "Google Docs" Design
 * ======================================================
 *
 * Each class has ONE job. New element types and storage backends
 * can be added without modifying existing code.
 *
 * Please visit docs and diagrams for more understanding via UML.
 */

// ===========================================================================
// 1. DocumentElement hierarchy — OCP + LSP
// ===========================================================================

/** Base contract: every block in the document knows how to render itself. This will help us in adding any number or types of elements*/
/** We add a base class which will be responsible for all element shapes and follows OCP and LSP */
export abstract class DocumentElement {
  abstract render(): string;
}

export class TextElement extends DocumentElement {
  constructor(private readonly text: string) {
    super();
  }

  render(): string {
    return this.text;
  }
}

export class ImageElement extends DocumentElement {
  constructor(private readonly path: string) {
    super();
  }

  render(): string {
    // In production we will add some service here for rendering images or videos, currently just path for learning.
    return `[Image: ${this.path}]`;
  }
}

/**
 * Example of OCP in action: VideoElement added WITHOUT touching
 * Document, DocumentRenderer, or DocumentEditor.
 */
export class VideoElement extends DocumentElement {
  constructor(
    private readonly path: string,
    private readonly durationSec: number,
  ) {
    super();
  }

  render(): string {
    return `[Video: ${this.path} (${this.durationSec}s)]`;
  }
}

// ===========================================================================
// 2. Document — SRP: pure data model, no render/save logic
// ===========================================================================

export class Document {
  private readonly elements: DocumentElement[] = [];

  addElement(element: DocumentElement): void {
    this.elements.push(element);
  }

  getElements(): readonly DocumentElement[] {
    return this.elements;
  }
}

// ===========================================================================
// 3. DocumentRenderer — SRP: only responsible for producing output
// ===========================================================================

export class DocumentRenderer {
  constructor(private readonly document: Document) {}

  render(): string {
    return this.document
      .getElements()
      .map((element) => element.render())
      .join("\n");
  }
}

// ===========================================================================
// 4. Persistence — DIP + OCP: storage is pluggable
// ===========================================================================

/**
 * Persistence abstraction (Strategy pattern).
 *
 * DocumentEditor does NOT care whether data goes to disk, a database,
 * or an in-memory buffer — it only calls save().
 */
export interface Persistence {
  save(data: string): void;
}

/** Saves rendered document text to a file (simulated for demo). */
export class FileStorage implements Persistence {
  constructor(private readonly filePath: string) {}

  save(data: string): void {
    console.log(`[FileStorage] Writing to "${this.filePath}":\n${data}`);
    // Real implementation: fs.writeFileSync(this.filePath, data, 'utf-8'); or any production if you want to follow.
  }
}

/**
 * Database storage — same interface, different backend.
 * Swap FileStorage → DBStorage in DocumentEditor with zero editor changes.
 */
export class DBStorage implements Persistence {
  constructor(
    // Dont fear this, this is how we generally connect to database in production, not much important than concept.
    private readonly connectionString: string,
    private readonly tableName: string,
  ) {}

  save(data: string): void {
    console.log(
      `[DBStorage] INSERT INTO ${this.tableName} @ ${this.connectionString}`,
    );
    console.log(`  payload length: ${data.length} chars`);
    // Real implementation: db.query('INSERT INTO documents (body) VALUES (?)', [data]);
  }
}

/** Useful for unit tests — no I/O side effects. Skippable.*/
export class InMemoryStorage implements Persistence {
  public lastSaved: string | null = null;

  save(data: string): void {
    this.lastSaved = data;
    console.log(`[InMemoryStorage] Saved ${data.length} chars (in memory)`);
  }
}

// ===========================================================================
// 5. DocumentEditor — SRP + DIP: orchestrates, does not implement details
// ===========================================================================

export class DocumentEditor {
  private readonly document: Document;
  private readonly renderer: DocumentRenderer;

  /**
   * @param storage Injected persistence strategy (DIP).
   *                Pass FileStorage, DBStorage, or InMemoryStorage.
   */
  constructor(private readonly storage: Persistence) {
    this.document = new Document();
    this.renderer = new DocumentRenderer(this.document);
  }

  /** Convenience helpers — delegate to proper element types. */
  addText(text: string): void {
    this.document.addElement(new TextElement(text));
  }

  addImage(path: string): void {
    this.document.addElement(new ImageElement(path));
  }

  addVideo(path: string, durationSec: number): void {
    this.document.addElement(new VideoElement(path, durationSec));
  }

  renderDocument(): string {
    return this.renderer.render();
  }

  saveDocument(): void {
    const rendered = this.renderDocument();
    this.storage.save(rendered);
  }

  /** Exposed for testing / introspection in demos. */
  getDocument(): Document {
    return this.document;
  }
}

// ===========================================================================
// Demo — run with: npx tsx Design_GoogleDocs/improved.ts
// ===========================================================================

if (require.main === module) {
  console.log("=== File storage ===");
  const fileEditor = new DocumentEditor(new FileStorage("document.txt"));
  fileEditor.addText("Hello, SOLID Google Docs!");
  fileEditor.addImage("/assets/architecture.png");
  fileEditor.addVideo("/assets/walkthrough.mp4", 120);
  console.log(fileEditor.renderDocument());
  fileEditor.saveDocument();

  console.log("\n=== DB storage (same editor, different backend) ===");
  const dbEditor = new DocumentEditor(
    new DBStorage("postgres://localhost:5432/docs", "documents"),
  );
  dbEditor.addText("Persisted to database instead of file.");
  dbEditor.saveDocument();

  // Can skip this part
  console.log("\n=== In-memory storage (great for tests) ===");
  const memoryStorage = new InMemoryStorage();
  const testEditor = new DocumentEditor(memoryStorage);
  testEditor.addText("Test document");
  testEditor.saveDocument();
  console.log("Last saved:", memoryStorage.lastSaved);
}
