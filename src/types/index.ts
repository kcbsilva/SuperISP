/**
 * Represents a network device with its basic information.
 */
export interface NetworkDevice {
  /**
   * The IP address of the device.
   */
  ipAddress: string;
  /**
   * The MAC address of the device.
   */
  macAddress: string;
  /**
   * The hostname of the device. Can be user-defined name or scanned hostname.
   */
  hostname: string;
  /**
   * Optional flag to indicate if the device was added manually.
   */
  manual?: boolean;
}
