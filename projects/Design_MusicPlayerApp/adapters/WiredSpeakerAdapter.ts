/**
 * WiredSpeakerAdapter
 *
 * Pattern: Adapter
 *
 * Translates our playAudio(song) into the vendor's
 * playSoundViaCable(data: string).
 */
import { WiredSpeakerAPI } from "../external/WiredSpeakerAPI";
import { Song } from "../models/Song";
import { IAudioOutputDevice } from "./IAudioOutputDevice";

export class WiredSpeakerAdapter implements IAudioOutputDevice {
  constructor(private readonly wiredApi: WiredSpeakerAPI) {}

  playAudio(song: Song): void {
    const payload = `${song.getTitle()} by ${song.getArtist()}`;
    this.wiredApi.playSoundViaCable(payload);
  }
}
