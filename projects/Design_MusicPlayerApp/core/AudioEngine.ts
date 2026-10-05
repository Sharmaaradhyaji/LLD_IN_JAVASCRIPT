/**
 * AudioEngine — tracks what is playing and sends it to a device.
 *
 * It does not know which device it is talking to (any IAudioOutputDevice
 * works) and does not decide which song comes next (that's PlayStrategy).
 */
import { IAudioOutputDevice } from "../adapters/IAudioOutputDevice";
import { Song } from "../models/Song";

export class AudioEngine {
  private currentSong: Song | null = null;
  private paused = false;

  play(device: IAudioOutputDevice, song: Song): void {
    if (this.currentSong === song && this.paused) {
      console.log(`[AudioEngine] Resuming ${song.toString()}`);
    } else {
      console.log(`[AudioEngine] Playing ${song.toString()}`);
      this.currentSong = song;
    }
    this.paused = false;
    device.playAudio(song);
  }

  pause(song: Song): void {
    if (this.currentSong !== song) {
      throw new Error(`Cannot pause ${song.toString()} — it is not the current song.`);
    }
    this.paused = true;
    console.log(`[AudioEngine] Paused ${song.toString()}`);
  }

  getCurrentSong(): Song | null {
    return this.currentSong;
  }

  isPaused(): boolean {
    return this.paused;
  }
}
