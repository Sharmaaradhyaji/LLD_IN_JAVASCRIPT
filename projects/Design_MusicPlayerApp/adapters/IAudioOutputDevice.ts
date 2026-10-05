/**
 * IAudioOutputDevice — the ONE interface our app uses for any output device.
 *
 * Pattern: Adapter (Target interface)
 *
 * AudioEngine only ever calls playAudio(song). It never sees Bluetooth,
 * cable, or jack APIs — each adapter translates this call for its vendor.
 */
import { Song } from "../models/Song";

export interface IAudioOutputDevice {
  playAudio(song: Song): void;
}
