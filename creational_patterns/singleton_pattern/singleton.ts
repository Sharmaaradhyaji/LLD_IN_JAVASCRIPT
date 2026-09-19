/**
 * SINGLETON — Classic Logger (getInstance)
 * ========================================
 *
 * Definition:
 *   Only one Logger exists. getInstance() always returns that same object.
 *
 * Why:
 *   Shared log history / one place to configure logging.
 */

export class Logger {
  // Static property to store the single instance, and null initially to indicate no instance has been created yet
  private static instance: Logger | null = null;
  // Private property to store the logs
  private readonly logs: string[] = [];

  /**
   * Private constructor to prevent direct instantiation
   * Only the class itself can create an instance
   */
  private constructor() {
    console.log("[Logger] instance created (should happen once)");
  }

  /**
   * Static method to get the single instance
   * If no instance exists, create one and return it
   * If an instance exists, return it
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    const entry = `[${new Date().toISOString()}] ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  getLogs(): readonly string[] {
    return this.logs;
  }
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:singleton
// ---------------------------------------------------------------------------

if (require.main === module) {
  console.log("=== Singleton: Logger ===\n");

  const loggerA = Logger.getInstance();
  // Get the same instance again
  const loggerB = Logger.getInstance();
  // Check if both instances are the same instance
  console.log("Same instance?", loggerA === loggerB);

  loggerA.log("App started");
  // Log the message to the same logs array
  loggerB.log("User logged in"); // goes to the SAME logs array

  console.log("\nShared history:");
  for (const line of loggerA.getLogs()) {
    console.log(" -", line);
  }
}
