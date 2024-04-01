import {Feature, Point} from '@turf/helpers';

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {Storage} from '@helpers/storage';
import {IStop} from '@typescript/api/stops';

export interface IStopState {
  geojson: Feature<Point, IStop>[];
  stops: IStop[];
  setStops: (stops: IStop[]) => void;
  setGeoJSON: (geojson: Feature<Point, IStop>[]) => void;
}

export const useStopStore = create(
  persist<IStopState>(
    set => ({
      geojson: [],
      stops: [],
      setStops: (stops: IStop[]) =>
        set({
          stops,
        }),
      setGeoJSON: (geojson: Feature<Point, IStop>[]) =>
        set({
          geojson,
        }),
    }),
    {
      name: 'stop-storage',
      storage: createJSONStorage(() => Storage),
    },
  ),
);
