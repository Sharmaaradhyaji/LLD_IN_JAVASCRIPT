/**
 * DeviceFactory
 *
 * Pattern: Factory (Simple Factory)
 *
 * Why:
 *   Creating a device means picking the right adapter AND the right
 *   third-party API to wrap. That wiring lives here, in one place,
 *   so DeviceManager only says "give me a BLUETOOTH device".
 */
import { BluetoothSpeakerAdapter } from "../adapters/BluetoothSpeakerAdapter";
import { HeadphonesAdapter } from "../adapters/HeadphonesAdapter";
import { IAudioOutputDevice } from "../adapters/IAudioOutputDevice";
import { WiredSpeakerAdapter } from "../adapters/WiredSpeakerAdapter";
import { DeviceType } from "../enums/DeviceType";
import { BluetoothSpeakerAPI } from "../external/BluetoothSpeakerAPI";
import { HeadphonesAPI } from "../external/HeadphonesAPI";
import { WiredSpeakerAPI } from "../external/WiredSpeakerAPI";

export class DeviceFactory {
  static createDevice(deviceType: DeviceType): IAudioOutputDevice {
    switch (deviceType) {
      case DeviceType.BLUETOOTH:
        return new BluetoothSpeakerAdapter(new BluetoothSpeakerAPI());
      case DeviceType.WIRED:
        return new WiredSpeakerAdapter(new WiredSpeakerAPI());
      case DeviceType.HEADPHONES:
        return new HeadphonesAdapter(new HeadphonesAPI());
      default: {
        const unknown: never = deviceType;
        throw new Error(`Unsupported device type: ${unknown}`);
      }
    }
  }
}
