/**
 * WiredSpeakerAPI — THIRD-PARTY SDK (simulated).
 *
 * Different vendor, different method name. Wrapped by WiredSpeakerAdapter.
 */
export class WiredSpeakerAPI {
  playSoundViaCable(data: string): void {
    console.log(`  [WiredSpeakerAPI] Playing over cable → ${data}`);
  }
}
