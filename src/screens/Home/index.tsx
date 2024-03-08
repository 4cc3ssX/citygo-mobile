import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

import {useTranslation} from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker} from 'react-native-maps';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
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
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {Constants} from '@constants';
import {useGetNearestStops} from '@hooks/api';
import {useAppContext} from '@hooks/context';
import {useThemeName} from '@hooks/useThemeName';
import {TAB_HEIGHT} from '@navigations/components';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {useMapStore} from '@store/map';
import {globalStyles} from '@styles/global';

type Props = BottomTabScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Home'
>;

const Home = ({navigation}: Props) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  /* Context */
  const {isLocationEnabled, requestPermissions} = useAppContext();

  /* Query */
  const {data: nearestStops, mutate: getNearestStops} = useGetNearestStops();

  /* State */
  const [isReady, setIsReady] = useState(false);

  /* Map State */
  const map = useMapStore();
  const [isLocating, setIsLocating] = useState(false);

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* Handlers */
  const onLocateMe = useCallback(() => {
    setIsLocating(true);

    Geolocation.getCurrentPosition(
      ({coords}) => {
        getNearestStops({lat: coords.latitude, lng: coords.longitude});

        // update user location
        map.setUserLocation({lat: coords.latitude, lng: coords.longitude});

        // update last region
        const region = Constants.getDefaultMapDelta(
          coords.latitude,
          coords.longitude,
        );

        mapRef.current?.animateToRegion(region);

        map.setLastRegion(region);
        setTimeout(() => {
          setIsLocating(false);
        }, 500);
      },
      err => {
        console.log(err);
        setIsLocating(false);
      },
      {
        accuracy: {
          android: 'balanced',
          ios: 'best',
        },
        maximumAge: 5000,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNearestStops]);

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
      style={[globalStyles.container, styles.container]}>
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
                name="bell-broken"
                color={theme.colors.text}
                size={theme.spacing['5']}
              />
            }
          />
        </HStack>
      </HStack>

      <ScrollView
        contentContainerStyle={[styles.container, styles.scrollView(insets)]}
        showsVerticalScrollIndicator={false}>
        <Stack gap={theme.spacing['4']}>
          <HStack justifyContent="space-between" alignItems="center">
            <Stack flex={2}>
              <Text size="xl">{t('FavoriteRoute')}</Text>
            </Stack>
            <Link size="lg" color={theme.colors.gray} underlined={false}>
              Add more
            </Link>
          </HStack>
          <View style={styles.cardContainer}>
            <RowItem
              bw={1}
              bc={theme.colors.border}
              style={[styles.rowItemContainer]}>
              <RowItem.Left
                w={theme.spacing['10']}
                h={theme.spacing['12']}
                alignItems="center"
                justifyContent="center"
                bg={theme.colors.blueSoft1}
                br={theme.roundness}>
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
              bw={1}
              bc={theme.colors.border}
              style={[styles.rowItemContainer]}>
              <RowItem.Left
                w={theme.spacing['10']}
                h={theme.spacing['12']}
                alignItems="center"
                justifyContent="center"
                bg={theme.colors.blueSoft1}
                br={theme.roundness}>
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
        </Stack>
        <Stack gap={theme.spacing['4']}>
          <Text size="xl">{t('SearchOnMap')}</Text>
          <View style={styles.cardContainer}>
            <RowItem
              bg={theme.colors.blueSoft1}
              style={[styles.rowItemContainer]}
              onPress={() => navigation.navigate('Search', {})}>
              <RowItem.Left
                w={theme.spacing['10']}
                alignItems="center"
                justifyContent="center">
                <Ionicons name="search-outline" size={23} />
              </RowItem.Left>
              <RowItem.Content>
                <Text
                  lineHeight="sm"
                  color={theme.colors.gray2}
                  size="sm"
                  numberOfLines={1}>
                  {t('WhereUWantToGo')}
                </Text>
                <Text color={theme.colors.text} size="lg" numberOfLines={1}>
                  Hledan
                </Text>
              </RowItem.Content>
              <RowItem.Right>
                <IconButton
                  pointerEvents="none"
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
            <View style={styles.mapViewContainer}>
              <MapView
                ref={mapRef}
                initialRegion={map.lastRegion || undefined}
                zoomEnabled={false}
                {...defaultMapProps}
                mapType="standard"
                userInterfaceStyle={themeName}
                style={styles.mapView}>
                {nearestStops?.map(stop => (
                  <Marker
                    key={stop.id}
                    coordinate={{latitude: stop.lat, longitude: stop.lng}}
                    image={{uri: 'marker'}}
                  />
                ))}
              </MapView>
            </View>
          </View>
        </Stack>
      </ScrollView>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingVertical: theme.spacing['3'],
    gap: theme.spacing['8'],
  },
  scrollView: (insets: EdgeInsets) => ({
    paddingBottom: insets.bottom + TAB_HEIGHT + theme.spacing['10'], // extra padding for scroll
    flexGrow: 1,
  }),
  favoriteRouteTitle: {
    ...globalStyles.flex,
  },
  rowItemContainer: {
    padding: theme.spacing['1.5'],
    borderRadius: theme.spacing['4'],
    gap: theme.spacing['3'],
  },
  cardContainer: {
    padding: theme.spacing['4'],
    backgroundColor: theme.colors.surface,
    borderRadius: 25,
    gap: theme.spacing['3'],
  },
  mapViewContainer: {
    width: '100%',
    height: theme.spacing['40'],
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  mapView: {
    width: '100%',
    height: '100%',
  },
}));

export default Home;
