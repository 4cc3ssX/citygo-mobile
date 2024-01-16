import React, {PropsWithChildren, useCallback, useState} from 'react';
import {createContext, useContext} from 'react';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {checkLocationPermission} from '@helpers/permissions';
import {showAlert} from '@helpers/toast';
import {globalStyles} from '@styles/global';

export interface IAppContext {
  isLocationEnabled: boolean;
  requestPermissions: () => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  isLocationEnabled: false,
  requestPermissions: async () => {},
});

export const useAppContext = () => useContext<IAppContext>(AppContext);

export const AppContextProvider = ({children}: PropsWithChildren) => {
  const [isLocationEnabled, setLocationEnabled] = useState(false);

  const requestPermissions = useCallback(async () => {
    const isLocationGranted = await checkLocationPermission();
    if (isLocationGranted) {
      showAlert({
        title: 'Permission Granted 🌐',
        message: 'Location access unlocked! Enjoy personalized features. 🚀',
        preset: 'done',
        haptic: 'success',
      });

      setLocationEnabled(true);
    } else {
      showAlert({
        title: 'Permission Denied',
        message: 'Enable location for personalized features. 📍',
        preset: 'error',
        haptic: 'error',
      });
    }
  }, []);

  return (
    <AppContext.Provider value={{isLocationEnabled, requestPermissions}}>
      <GestureHandlerRootView style={globalStyles.flex1}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </GestureHandlerRootView>
    </AppContext.Provider>
  );
};
