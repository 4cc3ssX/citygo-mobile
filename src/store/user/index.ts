import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {DEFAULT_BOOKMARK} from '@constants/bookmark';
import {Storage} from '@helpers/storage';
import {IBookmarkGroup, IBookmarkRoute, IRecentRoute} from '@store/types';

export interface IUserState {
  groups: IBookmarkGroup[];
  createNewGroup: (group: IBookmarkGroup) => void;
  removeGroup: (groupId: string) => void;

  bookmarks: IBookmarkRoute[];
  addToBookmark: (item: IBookmarkRoute) => void;
  removeFromBookmark: (item: IBookmarkRoute) => void;

  recentRoutes: IRecentRoute[];
  addRecentRoute: (item: IRecentRoute) => void;
  updateRecentRoute: (data: IRecentRoute) => void;
  removeRecentRoute: (item: IRecentRoute) => void;
}

export const useUserStore = create(
  persist<IUserState>(
    (set, get) => ({
      /* Groups */
      groups: [DEFAULT_BOOKMARK],
      createNewGroup: group => {
        set(state => ({
          groups: state.groups.concat([group]),
        }));
      },
      removeGroup: groupId =>
        set(state => ({
          groups: state.groups.filter(g => g.id !== groupId),
        })),

      /* Bookmarks */
      bookmarks: [],
      addToBookmark: item =>
        set(state => ({
          bookmarks: state.bookmarks
            .filter(
              bookmark =>
                bookmark.id !== item.id &&
                (bookmark.from.id !== item.from.id ||
                  bookmark.to.id !== item.to.id),
            )
            .concat([item]),
        })),
      removeFromBookmark: item =>
        set(state => ({
          bookmarks: state.bookmarks.filter(
            bookmark =>
              bookmark.id !== item.id &&
              (bookmark.from.id !== item.from.id ||
                bookmark.to.id !== item.to.id),
          ),
        })),

      /* Recent Routes */
      recentRoutes: [],
      addRecentRoute: item =>
        set(state => {
          if (
            state.recentRoutes.some(
              r =>
                r.from.id === item.from.id &&
                r.to.id === item.to.id &&
                r.id === item.id,
            )
          ) {
            get().updateRecentRoute(item);
            return state;
          }

          return {
            recentRoutes: [item].concat(state.recentRoutes),
          };
        }),
      updateRecentRoute: item =>
        set(state => ({
          recentRoutes: state.recentRoutes.map(r => {
            if (
              r.id === item.id &&
              r.from.id === item.from.id &&
              r.to.id === item.to.id
            ) {
              return {
                ...r,
                ...item,
              };
            }
            return r;
          }),
        })),
      removeRecentRoute: item =>
        set(state => ({
          recentRoutes: state.recentRoutes.filter(
            recent =>
              recent.id !== item.id &&
              (recent.from.id !== item.from.id ||
                recent.to.id !== item.from.id), // from and to stop id might be same with different recent id
          ),
        })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => Storage),
    },
  ),
);
