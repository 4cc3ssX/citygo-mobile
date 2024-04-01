import {Region} from 'react-native-maps';

import {displayName} from '../../app.json';

export class Constants {
  /**
   * App Name
   */
  public static readonly APP_NAME = displayName;

  /**
   * The height of the header
   */
  public static readonly HEADER_HEIGHT = 56;

  /*
   * Closest stop threshold in meters
   */
  public static readonly CLOSEST_STOP_THRESHOLD = 80;

  public static getDefaultError(name: string) {
    return `Unable to get ${name}.`;
  }

  public static getDefaultMapDelta(lat: number, lng: number): Region {
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0043,
      longitudeDelta: 0.0054,
    };
  }
}
