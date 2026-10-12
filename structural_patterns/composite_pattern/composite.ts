/**
 * COMPOSITE — File Explorer
 * ==========================
 *
 * Definition:
 *   Compose objects into TREE structures and let clients treat a single
 *   object (File) and a group of objects (Folder) the same way.
 *
 * Use-case specific:
 *   Only reach for Composite when your data is a part–whole hierarchy
 *   (a tree) and you want to run the same operation on a leaf or a whole
 *   subtree with one call.
 *
 * Problem it solves:
 *   Without it, every operation (size, print, count) needs its own
 *   instanceof checks and its own hand-written recursion.
 */

// ---------------------------------------------------------------------------
// BAD — client code must know the difference between files and folders
// ---------------------------------------------------------------------------

export class BadFile {
  constructor(
    public readonly name: string,
    public readonly sizeKb: number,
  ) {}
}

export class BadFolder {
  public readonly files: BadFile[] = [];
  public readonly folders: BadFolder[] = [];

  constructor(public readonly name: string) {}
}

/** Operation #1 — branches on type and recurses by hand. */
export function badTotalSize(folder: BadFolder): number {
  let total = 0;
  for (const file of folder.files) {
    total += file.sizeKb;
  }
  for (const sub of folder.folders) {
    total += badTotalSize(sub);
  }
  return total;
}

/** Operation #2 — the SAME traversal, written again. */
export function badCountFiles(folder: BadFolder): number {
  let count = folder.files.length;
  for (const sub of folder.folders) {
    count += badCountFiles(sub);
  }
  return count;
}

/** Operation #3 — and again. */
export function badPrint(item: BadFile | BadFolder, indent = ""): void {
  if (item instanceof BadFile) {
    console.log(`${indent}📄 ${item.name}`);
  } else {
    console.log(`${indent}📁 ${item.name}/`);
    for (const sub of item.folders) badPrint(sub, indent + "  ");
    for (const file of item.files) badPrint(file, indent + "  ");
  }
  // A new item type (e.g. Shortcut) means editing all three functions above.
}

// ---------------------------------------------------------------------------
// GOOD — Composite
// ---------------------------------------------------------------------------

/**
 * Component — the ONE interface every node in the tree shares.
 * Client code only ever talks to FileSystemItem.
 */
export interface FileSystemItem {
  getName(): string;
  getSizeKb(): number;
  countFiles(): number;
  display(indent?: string): void;
}

/** Leaf — a single file. Has no children. */
export class File implements FileSystemItem {
  constructor(
    private readonly name: string,
    private readonly sizeKb: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getSizeKb(): number {
    return this.sizeKb;
  }

  countFiles(): number {
    return 1;
  }

  display(indent = ""): void {
    console.log(`${indent}📄 ${this.name} (${this.sizeKb} KB)`);
  }
}

/**
 * Composite — a folder. Holds children that are themselves FileSystemItems
 * (files OR folders), and answers every operation by asking its children.
 */
export class Folder implements FileSystemItem {
  private readonly children: FileSystemItem[] = [];

  constructor(private readonly name: string) {}

  add(item: FileSystemItem): this {
    this.children.push(item);
    return this;
  }

  remove(item: FileSystemItem): void {
    const index = this.children.indexOf(item);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getChildren(): readonly FileSystemItem[] {
    return this.children;
  }

  getName(): string {
    return this.name;
  }

  getSizeKb(): number {
    return this.children.reduce((sum, child) => sum + child.getSizeKb(), 0);
  }

  countFiles(): number {
    return this.children.reduce((sum, child) => sum + child.countFiles(), 0);
  }

  display(indent = ""): void {
    console.log(`${indent}📁 ${this.name}/ (${this.getSizeKb()} KB)`);
    for (const child of this.children) {
      child.display(indent + "  ");
    }
  }
}

/**
 * New leaf type added later — Folder, File, and all client code are untouched.
 * A shortcut points at another item but takes almost no space itself.
 */
export class Shortcut implements FileSystemItem {
  constructor(
    private readonly name: string,
    private readonly target: FileSystemItem,
  ) {}

  getName(): string {
    return this.name;
  }

  getSizeKb(): number {
    return 1;
  }

  countFiles(): number {
    return 1;
  }

  display(indent = ""): void {
    console.log(`${indent}🔗 ${this.name} → ${this.target.getName()} (1 KB)`);
  }
}

/** Client — works on ANY FileSystemItem: a single file or a whole tree. */
export function printReport(item: FileSystemItem): void {
  console.log(
    `"${item.getName()}" → ${item.getSizeKb()} KB across ${item.countFiles()} file(s)`,
  );
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:composite
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Composite: BAD (type checks + repeated recursion) ===\n");

  const badRoot = new BadFolder("Projects");
  badRoot.files.push(new BadFile("resume.pdf", 120));
  const badLld = new BadFolder("LLD");
  badLld.files.push(new BadFile("notes.md", 8));
  badRoot.folders.push(badLld);

  badPrint(badRoot);
  console.log(`Total: ${badTotalSize(badRoot)} KB, files: ${badCountFiles(badRoot)}`);
  console.log("Three operations → three hand-written traversals.\n");

  console.log("=== Composite: GOOD (one interface for files and folders) ===\n");

  const diagrams = new Folder("diagrams")
    .add(new File("uml.png", 450))
    .add(new File("flow.png", 300));

  const lld = new Folder("LLD").add(new File("notes.md", 8)).add(diagrams);

  const goaPhoto = new File("goa.jpg", 2048);
  const photos = new Folder("photos").add(goaPhoto);

  const root = new Folder("Projects")
    .add(new File("resume.pdf", 120))
    .add(lld)
    .add(photos);

  root.display();

  console.log("\n--- Same call works on a file, a subfolder, or the whole tree ---");
  printReport(goaPhoto);
  printReport(diagrams);
  printReport(root);

  console.log("\n--- Add a new item type (Shortcut) without editing Folder ---");
  lld.add(new Shortcut("goa-shortcut", goaPhoto));
  lld.display();
  printReport(root);

  console.log("\n--- Remove a whole subtree in one call ---");
  root.remove(photos);
  printReport(root);
}
