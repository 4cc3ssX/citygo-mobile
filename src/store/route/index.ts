import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {Storage} from '@helpers/storage';
import {IRecentRoute} from '@store/types';

export interface IRouteState {
  recentRoutes: IRecentRoute[];
  addRecentRoute: (recent: IRecentRoute) => void;
}

export const useRouteStore = create(
  persist<IRouteState>(
    set => ({
      recentRoutes: [],
      addRecentRoute: (recent: IRecentRoute) =>
        set(state => {
          if (
            state.recentRoutes.some(
              r =>
                r.from.id === recent.from.id &&
                r.to.id === recent.to.id &&
                r.id === recent.id,
            )
          ) {
            return state;
          }

          return {
            recentRoutes: [recent].concat(state.recentRoutes),
          };
        }),
      updateRecentRoute: (id: string, data: Partial<IRecentRoute>) =>
        set(state => ({
          recentRoutes: state.recentRoutes.map(r => {
            if (r.id === id) {
              return {
                ...r,
                ...data,
              };
            }
            return r;
          }),
        })),
    }),
    {
      name: 'route-storage',
      storage: createJSONStorage(() => Storage),
    },
  ),
);
