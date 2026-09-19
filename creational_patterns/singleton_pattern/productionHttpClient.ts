/**
 * SINGLETON — Production-style HttpClient (module export)
 * ========================================================
 *
 * Common pattern in React / RN / Node apps:
 *   export class HttpClient { ... shared refresh state ... }
 *   export const httpClient = new HttpClient();
 *
 * Why Singleton here?
 *   isRefreshing + failedQueue MUST be shared across all API calls.
 *   Two clients = two refresh races = messy auth.
 *
 * This demo fakes HTTP (no axios) so the lesson stays runnable.
 *
 * This is a real production code example and edge case scenarios I have seen in production code. Try to understand the code and the edge case scenarios.
 */

type QueuedCall = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

export class HttpClient {
  private accessToken = "token-v1";
  private isRefreshing = false;
  // Queue of calls that need to be retried when the token is refreshed
  private failedQueue: QueuedCall[] = [];
  // Count of how many times the access token has been refreshed
  private refreshCount = 0;

  /** This is the method that will be called to get the data from the API. */
  async get(path: string, clientLabel: string): Promise<string> {
    console.log(`[${clientLabel}] GET ${path} with ${this.accessToken}`);

    if (this.accessToken === "token-v1") {
      console.log(`[${clientLabel}] → 401 Unauthorized`);
      await this.handleUnauthorized();
      console.log(
        `[${clientLabel}] retry GET ${path} with ${this.accessToken}`,
      );
    }

    return `OK ${path} (${this.accessToken})`;
  }

  private async handleUnauthorized(): Promise<void> {
    // If the token is being refreshed, add the call to the queue
    if (this.isRefreshing) {
      // Wait for the in-flight refresh (shared queue — needs ONE client)
      return new Promise<void>((resolve, reject) => {
        this.failedQueue.push({
          resolve: () => resolve(),
          reject,
        });
      });
    }

    // If the token is not being refreshed, start the refresh process
    this.isRefreshing = true;
    try {
      await this.refreshAccessToken();
      // Resolve all the calls in the queue
      this.failedQueue.forEach((q) => q.resolve(this.accessToken));
      this.failedQueue = [];
    } catch (err) {
      this.failedQueue.forEach((q) => q.reject(err));
      this.failedQueue = [];
      throw err;
    } finally {
      this.isRefreshing = false;
    }
  }

  /** This is the method that will be called to refresh the access token. */
  private async refreshAccessToken(): Promise<void> {
    // Increment the refresh count
    this.refreshCount += 1;
    console.log(`  ★ refreshAccessToken() called (count=${this.refreshCount})`);
    await delay(50);
    this.accessToken = "token-v2";
    console.log(`  ★ new token = ${this.accessToken}`);
  }

  getRefreshCount(): number {
    return this.refreshCount;
  }
}

/** MODULE SINGLETON — same idea as: export const httpClient = new HttpClient(); */
export const httpClient = new HttpClient();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Demo — run with: npm run demo:singleton-http
// ---------------------------------------------------------------------------

async function demoSharedClient(): Promise<void> {
  console.log("=== GOOD: one shared httpClient (module singleton) ===\n");

  // Two screens import the SAME instance (here we just reuse httpClient)
  // This is the good way to use the singleton pattern
  const results = await Promise.all([
    httpClient.get("/flights", "ScreenA"),
    httpClient.get("/bookings", "ScreenB"),
  ]);

  console.log("\nResults:", results);
  console.log(
    "Refresh ran how many times?",
    httpClient.getRefreshCount(),
    "(should be 1)\n",
  );
}

async function demoTwoClients(): Promise<void> {
  console.log("=== BAD: new HttpClient() per screen ===\n");

  const screenA = new HttpClient();
  const screenB = new HttpClient();

  await Promise.all([
    screenA.get("/flights", "ScreenA-client"),
    screenB.get("/bookings", "ScreenB-client"),
  ]);

  console.log(
    "\nRefresh counts: A=",
    screenA.getRefreshCount(),
    "B=",
    screenB.getRefreshCount(),
    "(both refreshed — race / duplicate work)",
  );
}

if (require.main === module) {
  (async () => {
    await demoSharedClient();
    await demoTwoClients();
  })();
}
