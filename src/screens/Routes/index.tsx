import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet, useWindowDimensions} from 'react-native';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ContentLoader, {Rect} from 'react-content-loader/native';
import {useTranslation} from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import MapView, {
  Callout,
  Geojson,
  LatLng,
  Marker,
  Region,
} from 'react-native-maps';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import Color from 'color';
import {BBox, FeatureCollection, LineString, Point} from 'geojson';
import useSupercluster from 'use-supercluster';

import {Icon} from '@components/icons';
import {
  Container,
  CustomBackdrop,
  EmptyList,
  HStack,
  IconButton,
  RowItem,
  Separator,
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {Constants} from '@constants';
import {useGetRouteById, useGetRoutes, useGetStops} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {globalStyles} from '@styles/global';
import {ResponseFormat} from '@typescript/api';
import {IRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

type Props = NativeStackScreenProps<RootStackParamsList, 'Routes'>;

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const Routes = ({navigation, route}: Props) => {
  const {initialRoute} = route.params;

  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  const {width} = useWindowDimensions();

  /* Store */
  const app = useAppStore();
  const map = useMapStore();

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* BottomSheet */
  const stopBottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '60%', '80%'], []);

  /* State */
  const [activeRoute, setActiveRoute] = useState<IRoute | null>(initialRoute);
  const [isLocating, setIsLocating] = useState(false);
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

  /* Query */
  const {data: stops} = useGetStops<IStop[]>();
  const {isFetching: isStopsFetching, data: stopsGeoJSON} = useGetStops<
    FeatureCollection<Point, IStop>
  >(ResponseFormat.GEOJSON);
  const {isFetching: isRoutesFetching, data: routes} = useGetRoutes();
  const {data: activeRouteGeoJson, mutateAsync: getRouteById} = useGetRouteById<
    FeatureCollection<LineString, IRoute>
  >(ResponseFormat.GEOJSON);

  /* Memo */
  const activeRouteStops = useMemo<IStop[]>(() => {
    if (activeRoute && stops) {
      return activeRoute.stops.map(
        stopId => stops.find(stop => stop.id === stopId) as IStop,
      );
    }

    return [];
  }, [activeRoute, stops]);

  /* Hooks */
  const {clusters} = useSupercluster({
    points: stopsGeoJSON?.features || [],
    bounds: bounds || undefined,
    zoom,
    disableRefresh: isStopsFetching,
    options: {
      radius: 40,
      maxZoom: 20,
    },
  });

  /* Handlers */
  const handleRegionChange = useCallback(
    async (region: Region) => {
      const regionBounds = await mapRef.current!.getMapBoundaries();
      const bbox = boundingBoxToBbox(regionBounds);

      setBounds(bbox);

      const regionZoom =
        Math.log2(360 * (width / 256 / region.longitudeDelta)) + 1;

      setZoom(regionZoom);
    },
    [width],
  );

  const onLocateMe = useCallback(() => {
    setIsLocating(true);

    Geolocation.getCurrentPosition(
      ({coords}) => {
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
      () => {
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
  }, [map]);

  const onPressStopItem = useCallback((stop: IStop) => {
    stopBottomSheetRef.current?.snapToIndex(0);

    // move to stop coordinate
    const region = Constants.getDefaultMapDelta(stop.lat, stop.lng);

    mapRef.current?.animateToRegion(region);
  }, []);

  const onPressItem = useCallback(
    (selectedRoute: IRoute) => {
      setActiveRoute(selectedRoute);

      bottomSheetRef.current?.snapToIndex(0);

      setTimeout(() => {
        stopBottomSheetRef.current?.snapToIndex(1);
      }, 10);

      // fetch route geojson
      getRouteById({id: selectedRoute.route_id});

      mapRef.current?.fitToCoordinates(
        selectedRoute.coordinates.map<LatLng>(coord => ({
          latitude: coord.lat,
          longitude: coord.lng,
        })),
        {
          edgePadding: {
            top: 20,
            bottom: 60,
            left: 20,
            right: 20,
          },
          animated: true,
        },
      );
    },
    [getRouteById],
  );

  useEffect(() => {
    if (initialRoute) {
      onPressItem(initialRoute);
    } else {
      onLocateMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => (
      <CustomBackdrop
        {...props}
        style={styles.backdropContainer}
        appearsOnIndex={2}
        disappearsOnIndex={1}
        opacity={0}
      />
    ),
    [styles.backdropContainer],
  );

  const itemSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['2']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const routeListEmptyComponent = useCallback(() => {
    if (!isRoutesFetching) {
      return <EmptyList mb={theme.spacing['10']} title="No routes available" />;
    }

    return (
      <ContentLoader
        speed={2}
        width="100%"
        height={600}
        viewBox="0 0 300 600"
        preserveAspectRatio="none"
        backgroundColor={theme.colors.surface}
        foregroundColor={theme.colors.gray4}>
        {Array(6)
          .fill(0)
          .map((_value, index) => {
            const y = (theme.spacing['18'] + theme.spacing['2']) * index;

            return (
              <Rect
                key={`content-loader-${index}`}
                x="0"
                y={`${y}`}
                rx={`${theme.roundness}`}
                ry={`${theme.roundness}`}
                width="100%"
                height={theme.spacing['18']}
              />
            );
          })}
      </ContentLoader>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoutesFetching, theme.colors.background]);

  const stopListEmptyComponent = useCallback(() => {
    if (!isStopsFetching && !stops) {
      return <EmptyList mb={theme.spacing['10']} title="No stops available" />;
    }

    return (
      <ContentLoader
        speed={2}
        width="100%"
        height={600}
        viewBox="0 0 300 600"
        preserveAspectRatio="none"
        backgroundColor={theme.colors.surface}
        foregroundColor={theme.colors.gray4}>
        {Array(6)
          .fill(0)
          .map((_value, index) => {
            const y = (theme.spacing['15'] + theme.spacing['2']) * index;

            return (
              <Rect
                key={`content-loader-${index}`}
                x="0"
                y={`${y}`}
                rx={`${theme.roundness}`}
                ry={`${theme.roundness}`}
                width="100%"
                height={theme.spacing['15']}
              />
            );
          })}
      </ContentLoader>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStopsFetching, theme.colors.background]);

  return (
    <Container
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}>
      <BottomSheet
        ref={stopBottomSheetRef}
        topInset={Constants.HEADER_HEIGHT + insets.top + theme.spacing['3']}
        index={-1}
        snapPoints={snapPoints}
        animateOnMount
        enablePanDownToClose
        backdropComponent={backdropComponent}
        handleIndicatorStyle={globalStyles.bottomSheetHandleIndicator}
        backgroundStyle={[
          globalStyles.bottomSheetContainer,
          {backgroundColor: theme.colors.background},
        ]}
        containerStyle={[styles.stopBottomSheetContainer]}>
        <BottomSheetFlatList
          showsVerticalScrollIndicator={false}
          data={activeRouteStops}
          initialNumToRender={5}
          ListHeaderComponent={
            <VStack
              pt={theme.spacing['2']}
              pb={theme.spacing['5']}
              gap={theme.spacing['6']}>
              <Text family="product" size="xl">
                Bus Line Details
              </Text>
              <RowItem bg={theme.colors.surface} h={theme.spacing['18']}>
                <RowItem.Left h="100%" bg={activeRoute?.color}>
                  <Text type="semibold" color="white">
                    {activeRoute?.route_id.split('-')[0]}
                  </Text>
                </RowItem.Left>
                <Separator h={theme.spacing['8']} direction="vertical" />
                <RowItem.Content>
                  <Text size="md" numberOfLines={1}>
                    {activeRoute?.agency_id}
                  </Text>
                  <Text size="xs" color={theme.colors.gray2} numberOfLines={2}>
                    {activeRoute?.name[app.language]}
                  </Text>
                </RowItem.Content>
              </RowItem>
              <Separator />
            </VStack>
          }
          ItemSeparatorComponent={itemSeparatorComponent}
          ListEmptyComponent={stopListEmptyComponent}
          renderItem={({item: stop}) => {
            return (
              <RowItem
                h={theme.spacing['15']}
                onPress={() => onPressStopItem(stop)}>
                <RowItem.Left bg={theme.colors.background}>
                  <Text size="xl" textAlign="center">
                    📍
                  </Text>
                </RowItem.Left>

                <RowItem.Content>
                  <Text size="md">{stop.name[app.language]}</Text>
                  <Text size="xs" color={theme.colors.gray2} numberOfLines={1}>
                    {stop.road[app.language]}, {stop.township[app.language]}
                  </Text>
                </RowItem.Content>
              </RowItem>
            );
          }}
          keyExtractor={(item, index) => `stop-sheet-${item.id}-${index}`}
          contentContainerStyle={[
            styles.listContainerStyle,
            {paddingBottom: insets.bottom + theme.spacing['3']},
          ]}
        />
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetRef}
        topInset={Constants.HEADER_HEIGHT + insets.top + theme.spacing['3']}
        index={0}
        snapPoints={snapPoints}
        animateOnMount
        backdropComponent={backdropComponent}
        handleIndicatorStyle={globalStyles.bottomSheetHandleIndicator}
        backgroundStyle={[
          globalStyles.bottomSheetContainer,
          {backgroundColor: theme.colors.background},
        ]}
        containerStyle={[styles.bottomSheetContainer]}>
        <BottomSheetFlatList
          showsVerticalScrollIndicator={false}
          data={routes || []}
          initialNumToRender={3}
          ListHeaderComponent={
            <HStack
              pt={theme.spacing['2']}
              pb={theme.spacing['5']}
              bg={theme.colors.background}>
              <Text family="product" size="xl">
                Bus Lines
              </Text>
            </HStack>
          }
          ItemSeparatorComponent={itemSeparatorComponent}
          ListEmptyComponent={routeListEmptyComponent}
          renderItem={({item}) => {
            return (
              <RowItem
                bg={theme.colors.surface}
                h={theme.spacing['18']}
                onPress={() => onPressItem(item)}>
                <RowItem.Left h="100%" bg={item.color}>
                  <Text type="semibold" color="white">
                    {item.route_id.split('-')[0]}
                  </Text>
                </RowItem.Left>
                <Separator h={theme.spacing['8']} direction="vertical" />
                <RowItem.Content>
                  <Text size="md" numberOfLines={1}>
                    {item.agency_id}
                  </Text>
                  <Text size="xs" color={theme.colors.gray2} numberOfLines={2}>
                    {item.name[app.language]}
                  </Text>
                </RowItem.Content>
              </RowItem>
            );
          }}
          keyExtractor={item => `sheet-item-${item.route_id}`}
          contentContainerStyle={[
            styles.listContainerStyle,
            {paddingBottom: insets.bottom + theme.spacing['3']},
          ]}
        />
      </BottomSheet>

      <VStack style={styles.fabContainer(insets)}>
        <IconButton
          disabled={isLocating}
          w={theme.spacing['12']}
          h={theme.spacing['14']}
          color="primary"
          icon={<Icon name="gps" color={theme.colors.white} />}
          disableStyle={styles.disabledButton(theme.colors.primary)}
          onPress={onLocateMe}
        />
      </VStack>
      <MapView
        ref={mapRef}
        {...defaultMapProps}
        mapType="standard"
        userInterfaceStyle={themeName}
        onRegionChangeComplete={handleRegionChange}
        style={styles.mapView}>
        {clusters?.map(point => {
          const properties = point.properties;

          if (properties.cluster) {
            return null;
          }

          const stop = convertFeatureToData<IStop>(point);

          return (
            <Marker
              key={`marker-${stop.id}`}
              identifier={`marker-${stop.id}`}
              tracksViewChanges={false}
              coordinate={{latitude: stop.lat, longitude: stop.lng}}
              image={{uri: 'marker'}}>
              <Callout>
                <Text size="xs">{stop.name[app.language]}</Text>
              </Callout>
            </Marker>
          );
        })}

        {activeRoute && activeRouteGeoJson ? (
          <Geojson
            geojson={activeRouteGeoJson}
            strokeColor={activeRoute.color}
            strokeWidth={3}
          />
        ) : null}
      </MapView>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  mapView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  fabContainer: (insets: EdgeInsets) => ({
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.3,
    right: insets.right + theme.spacing['4'],

    zIndex: 8,
  }),
  disabledButton: (color: string) => ({
    backgroundColor: Color(color).lighten(0.25).string(),
  }),
  stopBottomSheetContainer: {
    zIndex: 15,
  },
  bottomSheetContainer: {
    zIndex: 12,
  },
  backdropContainer: {
    zIndex: 10,
  },
  listContainerStyle: {
    paddingHorizontal: theme.spacing['5'],
  },
}));

export default Routes;
