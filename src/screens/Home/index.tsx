import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import {useTranslation} from 'react-i18next';
import MapView, {Marker} from 'react-native-maps';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Button, Container, RowItem, Text, VStack} from '@components/ui';
import {Constants} from '@constants';
import {useGetStops} from '@hooks/api';
import {useAppContext} from '@hooks/context';
import {useThemeName} from '@hooks/useThemeName';
import {useMapStore} from '@store/map';
import {IStop} from '@typescript/api/stops';
import {filterStopsWithinRadius, getDelta} from '@utils/map';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
});

const Home = () => {
  const {t} = useTranslation();

  const themeName = useThemeName();

  const {styles, theme} = useStyles(stylesheet);
  /* Context */
  const {isLocationEnabled, requestPermissions} = useAppContext();

  /* Query */
  const {data, error} = useGetStops();

  /* State */
  const [isReady, setIsReady] = useState(false);

  /* Map State */
  const map = useMapStore();
  const [isLocating, setIsLocating] = useState(false);

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* Memo */
  const nearbyStops = useMemo(() => {
    if (!map.userLocation || !data) {
      return [];
    }

    return filterStopsWithinRadius(
      map.userLocation,
      data,
      Constants.MAP_SCAN_RADIUS,
    );
  }, [data, map.userLocation]);

  /* Handlers */
  const onLocateMe = useCallback(() => {
    setIsLocating(true);

    Geolocation.getCurrentPosition(
      ({coords}) => {
        // update user location
        map.setUserLocation({lat: coords.latitude, lng: coords.longitude});

        // update last region
        const region = getDelta(
          coords.latitude,
          coords.longitude,
          Constants.MAP_CAMERA_HEIGHT,
        );

        mapRef.current!.animateToRegion(region);

        map.setLastRegion(region);
        setTimeout(() => {
          setIsLocating(false);
        }, 500);
      },
      () => {
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    );
  }, [map]);

  const onPressMarker = useCallback((stop: IStop) => {
    console.log(stop);
  }, []);

  const onInitialized = useCallback(async () => {
    await requestPermissions();

    setIsReady(true);
  }, [requestPermissions]);

  /* Effects */

  useEffect(() => {
    if (isLocationEnabled && isReady) {
      onLocateMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocationEnabled, isReady]);

  useEffect(() => {
    onInitialized();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container edges={['top', 'left', 'right']} barStyle="dark-content">
      <View style={styles.searchOnMapContainer}>
        <View>
          <Text size="xl">{t('SearchOnMap')}</Text>
        </View>
        <View style={styles.mapViewContainer}>
          <RowItem style={styles.suggestRowItemContainer}>
            <RowItem.Left style={styles.suggestRowItemLeftContainer}>
              <Ionicons name="search-outline" size={24} />
            </RowItem.Left>
            <RowItem.Content>
              <VStack>
                <Text color={theme.colors.hint} size={theme.fonts.sizes.sm}>
                  {t('WhereUWantToGo')}
                </Text>
                <Text type="medium">Hledan</Text>
              </VStack>
            </RowItem.Content>
            <RowItem.Right>
              <Button w={theme.spacing['12']} h="100%">
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={theme.colors.white}
                />
              </Button>
            </RowItem.Right>
          </RowItem>
          <MapView
            ref={mapRef}
            showsTraffic
            showsUserLocation
            followsUserLocation
            zoomEnabled={false}
            pointerEvents="none"
            mapType="standard"
            userInterfaceStyle={themeName}
            style={styles.mapView}>
            {nearbyStops.map(stop => (
              <Marker
                key={stop.id}
                coordinate={{latitude: stop.lat, longitude: stop.lng}}
                image={{uri: 'location_pin'}}
                onPress={() => onPressMarker(stop)}
              />
            ))}
          </MapView>
        </View>
      </View>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  mapViewContainer: {
    gap: 12,
    padding: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 25,
  },
  mapView: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  floatContainer: {
    paddingHorizontal: 15,
  },
  searchOnMapContainer: {
    gap: theme.spacing['4'],
  },
  suggestRowItemContainer: {
    height: theme.spacing['16'],
    padding: theme.spacing['2'],
    borderRadius: theme.spacing['4'],
    backgroundColor: theme.colors.infoBackground,
    gap: theme.spacing['4'],
  },
  suggestRowItemLeftContainer: {
    paddingLeft: theme.spacing['3'],
  },
}));

export default Home;
