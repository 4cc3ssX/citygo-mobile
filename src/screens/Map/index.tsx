import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import Geolocation from 'react-native-geolocation-service';
import MapView, {Callout, Marker, Region} from 'react-native-maps';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import Color from 'color';
import {BBox, FeatureCollection, Point} from 'geojson';
import useSupercluster from 'use-supercluster';

import {Icon} from '@components/icons';
import {
  Container,
  CustomBackdrop,
  IconButton,
  RowItem,
  Separator,
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {Constants} from '@constants';
import {useGetRoutes, useGetStops} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {TAB_HEIGHT} from '@navigations/components';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {globalStyles} from '@styles/global';
import {ResponseFormat} from '@typescript/api';
import {IRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Map'
>;

const Map = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  const {width} = useWindowDimensions();

  /* Store */
  const app = useAppStore();
  const map = useMapStore();

  /* Query */
  const {isFetching, data: stops} = useGetStops<
    FeatureCollection<Point, IStop>
  >(ResponseFormat.GEOJSON);

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* BottomSheet */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const stopBottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);

  /* State */
  const [selectedStop, setSelectedStop] = useState<IStop | null>(null);
  const [isLocating, setIsLocating] = useState(false);
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

  /* Hooks */
  const {clusters} = useSupercluster({
    points: stops?.features || [],
    bounds: bounds || undefined,
    zoom,
    disableRefresh: isFetching,
    options: {
      radius: 40,
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
        stopBottomSheetRef.current?.snapToIndex(1);
      }, 0);
    },
    [stopBottomSheetRef],
  );
  const handleRegionChange = useCallback(
    async (region: Region) => {
      const regionBounds = await mapRef.current?.getMapBoundaries();
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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    );
  }, [handleRegionChange, map]);

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
        appearsOnIndex={1}
        disappearsOnIndex={0}
        opacity={0.1}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Container
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}>
      {/* <BottomSheet
        ref={bottomSheetRef}
        animateOnMount
        enableDynamicSizing
        handleIndicatorStyle={globalStyles.bottomSheetHandleIndicator}
        backgroundStyle={[
          globalStyles.bottomSheetContainer,
          {backgroundColor: theme.colors.background},
        ]}
        containerStyle={[styles.bottomSheetContainer]}>
        <BottomSheetView
          style={[
            styles.innerContainer(insets),
            styles.bottomSheetView(insets),
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
            <Link underlined={false}>Filter</Link>
          </HStack>
          {selectedStop && (
            <RecentRouteCard
              from={selectedStop}
              to={selectedStop}
              id={''}
              route={[]}
              transitSteps={[]}
              coordinates={[]}
            />
          )}
        </BottomSheetView>
      </BottomSheet> */}

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
            globalStyles.bottomSheetContainer,
            {backgroundColor: theme.colors.background},
          ]}
          containerStyle={[styles.bottomSheetContainer]}>
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
            keyExtractor={item => `sheet-${item.route_id}`}
            contentContainerStyle={[
              styles.innerContainer(insets),
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
              tracksViewChanges={false}
              coordinate={{latitude: stop.lat, longitude: stop.lng}}
              image={{uri: 'marker'}}>
              <Callout onPress={() => onPressMarkerHandler(stop)}>
                <Text size="xs">{stop.name[app.language]}</Text>
              </Callout>
            </Marker>
          );
        })}
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
    right: insets.right + theme.spacing['4'],
    bottom: insets.bottom + TAB_HEIGHT + theme.spacing['10'],
    zIndex: 8,
  }),
  disabledButton: (color: string) => ({
    backgroundColor: Color(color).lighten(0.25).string(),
  }),
  bottomSheetContainer: {
    zIndex: 15,
  },
  backdropContainer: {
    zIndex: 12,
  },
  innerContainer: (insets: EdgeInsets) => ({
    paddingTop: theme.spacing['3'],
    paddingBottom: insets.bottom + theme.spacing['3'],
    paddingHorizontal: theme.spacing['5'],
  }),
  bottomSheetView: (insets: EdgeInsets) => ({
    paddingBottom: insets.bottom + TAB_HEIGHT + theme.spacing['3'],
  }),
}));

export default Map;
