import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {Storage} from '@helpers/storage';
import {supportedLng} from '@locales/helpers';
import {IAppTheme} from '@theme/themes';

export interface IAppState {
  theme: IAppTheme;
  language: supportedLng;
  setTheme: (theme: IAppTheme) => void;
  setLanguage: (language: supportedLng) => void;
}

export const useAppStore = create(
  persist<IAppState>(
    set => ({
      theme: 'light',
      language: 'en',
      setTheme: (theme: IAppTheme) => set({theme}),
      setLanguage: (language: supportedLng) => set({language}),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => Storage),
    },
  ),
);
