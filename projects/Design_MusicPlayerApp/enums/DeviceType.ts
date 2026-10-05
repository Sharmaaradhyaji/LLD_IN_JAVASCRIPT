/**
 * DeviceType — output devices the app can connect to.
 *
 * Adding a new device starts here: add a value, then a matching adapter
 * and one case in DeviceFactory.
 */
export enum DeviceType {
  BLUETOOTH = "BLUETOOTH",
  WIRED = "WIRED",
  HEADPHONES = "HEADPHONES",
}
