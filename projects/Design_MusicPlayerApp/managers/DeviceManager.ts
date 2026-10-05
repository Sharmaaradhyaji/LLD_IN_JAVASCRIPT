/**
 * DeviceManager — SINGLETON
 *
 * Pattern: Singleton (uses Factory to build devices)
 *
 * Why Singleton:
 *   Audio can only go to ONE output device at a time. A single manager
 *   holds that current device so every playback call uses the same one.
 *
 * Why it uses DeviceFactory:
 *   The manager decides WHEN to switch devices; the factory decides HOW
 *   a device (adapter + vendor API) is built.
 */
import { IAudioOutputDevice } from "../adapters/IAudioOutputDevice";
import { DeviceType } from "../enums/DeviceType";
import { DeviceFactory } from "../factories/DeviceFactory";

export class DeviceManager {
  private static instance: DeviceManager | null = null;
  private currentDevice: IAudioOutputDevice | null = null;

  private constructor() {}

  static getInstance(): DeviceManager {
    if (!DeviceManager.instance) {
      DeviceManager.instance = new DeviceManager();
    }
    return DeviceManager.instance;
  }

  connect(deviceType: DeviceType): void {
    this.currentDevice = DeviceFactory.createDevice(deviceType);
    console.log(`[DeviceManager] Connected to ${deviceType}`);
  }

  getOutputDevice(): IAudioOutputDevice {
    if (!this.currentDevice) {
      throw new Error("No output device connected. Call connectDevice() first.");
    }
    return this.currentDevice;
  }

  hasOutputDevice(): boolean {
    return this.currentDevice !== null;
  }
}
