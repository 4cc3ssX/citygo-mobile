import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {AppState, AppStateStatus, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {persistQueryClient} from '@tanstack/react-query-persist-client';

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
      gcTime: 60000, // 1 minute
    },
  },
});

const storagePersister = createSyncStoragePersister({
  storage: Storage,
});

persistQueryClient({
  queryClient,
  persister: storagePersister,
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
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AppContext.Provider>
  );
};
