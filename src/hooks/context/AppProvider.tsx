import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {AppState, AppStateStatus, Platform} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {PortalProvider} from '@gorhom/portal';
import NetInfo from '@react-native-community/netinfo';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {focusManager, onlineManager, QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {checkLocationPermission} from '@helpers/permissions';
import {Storage} from '@helpers/storage';
import {showAlert} from '@helpers/toast';
import {globalStyles} from '@styles/global';

import {AppContext} from '.';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const storagePersister = createSyncStoragePersister({
  storage: Storage,
});

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

export const AppContextProvider = ({children}: PropsWithChildren) => {
  const [isLocationEnabled, setLocationEnabled] = useState(false);

  const requestPermissions = useCallback(async () => {
    const isLocationGranted = await checkLocationPermission();
    if (isLocationGranted) {
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

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <AppContext.Provider value={{isLocationEnabled, requestPermissions}}>
      <GestureHandlerRootView style={globalStyles.flex}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <PortalProvider>
            <BottomSheetModalProvider>
              <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{persister: storagePersister}}>
                {children}
              </PersistQueryClientProvider>
            </BottomSheetModalProvider>
          </PortalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AppContext.Provider>
  );
};
