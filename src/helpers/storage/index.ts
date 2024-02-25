import {MMKV} from 'react-native-mmkv';

import {name as appName} from '../../../app.json';

export const mmkvInstance = new MMKV({
  id: `${appName}-storage`,
});

export interface IStorage {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
}

export const Storage: IStorage = {
  setItem: (key, value) => {
    mmkvInstance.set(key, value);
    return;
  },
  getItem: key => {
    const value = mmkvInstance.getString(key);
    return value || null;
  },
  removeItem: key => {
    mmkvInstance.delete(key);
    return;
  },
  clear: () => {
    mmkvInstance.clearAll();
    return;
  },
};
