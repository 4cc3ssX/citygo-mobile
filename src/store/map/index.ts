import {Region} from 'react-native-maps';

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {Storage} from '@helpers/storage';
import {ICoordinates} from '@typescript/api';

export interface IMapState {
  userLocation: ICoordinates | null;
  lastRegion: Region | null;
  setUserLocation: (at: ICoordinates) => void;
  setLastRegion: (region: Region) => void;
}

export const useMapStore = create(
  persist<IMapState>(
    set => ({
      userLocation: null,
      lastRegion: null,
      setUserLocation: (at: ICoordinates) => set({userLocation: at}),
      setLastRegion: (region: Region) => set({lastRegion: region}),
    }),
    {
      name: 'map-storage',
      storage: createJSONStorage(() => Storage),
    },
  ),
);
