import analytics, {
  FirebaseAnalyticsTypes,
} from '@react-native-firebase/analytics';

import {getTrackingStatus} from 'react-native-tracking-transparency';

const LOG_TAG = '[ ANALYTICS ]';

export const logScreenView = async (
  params: FirebaseAnalyticsTypes.ScreenViewParameters,
) => {
  if (__DEV__) {
    console.info(LOG_TAG, params);
    return;
  }
  // TODO: add exceptional screens

  analytics().logScreenView(params);
};

export const logEvent = async (name: string, params: Record<string, any>) => {
  const trackingStatus = await getTrackingStatus();
  const isAvailable =
    trackingStatus === 'authorized' || trackingStatus === 'unavailable';

  if (isAvailable && __DEV__) {
    console.info(LOG_TAG, params);
    return;
  }

  if (isAvailable) {
    analytics().logEvent(name, params);
  }
};
