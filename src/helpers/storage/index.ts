import {MMKV} from 'react-native-mmkv';

import {StateStorage} from 'zustand/middleware';

import {name as appName} from '../../../app.json';

export const mmkvInstance = new MMKV({
  id: `${appName}-storage`,
});

export const Storage: StateStorage = {
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
};
