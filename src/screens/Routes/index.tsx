import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet, useWindowDimensions} from 'react-native';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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

  /* Query */
  const {data: stops} = useGetStops<IStop[]>();
  const {isFetching: isStopsFetching, data: stopsGeoJSON} = useGetStops<
    FeatureCollection<Point, IStop>
  >(ResponseFormat.GEOJSON);
  const {isFetching: isRoutesFetching, data: routes} = useGetRoutes();
  const {data: activeRouteGeoJson, mutate: getRouteById} = useGetRouteById<
    FeatureCollection<LineString, IRoute>
  >(ResponseFormat.GEOJSON);

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

  /* Memo */
  const activeRouteStops = useMemo<IStop[]>(() => {
    if (activeRoute) {
      return activeRoute?.stops.map(
        stopId => stops?.find(stop => stop.id === stopId) as IStop,
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

        handleRegionChange(region);

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
  }, [handleRegionChange, map]);

  const onCloseStopSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);

    setActiveRoute(null);
  }, []);

  const onPressStopItem = useCallback((stop: IStop) => {
    stopBottomSheetRef.current?.snapToIndex(0);

    // move to stop coordinate
    const region = Constants.getDefaultMapDelta(stop.lat, stop.lng);

    mapRef.current?.animateToRegion(region);
  }, []);

  const onPressItem = useCallback(
    (selectedRoute: IRoute) => {
      setActiveRoute(selectedRoute);

      bottomSheetRef.current?.close();

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

      setTimeout(() => {
        stopBottomSheetRef.current?.snapToIndex(1);
      }, 100);

      // fetch route geojson
      getRouteById({id: selectedRoute.route_id});
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
        opacity={0.1}
      />
    ),
    [styles.backdropContainer],
  );

  const itemSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['2']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Container
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}>
      <Portal>
        <BottomSheet
          ref={stopBottomSheetRef}
          topInset={Constants.HEADER_HEIGHT + insets.top + theme.spacing['3']}
          index={-1}
          snapPoints={snapPoints}
          animateOnMount={false}
          enablePanDownToClose
          onClose={onCloseStopSheet}
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
                    <Text
                      size="xs"
                      color={theme.colors.gray2}
                      numberOfLines={2}>
                      {activeRoute?.name[app.language]}
                    </Text>
                  </RowItem.Content>
                </RowItem>
                <Separator />
              </VStack>
            }
            ItemSeparatorComponent={itemSeparatorComponent}
            renderItem={({item: stop}) => {
              return (
                <RowItem onPress={() => onPressStopItem(stop)}>
                  <RowItem.Left bg={theme.colors.background}>
                    <Text size="xl" textAlign="center">
                      📍
                    </Text>
                  </RowItem.Left>

                  <RowItem.Content>
                    <Text size="md">{stop.name[app.language]}</Text>
                    <Text
                      size="xs"
                      color={theme.colors.gray2}
                      numberOfLines={1}>
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
      </Portal>
      <Portal>
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
            data={routes}
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
                    <Text
                      size="xs"
                      color={theme.colors.gray2}
                      numberOfLines={2}>
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
      </Portal>

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
