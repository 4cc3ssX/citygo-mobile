import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {Storage} from '@helpers/storage';
import {IRecentRoute} from '@store/types';

export interface IRouteState {
  recentRoutes: IRecentRoute[];
  setRecentRoute: (recent: IRecentRoute) => void;
}

export const useRouteStore = create(
  persist<IRouteState>(
    set => ({
      recentRoutes: [],
      setRecentRoute: (recent: IRecentRoute) =>
        set(state => ({
          recentRoutes: [recent].concat(state.recentRoutes),
        })),
    }),
    {
      name: 'route-storage',
      storage: createJSONStorage(() => Storage),
    },
  ),
);
