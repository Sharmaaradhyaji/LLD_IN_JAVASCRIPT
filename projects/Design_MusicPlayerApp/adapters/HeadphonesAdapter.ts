/**
 * HeadphonesAdapter
 *
 * Pattern: Adapter
 *
 * Translates our playAudio(song) into the vendor's
 * playSoundViaJack(data: string).
 */
import { HeadphonesAPI } from "../external/HeadphonesAPI";
import { Song } from "../models/Song";
import { IAudioOutputDevice } from "./IAudioOutputDevice";

export class HeadphonesAdapter implements IAudioOutputDevice {
  constructor(private readonly headphonesApi: HeadphonesAPI) {}

  playAudio(song: Song): void {
    const payload = `${song.getTitle()} by ${song.getArtist()}`;
    this.headphonesApi.playSoundViaJack(payload);
  }
}
