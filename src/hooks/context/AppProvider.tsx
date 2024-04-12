import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AppState, AppStateStatus, Platform} from 'react-native';
import {alert} from '@baronha/ting';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {PortalProvider} from '@gorhom/portal';
import NetInfo from '@react-native-community/netinfo';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';
import {focusManager, onlineManager, QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';

import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {Region} from 'react-native-maps';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {Constants} from '@constants';
import {checkLocationPermission} from '@helpers/permissions';
import {Storage} from '@helpers/storage';
import {useMapStore} from '@store/map';
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
  /* Store */
  const mapStore = useMapStore();

  /* Ref */
  const appState = useRef(AppState.currentState);

  /* State */
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationEnabled, setLocationEnabled] = useState(false);

  /* Handlers */
  // MARK: locatePosition
  const locatePosition = useCallback(
    () =>
      new Promise<GeoCoordinates & {region: Region}>((resolve, reject) => {
        setIsLocating(true);

        Geolocation.getCurrentPosition(
          ({coords}) => {
            mapStore.setUserLocation({
              lat: coords.latitude,
              lng: coords.longitude,
            });

            // update last region
            const region = Constants.getDefaultMapDelta(
              coords.latitude,
              coords.longitude,
            );

            mapStore.setLastRegion(region);

            setIsLocating(false);

            resolve({...coords, region});
          },
          err => {
            setIsLocating(false);

            reject(err);
          },
          {
            accuracy: {
              android: 'low',
              ios: 'best',
            },
            maximumAge: 5000,
          },
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // MARK: requestPermissions
  const requestPermissions = useCallback(async () => {
    const isLocationGranted = await checkLocationPermission();
    if (isLocationGranted) {
      setLocationEnabled(true);

      locatePosition();
    } else {
      alert({
        title: 'Permission Denied',
        message: 'Enable location for personalized features. 📍',
        preset: 'error',
        haptic: 'error',
      });
    }
  }, [locatePosition]);

  function onAppStateChange(nextAppState: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(nextAppState === 'active');
    }

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');

      onAppInitialized();
    }

    appState.current = nextAppState;
  }

  const onAppInitialized = useCallback(async () => {
    await requestPermissions();
  }, [requestPermissions]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    onAppInitialized();

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLocationEnabled,
        requestPermissions,
        isLocating,
        locatePosition,
      }}>
      <GestureHandlerRootView style={globalStyles.flex}>
        <KeyboardProvider>
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
        </KeyboardProvider>
      </GestureHandlerRootView>
    </AppContext.Provider>
  );
};
