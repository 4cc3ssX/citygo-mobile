import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ListRenderItemInfo,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {dismissAlert} from '@baronha/ting';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {featureCollection, lineString} from '@turf/helpers';

import ContentLoader, {Rect} from 'react-content-loader/native';
import {useTranslation} from 'react-i18next';
import MapView, {
  Callout,
  Geojson,
  LatLng,
  Marker,
  Region,
} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import Color from 'color';
import {BBox, FeatureCollection, LineString, Point} from 'geojson';
import {omit} from 'lodash';
import useSupercluster from 'use-supercluster';

import {
  Container,
  CustomBackdrop,
  EmptyList,
  HStack,
  MapCallout,
  RowItem,
  RowItemContent,
  RowItemLeft,
  Separator,
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {Constants} from '@constants';
import {showAlert} from '@helpers/toast';
import {useGetRoutes, useGetStops} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {useStopStore} from '@store/stop';
import {globalStyles} from '@styles/global';
import {ResponseFormat} from '@typescript/api';
import {IRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

type Props = NativeStackScreenProps<RootStackParamsList, 'Routes'>;

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
  const stopStore = useStopStore();

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* BottomSheet */
  const stopBottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '60%', '80%'], []);

  /* State */
  const [activeRoute, setActiveRoute] = useState<IRoute | null>(initialRoute);
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

  /* Query */
  const {data: stops} = useGetStops(
    ResponseFormat.JSON,
    {
      refetchOnWindowFocus: false,
      initialData: stopStore.stops,
    },
    data => {
      stopStore.setStops(data);

      // make sure not to call twice
      if (initialRoute && stopStore.stops.length === 0) {
        onPressItem(initialRoute);
      }
    },
  );

  const {isFetching: isStopsFetching, data: stopsGeoJSON} = useGetStops<
    FeatureCollection<Point, IStop>
  >(
    ResponseFormat.GEOJSON,
    {
      refetchOnWindowFocus: false,
      initialData: {
        type: 'FeatureCollection',
        features: stopStore.geojson,
      },
    },
    data => {
      stopStore.setGeoJSON(data.features);
    },
  );
  const {isFetching: isRoutesFetching, data: routes} = useGetRoutes();

  /* Memo */
  const activeRouteGeoJson = useMemo<
    FeatureCollection<LineString, Omit<IRoute, 'coordinates'>>
  >(() => {
    if (!activeRoute) {
      return featureCollection([]);
    }
    return featureCollection([
      lineString(
        activeRoute.coordinates.map(({lng, lat}) => [lng, lat]),
        omit(activeRoute, ['coordinates']),
        {
          id: activeRoute.route_id,
        },
      ),
    ]);
  }, [activeRoute]);

  const activeRouteStops = useMemo<IStop[]>(() => {
    if (activeRoute && stops?.length) {
      return activeRoute.stops.map(
        stopId => stops?.find(stop => stop.id === stopId) as IStop,
      );
    }

    return [];
  }, [activeRoute, stops]);

  const activeRouteStopsGeoJSON = useMemo(() => {
    if (activeRoute && stopsGeoJSON) {
      return activeRoute.stops.map(stopId =>
        stopsGeoJSON.features.find(feature => feature.id === stopId),
      );
    }

    return stopsGeoJSON?.features || [];
  }, [activeRoute, stopsGeoJSON]);

  /* Hooks */
  const {clusters} = useSupercluster({
    points: activeRouteStopsGeoJSON,
    bounds: bounds || undefined,
    zoom,
    disableRefresh: isStopsFetching,
    options: {
      radius: 35,
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

  const onPressStopItem = useCallback((stop: IStop) => {
    stopBottomSheetRef.current?.snapToIndex(0);

    // move to stop coordinate
    const region = Constants.getDefaultMapDelta(stop.lat, stop.lng);

    mapRef.current?.animateToRegion(region);
  }, []);

  const onPressItem = useCallback((selectedRoute: IRoute) => {
    setActiveRoute(selectedRoute);

    bottomSheetRef.current?.snapToIndex(0);

    setTimeout(() => {
      stopBottomSheetRef.current?.snapToIndex(1);
    }, 100);

    const coordinates = selectedRoute.coordinates.map<LatLng>(coord => ({
      latitude: coord.lat,
      longitude: coord.lng,
    }));

    // fit to coordinates took longer sometimes
    showAlert({
      title: 'Loading...',
      preset: 'spinner',
      shouldDismissByTap: false,
    });

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 20,
        bottom: 60,
        left: 20,
        right: 20,
      },
      animated: true,
    });

    dismissAlert();
  }, []);

  useEffect(() => {
    if (initialRoute && stopStore.stops.length > 0) {
      onPressItem(initialRoute);
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
    if (!isStopsFetching || !stops?.length) {
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

  const ListHeaderComponent = useMemo(
    () => (
      <VStack
        pt={theme.spacing['2']}
        pb={theme.spacing['5']}
        gap={theme.spacing['6']}>
        <Text family="product" size="xl">
          Bus Line Details
        </Text>
        <RowItem bg={theme.colors.surface} h={theme.spacing['18']}>
          <RowItemLeft h="100%" bg={activeRoute?.color}>
            <Text type="semibold" color="white">
              {activeRoute?.route_id.split('-')[0]}
            </Text>
          </RowItemLeft>
          <Separator h={theme.spacing['8']} direction="vertical" />
          <RowItemContent>
            <Text size="md" numberOfLines={1}>
              {activeRoute?.agency_id}
            </Text>
            <Text size="xs" color={theme.colors.gray2} numberOfLines={2}>
              {activeRoute?.name[app.language]}
            </Text>
          </RowItemContent>
        </RowItem>
        <Separator />
      </VStack>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      activeRoute?.agency_id,
      activeRoute?.color,
      activeRoute?.name,
      activeRoute?.route_id,
      app.language,
      theme.colors.gray2,
      theme.colors.surface,
    ],
  );

  const renderItem = useCallback(
    ({item: stop}: ListRenderItemInfo<IStop>) => {
      return (
        <RowItem h={theme.spacing['15']} onPress={() => onPressStopItem(stop)}>
          <RowItemLeft bg={theme.colors.background}>
            <Text size="xl" textAlign="center">
              📍
            </Text>
          </RowItemLeft>

          <RowItemContent>
            <Text size="md">{stop.name[app.language]}</Text>
            <Text size="xs" color={theme.colors.gray2} numberOfLines={1}>
              {stop.road[app.language]}, {stop.township[app.language]}
            </Text>
          </RowItemContent>
        </RowItem>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      app.language,
      onPressStopItem,
      theme.colors.background,
      theme.colors.gray2,
    ],
  );

  return (
    <Container>
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
          initialNumToRender={10}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={itemSeparatorComponent}
          ListEmptyComponent={stopListEmptyComponent}
          renderItem={renderItem}
          keyExtractor={(item, index) => `stop-sheet-${item.id}-${index}`}
          getItemLayout={(data, index) => ({
            length: theme.spacing['15'],
            offset: theme.spacing['15'] * index,
            index,
          })}
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
          initialNumToRender={5}
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
                <RowItemLeft h="100%" bg={item.color}>
                  <Text type="semibold" color="white">
                    {item.route_id.split('-')[0]}
                  </Text>
                </RowItemLeft>
                <Separator h={theme.spacing['8']} direction="vertical" />
                <RowItemContent>
                  <Text size="md" numberOfLines={1}>
                    {item.agency_id}
                  </Text>
                  <Text size="xs" color={theme.colors.gray2} numberOfLines={2}>
                    {item.name[app.language]}
                  </Text>
                </RowItemContent>
              </RowItem>
            );
          }}
          keyExtractor={item => `sheet-item-${item.route_id}`}
          getItemLayout={(data, index) => ({
            length: theme.spacing['18'],
            offset: theme.spacing['18'] * index,
            index,
          })}
          contentContainerStyle={[
            styles.listContainerStyle,
            {paddingBottom: insets.bottom + theme.spacing['3']},
          ]}
        />
      </BottomSheet>

      <MapView
        ref={mapRef}
        initialRegion={map.lastRegion || undefined}
        {...defaultMapProps}
        mapType="standard"
        userInterfaceStyle={themeName}
        onRegionChangeComplete={handleRegionChange}
        style={styles.mapView}>
        {clusters?.map((point, index) => {
          const properties = point.properties || {};

          if (properties.cluster) {
            return null;
          }

          const stop = convertFeatureToData<IStop>(point);

          return (
            <Marker
              key={`marker-${stop.id}-${index}`}
              identifier={`marker-${stop.id}-${index}`}
              tracksViewChanges={false}
              coordinate={{latitude: stop.lat, longitude: stop.lng}}
              image={{uri: 'marker'}}>
              <Callout tooltip>
                <MapCallout canPress={false}>
                  {stop.name[app.language]}
                </MapCallout>
              </Callout>
            </Marker>
          );
        })}

        {activeRoute && activeRouteGeoJson ? (
          <Geojson
            geojson={activeRouteGeoJson}
            strokeColor={activeRoute.color}
            strokeWidth={4}
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
