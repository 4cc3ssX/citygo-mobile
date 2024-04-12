import {Platform} from 'react-native';

import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const LOG_TAG = '[ PERMISSION ]';

export const checkLocationPermission = async () => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const result = await request(permission);

  console.info(LOG_TAG, `Location permission ${result}!`);

  return result === RESULTS.GRANTED;
};
