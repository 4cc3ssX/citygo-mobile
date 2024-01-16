import {Platform} from 'react-native';

import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const checkLocationPermission = async () => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const result = await request(permission);

  return result === RESULTS.GRANTED;
};
