import {displayName} from '../../app.json';

export class Constants {
  /**
   * App Name
   */
  public static readonly APP_NAME = displayName;

  /**
   * The height of the header
   */
  public static readonly HEADER_HEIGHT = 64;

  /**
   * The height of the map camera
   */
  public static readonly MAP_CAMERA_HEIGHT = 150;

  /*
   * Map radius in meters
   */
  public static readonly MAP_SCAN_RADIUS = 500;

  public static getDefaultError(name: string) {
    return `Unable to get ${name}.`;
  }
}
