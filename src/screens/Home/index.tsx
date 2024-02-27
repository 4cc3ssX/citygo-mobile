import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import {useTranslation} from 'react-i18next';
import MapView, {Marker} from 'react-native-maps';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import dayjs from 'dayjs';

import {Icon} from '@components/icons';
import {
  Avatar,
  BusLineCard,
  Container,
  HStack,
  IconButton,
  Link,
  RowItem,
  Text,
  VStack,
} from '@components/ui';
import {Constants} from '@constants';
import {useGetStops} from '@hooks/api';
import {useAppContext} from '@hooks/context';
import {useThemeName} from '@hooks/useThemeName';
import {useMapStore} from '@store/map';
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
    <Container
      edges={['top', 'left', 'right']}
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      style={styles.container}>
      <View>
        <HStack alignItems="center" gap={theme.spacing['3.5']}>
          <Avatar
            w={theme.spacing['14']}
            h={theme.spacing['14']}
            bg={theme.colors.primary}
            source={require('@assets/images/citygo.png')}
          />
          <VStack flex={1} justifyContent="center" gap={theme.spacing['1']}>
            <Text size="xl" family="product">
              {t('WelcomeToApp', {
                appName: Constants.APP_NAME,
              })}
            </Text>
            <Text size="md" color={theme.colors.gray}>
              {dayjs().format('ddd[,] DD MMM')}
            </Text>
          </VStack>
          <HStack alignItems="center">
            <IconButton
              icon={
                <Icon
                  name="bell"
                  color={theme.colors.text}
                  size={theme.spacing['5']}
                />
              }
            />
          </HStack>
        </HStack>
      </View>
      <ScrollView
        contentContainerStyle={[styles.container, styles.scrollView]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <HStack alignItems="center">
            <Text size="xl" style={styles.favoriteRouteTitle}>
              {t('FavoriteRoute')}
            </Text>
            <Link size="lg" color={theme.colors.gray} underlined={false}>
              Add more
            </Link>
          </HStack>
          <View style={styles.cardContainer}>
            <RowItem
              style={[
                styles.rowItemContainer,
                styles.favoriteRouteRowItemContainer,
              ]}>
              <RowItem.Left style={styles.rowItemLeftContainer}>
                <Text>📍</Text>
              </RowItem.Left>
              <RowItem.Content>
                <Text
                  color={theme.colors.gray2}
                  size={theme.fonts.sizes.sm}
                  numberOfLines={1}>
                  Work
                </Text>
                <Text size="lg" numberOfLines={1}>
                  Junction City Tower
                </Text>
              </RowItem.Content>
              <RowItem.Right>
                <BusLineCard>20</BusLineCard>
              </RowItem.Right>
            </RowItem>
            <RowItem
              style={[
                styles.rowItemContainer,
                styles.favoriteRouteRowItemContainer,
              ]}>
              <RowItem.Left style={styles.rowItemLeftContainer}>
                <Text>📍</Text>
              </RowItem.Left>
              <RowItem.Content>
                <Text
                  color={theme.colors.gray2}
                  size={theme.fonts.sizes.sm}
                  numberOfLines={1}>
                  Place
                </Text>
                <Text size="lg" numberOfLines={1}>
                  Time City
                </Text>
              </RowItem.Content>
              <RowItem.Right>
                <HStack alignItems="center" gap={theme.spacing['1']}>
                  <BusLineCard>61</BusLineCard>
                  <BusLineCard bg={theme.colors.error}>65</BusLineCard>
                </HStack>
              </RowItem.Right>
            </RowItem>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <Text size="xl">{t('SearchOnMap')}</Text>
          </View>
          <View style={styles.cardContainer}>
            <RowItem
              style={[styles.rowItemContainer, styles.mapRowItemContainer]}>
              <RowItem.Left style={styles.rowItemLeftContainer}>
                <Ionicons name="search-outline" size={23} />
              </RowItem.Left>
              <RowItem.Content>
                <Text
                  color={theme.colors.gray2}
                  size={theme.fonts.sizes.sm}
                  numberOfLines={1}>
                  {t('WhereUWantToGo')}
                </Text>
                <Text size="lg" numberOfLines={1}>
                  Hledan
                </Text>
              </RowItem.Content>
              <RowItem.Right>
                <IconButton
                  color="primary"
                  icon={
                    <Ionicons
                      name="chevron-forward-outline"
                      size={22}
                      color={theme.colors.white}
                    />
                  }
                />
              </RowItem.Right>
            </RowItem>
            <MapView
              ref={mapRef}
              showsTraffic
              showsUserLocation
              followsUserLocation
              mapType="standard"
              userInterfaceStyle={themeName}
              style={styles.mapView}>
              {nearbyStops.map(stop => (
                <Marker
                  key={stop.id}
                  coordinate={{latitude: stop.lat, longitude: stop.lng}}
                  image={{uri: 'location_pin'}}
                />
              ))}
            </MapView>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing['8'],
  },
  scrollView: {
    flexGrow: 1,
  },
  favoriteRouteTitle: {
    flex: 1,
  },
  sectionContainer: {
    gap: theme.spacing['4'],
  },
  rowItemContainer: {
    padding: theme.spacing['1.5'],
    borderRadius: theme.spacing['4'],
    gap: theme.spacing['4'],
  },
  rowItemLeftContainer: {
    paddingLeft: theme.spacing['3'],
  },
  cardContainer: {
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
  mapRowItemContainer: {
    backgroundColor: theme.colors.infoBackground,
  },
  favoriteRouteRowItemContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}));

export default Home;
