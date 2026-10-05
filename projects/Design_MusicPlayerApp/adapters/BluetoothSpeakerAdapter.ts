/**
 * BluetoothSpeakerAdapter
 *
 * Pattern: Adapter
 *
 * Translates our playAudio(song) into the vendor's
 * playSoundViaBluetooth(data: string).
 */
import { BluetoothSpeakerAPI } from "../external/BluetoothSpeakerAPI";
import { Song } from "../models/Song";
import { IAudioOutputDevice } from "./IAudioOutputDevice";

export class BluetoothSpeakerAdapter implements IAudioOutputDevice {
  constructor(private readonly bluetoothApi: BluetoothSpeakerAPI) {}

  playAudio(song: Song): void {
    const payload = `${song.getTitle()} by ${song.getArtist()}`;
    this.bluetoothApi.playSoundViaBluetooth(payload);
  }
}
