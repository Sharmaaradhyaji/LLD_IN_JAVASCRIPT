/**
 * HeadphonesAPI — THIRD-PARTY SDK (simulated).
 *
 * Wrapped by HeadphonesAdapter.
 */
export class HeadphonesAPI {
  playSoundViaJack(data: string): void {
    console.log(`  [HeadphonesAPI] Playing through 3.5mm jack → ${data}`);
  }
}
