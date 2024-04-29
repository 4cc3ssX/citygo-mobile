import {createContext, useContext} from 'react';

import {GeoCoordinates} from 'react-native-geolocation-service';
import {Region} from 'react-native-maps';

export interface IAppContext {
  isOnline: boolean;
  isLocationEnabled: boolean;
  requestPermissions: () => Promise<void>;
  isLocating: boolean;
  locatePosition: () => Promise<GeoCoordinates & {region: Region}>;
}

export const AppContext = createContext<IAppContext>({
  isOnline: true,
  isLocationEnabled: false,
  requestPermissions: async () => {},

  isLocating: false,
  locatePosition: async () => {
    throw new Error('locatePosition not implemented.');
  },
});

export const useAppContext = () => useContext<IAppContext>(AppContext);
