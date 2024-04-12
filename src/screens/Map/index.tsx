import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import MapView, {Callout, Marker, Region} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Color from 'color';
import {BBox, FeatureCollection, Point} from 'geojson';
import useSupercluster from 'use-supercluster';

import {
  Button,
  CustomBackdrop,
  HStack,
  Link,
  MapCallout,
  RowItem,
  RowItemContent,
  RowItemLeft,
  Separator,
  Stack,
  Text,
} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {useGetRoutes, useGetStops} from '@hooks/api';
import {useAppContext} from '@hooks/context';
import {useThemeName} from '@hooks/useThemeName';
import {TAB_HEIGHT} from '@navigations/components';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {useStopStore} from '@store/stop';
import {useUserStore} from '@store/user';
import {globalStyles} from '@styles/global';
import {ResponseFormat} from '@typescript/api';
import {IRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';
import {getShortenRouteName} from '@utils/route';

import {
  RecentRouteCard,
  RecentRouteCardPlaceholder,
} from './components/RecentRouteCard';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Map'
>;

const Map = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  const {locatePosition} = useAppContext();

  const {width} = useWindowDimensions();

  /* Store */
  const app = useAppStore();
  const map = useMapStore();
  const stopStore = useStopStore();
  const userStore = useUserStore();

  /* Query */
  const {isFetching: isStopsFetching, data: stops} = useGetStops<
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

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* BottomSheet */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const stopBottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);

  /* State */
  const [selectedStop, setSelectedStop] = useState<IStop | null>(null);
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

  /* Memo */
  const {data: routes} = useGetRoutes();

  const routesByStop = useMemo(() => {
    if (routes && selectedStop) {
      return routes.filter(r => r.stops.includes(selectedStop.id));
    }
    return [];
  }, [routes, selectedStop]);

  const recentRoute = useMemo(
    () => userStore.recentRoutes[0],
    [userStore.recentRoutes],
  );

  /* Hooks */
  const {clusters} = useSupercluster({
    points: stops?.features || [],
    bounds: bounds || undefined,
    zoom,
    disableRefresh: isStopsFetching,
    options: {
      radius: 35,
      maxZoom: 20,
    },
  });

  /* Handlers */
  const onPressItem = useCallback(
    (item: IRoute) => {
      stopBottomSheetRef.current?.close();

      setTimeout(() => {
        navigation.navigate('Routes', {
          initialRoute: item,
        });
      }, 0);
    },
    [navigation],
  );
  const onPressMarkerHandler = useCallback(
    (stop: IStop) => {
      setSelectedStop(stop);

      setTimeout(() => {
        stopBottomSheetRef.current?.expand();
      }, 100);
    },
    [stopBottomSheetRef],
  );

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

  const onLocateMe = useCallback(async () => {
    const {region} = await locatePosition();

    mapRef.current?.animateToRegion(region);
  }, [locatePosition]);

  useEffect(() => {
    onLocateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['2']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const backdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => (
      <CustomBackdrop
        {...props}
        style={styles.backdropContainer}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.1}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <MapView
        ref={mapRef}
        initialRegion={map.lastRegion || undefined}
        {...defaultMapProps}
        mapType="standard"
        userInterfaceStyle={themeName}
        onRegionChangeComplete={handleRegionChange}
        style={StyleSheet.absoluteFill}>
        {clusters?.map((point, index) => {
          const properties = point.properties || {};

          if (properties.cluster) {
            return null;
          }

          const stop = convertFeatureToData<IStop>(point);

          return (
            <Marker
              key={`marker-${stop.id}`}
              identifier={`marker-${stop.id}-${index}`}
              tracksViewChanges={false}
              coordinate={{latitude: stop.lat, longitude: stop.lng}}
              image={{uri: 'marker'}}>
              <Callout tooltip onPress={() => onPressMarkerHandler(stop)}>
                <MapCallout>{stop.name[app.language]}</MapCallout>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        animateOnMount
        enableDynamicSizing
        handleIndicatorStyle={globalStyles.bottomSheetHandleIndicator}
        backgroundStyle={[
          globalStyles.bottomSheetBackground,
          {backgroundColor: theme.colors.background},
        ]}>
        <BottomSheetView
          style={[
            styles.innerContainer,
            styles.bottomSheetView,
            globalStyles.bottomSheetView,
          ]}>
          <Button
            size="lg"
            icon={
              <Ionicons
                name="home-sharp"
                color={theme.colors.white}
                size={theme.spacing['6']}
              />
            }>
            Get me to home
          </Button>

          <HStack justifyContent="space-between" alignItems="center">
            <Text size="xl">Your recent route</Text>
            <Link color={theme.colors.text} underlined={false}>
              Filter
            </Link>
          </HStack>
          {recentRoute ? (
            <RecentRouteCard {...recentRoute} />
          ) : (
            <RecentRouteCardPlaceholder />
          )}
        </BottomSheetView>
      </BottomSheet>

      <Portal>
        <BottomSheet
          ref={stopBottomSheetRef}
          topInset={insets.top + theme.spacing['3']}
          index={-1}
          snapPoints={snapPoints}
          animateOnMount={false}
          enablePanDownToClose
          backdropComponent={backdropComponent}
          handleIndicatorStyle={globalStyles.bottomSheetHandleIndicator}
          backgroundStyle={[
            globalStyles.bottomSheetBackground,
            {backgroundColor: theme.colors.background},
          ]}
          containerStyle={globalStyles.bottomSheetContainer}>
          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            data={routesByStop}
            ItemSeparatorComponent={itemSeparatorComponent}
            renderItem={({item}) => {
              return (
                <RowItem
                  bg={theme.colors.surface}
                  h={theme.spacing['18']}
                  onPress={() => onPressItem(item)}>
                  <RowItemLeft h="100%" bg={item.color}>
                    <Text type="semibold" color="white">
                      {getShortenRouteName(item.route_id)}
                    </Text>
                  </RowItemLeft>
                  <Separator h={theme.spacing['8']} direction="vertical" />
                  <RowItemContent>
                    <Text size="md" numberOfLines={1}>
                      {item.agency_id}
                    </Text>
                    <Text
                      size="xs"
                      color={theme.colors.gray2}
                      numberOfLines={2}>
                      {item.name[app.language]}
                    </Text>
                  </RowItemContent>
                </RowItem>
              );
            }}
            keyExtractor={item => `sheet-${item.route_id}`}
            getItemLayout={(data, index) => ({
              length: theme.spacing['18'],
              offset: theme.spacing['18'] * index,
              index,
            })}
            contentContainerStyle={[styles.innerContainer]}
          />
        </BottomSheet>
      </Portal>
    </>
  );
};

const stylesheet = createStyleSheet(theme => ({
  disabledButton: (color: string) => ({
    backgroundColor: Color(color).lighten(0.25).string(),
  }),
  bottomSheetContainer: {
    zIndex: 15,
  },
  backdropContainer: {
    zIndex: 12,
  },
  innerContainer: {
    paddingTop: theme.spacing['3'],
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing['3'],
    paddingHorizontal: theme.spacing['5'],
  },
  bottomSheetView: {
    paddingBottom:
      UnistylesRuntime.insets.bottom + TAB_HEIGHT + theme.spacing['3'],
    gap: theme.spacing['4'],
  },
}));

export default Map;
