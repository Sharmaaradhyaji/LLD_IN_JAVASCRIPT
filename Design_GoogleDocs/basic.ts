/**
 * BASIC IMPLEMENTATION — "Google Docs"
 * ============================================================
 *
 * This file intentionally violates SOLID to show WHY we refactor.
 */

// ---------------------------------------------------------------------------
// Naive DocumentEditor — everything lives in one place
// ---------------------------------------------------------------------------

export class DocumentEditor {
  /**
   * We store everything as strings to keep order.
   * Convention: "TEXT:hello" or "IMAGE:/path/to/cat.png"
   */
  private elements: string[] = [];

  /** Cached render output — avoids re-rendering on every read. */
  private cachedRender: string | null = null;

  addText(text: string): void {
    this.elements.push(`TEXT:${text}`);
    this.cachedRender = null; // invalidate cache when content changes
  }

  addImage(path: string): void {
    this.elements.push(`IMAGE:${path}`);
    this.cachedRender = null;
  }

  /**
   * Rendering logic is embedded inside the editor.
   * To add VIDEO we must edit THIS method (OCP violation).
   */
  renderDocument(): string {
    if (this.cachedRender !== null) {
      return this.cachedRender;
    }

    const lines: string[] = [];
    for (const element of this.elements) {
      if (element.startsWith("TEXT:")) {
        lines.push(element.slice("TEXT:".length));
      } else if (element.startsWith("IMAGE:")) {
        lines.push(`[Image: ${element.slice("IMAGE:".length)}]`);
      } else {
        lines.push(`[Unknown: ${element}]`);
      }
    }

    this.cachedRender = lines.join("\n");
    return this.cachedRender;
  }

  /**
   * Persistence is also embedded — always writes to a file path.
   * Cannot plug in DB, cloud, or in-memory storage without rewriting this class.
   */
  saveToFile(filePath: string): void {
    const content = this.renderDocument();
    // In a real app we'd use fs.writeFileSync; here we simulate with console.
    console.log(`[Basic] Saving to file "${filePath}":\n${content}`);
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npx tsx Design_GoogleDocs/basic.ts
// ---------------------------------------------------------------------------

if (require.main === module) {
  const editor = new DocumentEditor();
  editor.addText("Hello, Google Docs LLD!");
  editor.addImage("/assets/diagram.png");
  editor.addText("End of document.");

  console.log("--- Rendered output ---");
  console.log(editor.renderDocument());

  console.log("\n--- Save ---");
  editor.saveToFile("document.txt");
}
