import React, {useCallback, useEffect, useRef} from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

import {useTranslation} from 'react-i18next';
import MapView, {Marker} from 'react-native-maps';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/lib/typescript/types';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import dayjs from 'dayjs';
import {random} from 'lodash';

import {Icon} from '@components/icons';
import {
  Avatar,
  Carousel,
  CarouselCard,
  Container,
  HStack,
  IconButton,
  Link,
  RowItem,
  RowItemContent,
  RowItemLeft,
  RowItemRight,
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {Constants} from '@constants';
import {openBrowser} from '@helpers/inAppBrowser';
import {useGetNearestStops} from '@hooks/api';
import {useGetAds} from '@hooks/api/ads';
import {useGetSuggestions} from '@hooks/api/suggestions';
import {useAppContext} from '@hooks/context';
import {useThemeName} from '@hooks/useThemeName';
import {TAB_HEIGHT} from '@navigations/components';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {useUserStore} from '@store/user';
import {appStyles} from '@styles/app';
import {IAds} from '@typescript/api/ads';

import {FavoriteRouteCard} from './components/FavoriteRouteCard';

type Props = BottomTabScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Home'
>;

const Home = ({navigation}: Props) => {
  const {t} = useTranslation();

  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);
  const {width} = useWindowDimensions();
  /* Context */
  const {isLocationEnabled} = useAppContext();

  /* Query */
  const {data: nearestStops, mutate: getNearestStops} = useGetNearestStops();
  const {data: ads = []} = useGetAds();
  const {data: suggestions} = useGetSuggestions();

  /* Map State */
  const appStore = useAppStore();
  const mapStore = useMapStore();
  const {bookmarks} = useUserStore();

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* Handlers */
  const onLocateMe = useCallback(async () => {
    if (mapStore.userLocation && mapStore.lastRegion) {
      // get nearest stops
      getNearestStops(mapStore.userLocation);
      mapRef.current?.animateToRegion(mapStore.lastRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStore.lastRegion, mapStore.userLocation]);

  /* Effects */
  useEffect(() => {
    if (isLocationEnabled) {
      onLocateMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocationEnabled]);

  return (
    <Container
      edges={['top', 'left', 'right']}
      style={[appStyles.container, styles.container]}>
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
            onPress={() => navigation.navigate('Notifications')}
          />
        </HStack>
      </HStack>

      <ScrollView
        contentContainerStyle={[styles.container, styles.scrollView]}
        showsVerticalScrollIndicator={false}>
        {bookmarks.length > 0 ? (
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
              {bookmarks.slice(0, 2).map(bookmark => (
                <FavoriteRouteCard
                  key={`${bookmark.id}-${bookmark.groupId}-${bookmark.from.id}-${bookmark.to.id}`}
                  {...bookmark}
                />
              ))}
            </View>
          </Stack>
        ) : null}
        <Carousel
          data={ads}
          width={width - theme.spacing['6'] * 2}
          loop={false}
          renderItem={({item}: CarouselRenderItemInfo<IAds>) => {
            return (
              <CarouselCard
                image={item.image}
                onPress={() => openBrowser(item.url)}
              />
            );
          }}
        />

        <Stack gap={theme.spacing['4']}>
          <Text size="xl">{t('SearchOnMap')}</Text>
          <View style={styles.cardContainer}>
            <RowItem
              bg={theme.colors.blueSoft1}
              style={[styles.rowItemContainer]}
              onPress={() => navigation.navigate('Search', {})}>
              <RowItemLeft
                w={theme.spacing['10']}
                alignItems="center"
                justifyContent="center">
                <Ionicons name="search-outline" size={23} />
              </RowItemLeft>
              <RowItemContent>
                <Text
                  lineHeight="sm"
                  color={theme.colors.gray2}
                  size="sm"
                  numberOfLines={1}>
                  {t('WhereUWantToGo')}
                </Text>
                <Text color={theme.colors.text} size="lg" numberOfLines={1}>
                  {suggestions?.[random(0, suggestions.length)]?.name[
                    appStore.language
                  ] || '...'}
                </Text>
              </RowItemContent>
              <RowItemRight>
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
              </RowItemRight>
            </RowItem>
            <View style={styles.mapViewContainer}>
              <MapView
                ref={mapRef}
                initialRegion={mapStore.lastRegion || undefined}
                scrollEnabled={false}
                liteMode
                {...defaultMapProps}
                userInterfaceStyle={themeName}
                style={styles.mapView}>
                {nearestStops?.map((stop, index) => (
                  <Marker
                    key={stop.id}
                    identifier={`marker-${stop.id}-${index}`}
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
    gap: theme.spacing['6'],
  },
  scrollView: {
    paddingBottom:
      UnistylesRuntime.insets.bottom + TAB_HEIGHT + theme.spacing['10'], // extra padding for scroll
    flexGrow: 1,
  },
  favoriteRouteTitle: {
    ...appStyles.flex,
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
