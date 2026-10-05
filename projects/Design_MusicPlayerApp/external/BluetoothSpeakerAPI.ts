/**
 * BluetoothSpeakerAPI — THIRD-PARTY SDK (simulated).
 *
 * We do not own this code and do not implement Bluetooth ourselves.
 * Its method name and input format do not match our IAudioOutputDevice,
 * which is why BluetoothSpeakerAdapter exists.
 */
export class BluetoothSpeakerAPI {
  playSoundViaBluetooth(data: string): void {
    console.log(`  [BluetoothSpeakerAPI] Streaming over Bluetooth → ${data}`);
  }
}
