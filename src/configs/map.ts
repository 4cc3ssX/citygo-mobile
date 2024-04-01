import {MapViewProps} from 'react-native-maps';

export const defaultMapProps: MapViewProps = {
  provider: 'google',
  showsTraffic: true,
  showsUserLocation: true,
  followsUserLocation: true,
  showsMyLocationButton: false,
  showsCompass: false,
  toolbarEnabled: false,
  moveOnMarkerPress: false,
  userLocationUpdateInterval: 500,
  userLocationFastestInterval: 1000,
};
