import {createContext, useContext} from 'react';

export interface IAppContext {
  isLocationEnabled: boolean;
  requestPermissions: () => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  isLocationEnabled: false,
  requestPermissions: async () => {},
});

export const useAppContext = () => useContext<IAppContext>(AppContext);
