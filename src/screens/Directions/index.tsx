import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {alert, dismissAlert} from '@baronha/ting';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import distance from '@turf/distance';
import {featureCollection, lineString, point} from '@turf/helpers';

import MapView, {
  Callout,
  Geojson,
  LatLng,
  Marker,
  Region,
  UserLocationChangeEvent,
} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';

import dayjs from 'dayjs';
import {BBox, FeatureCollection, Point} from 'geojson';
import {omit} from 'lodash';
import useSupercluster from 'use-supercluster';

import {Icon} from '@components/icons';
import {
  Button,
  CustomBackdrop,
  Input,
  MapCallout,
  Text,
  VStack,
} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {Constants} from '@constants';
import {useGetStops} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {useStopStore} from '@store/stop';
import {useUserStore} from '@store/user';
import {globalStyles} from '@styles/global';
import {ResponseFormat} from '@typescript/api';
import {
  ITransit,
  ITransitPopulatedStops,
  ITransitStep,
  ITransitWalk,
  TransitType,
} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

import {ActionCard} from './components/ActionCard';
import {DirectionCard} from './components/DirectionCard';
import {DirectionRouteDetails} from './components/DirectionRouteDetails';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Directions'
>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Directions = ({navigation, route}: Props) => {
  const {from, to, transitRoute} = route.params;

  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  /* Store */
  const app = useAppStore();
  const stopStore = useStopStore();
  const {setUserLocation, lastRegion, userLocation} = useMapStore();
  const userStore = useUserStore();

  /* Query */
  const {data: stops} = useGetStops(
    ResponseFormat.JSON,
    {
      refetchOnWindowFocus: false,
      initialData: stopStore.stops,
    },
    data => {
      stopStore.setStops(data);
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

  /* Ref */
  const mapRef = useRef<MapView>(null);
  const shouldHandleRegionChange = useRef(false);

  /* Bottom Sheet */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '60%'], []);

  /* State */
  const [isStarted, setStarted] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(app.speedLimit);
  const [currentTransitStep, setCurrentTransitStep] = useState<
    ({index: number} & ITransitStep<ITransitPopulatedStops>) | null
  >(null);
  const [currentStop, setCurrentStop] = useState<IStop | null>(null);

  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

  /* Memo */
  const transitRouteData = useMemo(() => {
    return transitRoute.transitSteps.map(r => {
      if (r.type === TransitType.WALK) {
        return {
          ...r,
          step: r.step as ITransitWalk,
        };
      }

      return {
        ...r,
        step: {
          ...r.step,
          stops: (r.step as ITransit).stops.map(
            s => stops?.find(stop => stop.id === s) as IStop,
          ),
        } as ITransitPopulatedStops,
      };
    });
  }, [stops, transitRoute.transitSteps]);

  const routeStops = useMemo(
    () =>
      transitRouteData
        .filter(t => t.type === TransitType.TRANSIT)
        .flatMap(tr => (tr.step as ITransitPopulatedStops).stops),
    [transitRouteData],
  );

  const routeStopsGeoJSON = useMemo(() => {
    if (stopsGeoJSON) {
      return transitRoute.transitSteps
        .filter(t => t.type === TransitType.TRANSIT)
        .flatMap(tr =>
          (tr.step as ITransit).stops.map(routeStopId =>
            stopsGeoJSON.features.find(sf => sf.id === routeStopId),
          ),
        );
    }

    return [];
  }, [stopsGeoJSON, transitRoute]);

  const transitRoutesGeoJSON = useMemo(() => {
    return transitRoute.transitSteps
      .filter(t => t.type === TransitType.TRANSIT)
      .flatMap(({step}) =>
        featureCollection([
          lineString(
            (step as ITransit).coordinates.map(({lng, lat}) => [lng, lat]),
            omit(step as ITransit, ['stops', 'coordinates']),
            {
              id: (step as ITransit).route_id,
            },
          ),
        ]),
      );
  }, [transitRoute.transitSteps]);

  /* Super Cluster */
  const {clusters} = useSupercluster({
    points: routeStopsGeoJSON,
    bounds: bounds || undefined,
    zoom,
    disableRefresh: isStopsFetching,
    options: {
      radius: 35,
      maxZoom: 20,
    },
  });

  /* Handlers */
  const handleRegionChange = useCallback(async (region: Region) => {
    if (!shouldHandleRegionChange.current) {
      return;
    }

    const regionBounds = await mapRef.current!.getMapBoundaries();
    const bbox = boundingBoxToBbox(regionBounds);

    setBounds(bbox);

    const regionZoom =
      Math.log2(360 * (SCREEN_WIDTH / 256 / region.longitudeDelta)) + 1;

    setZoom(regionZoom);
  }, []);

  const onPressStop = useCallback((stop: IStop) => {
    bottomSheetRef.current?.snapToIndex(0);

    // move to stop coordinate
    const region = Constants.getDefaultMapDelta(stop.lat, stop.lng);

    mapRef.current?.animateToRegion(region);
  }, []);

  const handleTransits = useCallback(() => {
    shouldHandleRegionChange.current = true;

    // mapRef could be null on mount
    setTimeout(() => {
      // fit to coordinates took longer sometimes
      alert({
        title: 'Loading...',
        preset: 'spinner',
        shouldDismissByTap: false,
      });

      mapRef.current?.fitToCoordinates(
        transitRoute.transitSteps
          .filter(t => t.type === TransitType.TRANSIT)
          .flatMap(({step}) =>
            (step as ITransit).coordinates.map<LatLng>(coord => ({
              latitude: coord.lat,
              longitude: coord.lng,
            })),
          ),
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

      dismissAlert();
    }, 100);
  }, [transitRoute.transitSteps]);

  const onStop = useCallback(() => {
    setStarted(false);

    handleTransits();

    bottomSheetRef.current?.snapToIndex(0);
  }, [handleTransits]);

  const onPositionUpdate = useCallback(
    ({latitude, longitude}: LatLng, speed?: number | null) => {
      if (speed && speed > 0) {
        setCurrentSpeed(speed);
      }
      // user point
      const userPoint = point([longitude, latitude]);

      const closestStop = routeStops.reduce(
        (prevStop: IStop | null, current: IStop) => {
          const prevDistance = prevStop
            ? distance(userPoint, point([prevStop.lng, prevStop.lat]))
            : Infinity;
          const currentDistance = distance(
            userPoint,
            point([current.lng, current.lat]),
          );

          return currentDistance < prevDistance ? current : prevStop;
        },
        null,
      );

      if (closestStop) {
        // User is not near the closest stop, check for next stop
        const closestStopIndex = routeStops.findIndex(
          stop => stop.id === closestStop.id,
        );

        const transitIndex = transitRoute.transitSteps
          .filter(transit => transit.type === TransitType.TRANSIT)
          .findIndex(transit =>
            (transit.step as ITransit).stops.includes(closestStop.id),
          );

        if (closestStopIndex > 0 && transitIndex > -1) {
          setCurrentTransitStep({
            index: transitIndex,
            ...transitRouteData.filter(
              transit => transit.type === TransitType.TRANSIT,
            )[transitIndex],
          });
        } else if (closestStopIndex === 0) {
          // initial transit step
          setCurrentTransitStep({
            index: 0,
            ...transitRouteData[0],
          });

          // don't need to update current stop to stay null
          return;
        }

        const distanceToStop = distance(
          userPoint,
          point([closestStop.lng, closestStop.lat]),
          {
            units: 'meters',
          },
        );

        // TODO: need to check (closestStopIndex < routeStops.length - 1)
        // Update current stop based on closest stop and threshold
        if (distanceToStop <= Constants.CLOSEST_STOP_THRESHOLD) {
          setCurrentStop(closestStop);
        } else if (closestStopIndex < routeStops.length - 1) {
          // fallback to previous stop
          setCurrentStop(routeStops[closestStopIndex - 1]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onUserLocationChange = useCallback(
    ({nativeEvent: {coordinate}}: UserLocationChangeEvent) => {
      if (coordinate) {
        // Update user location
        setUserLocation({
          lat: coordinate.latitude,
          lng: coordinate.longitude,
        });

        if (isStarted) {
          const region = Constants.getDefaultMapDelta(
            coordinate.latitude,
            coordinate.longitude,
          );

          mapRef.current?.animateToRegion(region);

          onPositionUpdate(
            {
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            },
            coordinate.speed,
          );
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isStarted],
  );

  const onStart = useCallback(() => {
    if (isStarted) {
      onStop();
      return;
    }

    bottomSheetRef.current?.close();

    onPositionUpdate({
      latitude: userLocation!.lat,
      longitude: userLocation!.lng,
    });

    // animate to user location
    const region = Constants.getDefaultMapDelta(
      userLocation!.lat,
      userLocation!.lng,
    );

    mapRef.current?.animateToRegion(region);

    userStore.addRecentRoute({
      ...transitRoute,
      from: stops.find(stop => stop.id === from.preferId)!,
      to: stops.find(stop => stop.id === to.preferId)!,
      startTime: dayjs().unix(),
      endTime: null,
    });

    setStarted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted, userLocation]);

  useEffect(() => {
    handleTransits();
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

  return (
    <>
      <MapView
        ref={mapRef}
        initialRegion={lastRegion || undefined}
        {...defaultMapProps}
        userInterfaceStyle={themeName}
        onRegionChangeComplete={handleRegionChange}
        onUserLocationChange={onUserLocationChange}
        style={StyleSheet.absoluteFill}>
        {clusters?.map((clusterPoint, index) => {
          const properties = clusterPoint.properties || {};

          if (properties.cluster) {
            return null;
          }

          const stop = convertFeatureToData<IStop>(clusterPoint);

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
        {transitRoutesGeoJSON.map((geojson, index) => (
          <Geojson
            key={`geojson-transit-${index}`}
            geojson={geojson}
            strokeColor={
              isStarted
                ? theme.colors.warning
                : geojson.features[0].properties.color
            }
            strokeWidth={isStarted ? 10 : 5}
          />
        ))}
      </MapView>
      <View style={styles.bottomActionContainer}>
        <VStack gap={theme.spacing['2.5']}>
          {isStarted && currentTransitStep ? (
            <ActionCard
              initial={currentStop === null}
              step={currentTransitStep}
              currentStop={currentStop || routeStops[0]}
              stops={routeStops}
              speed={currentSpeed}
            />
          ) : null}
          <Button
            bg={isStarted ? theme.colors.errorBackground : undefined}
            size="lg"
            h={theme.spacing['12']}
            onPress={onStart}
            titleStyle={isStarted ? styles.stopActionButtonTitle : undefined}>
            {isStarted ? 'Stop Live Action' : 'Start'}
          </Button>
        </VStack>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        topInset={Constants.HEADER_HEIGHT + insets.top + theme.spacing['3']}
        index={0}
        snapPoints={snapPoints}
        animateOnMount
        backdropComponent={backdropComponent}
        handleIndicatorStyle={globalStyles.bottomSheetHandleIndicator}
        backgroundStyle={[
          globalStyles.bottomSheetBackground,
          {backgroundColor: theme.colors.background},
        ]}
        containerStyle={[styles.bottomSheetContainer]}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainerStyle}>
          <VStack mb={theme.spacing['5']} gap={theme.spacing['6']}>
            <VStack gap={theme.spacing['2.5']}>
              <Input
                bg={theme.colors.surface}
                editable={false}
                value={from.name}
                h={theme.spacing['16']}
                leftElement={<Icon name="gps" color={theme.colors.gray5} />}
              />
              <Input
                bg={theme.colors.surface}
                editable={false}
                value={to.name}
                h={theme.spacing['16']}
                leftElement={<Icon name="pin" color={theme.colors.gray5} />}
              />
            </VStack>
            <VStack gap={theme.spacing['5']}>
              <Text family="product" size="lg">
                Route Details
              </Text>
              <DirectionRouteDetails route={transitRoute} />
            </VStack>
          </VStack>
          <VStack
            bg={theme.colors.surface}
            bw={StyleSheet.hairlineWidth}
            bc={theme.colors.border}
            br={theme.roundness}
            p={theme.spacing['4']}
            gap={theme.spacing['6']}>
            {transitRouteData.map((item, index, data) => {
              return (
                <DirectionCard
                  key={`direction-card-${
                    (item.step as ITransitPopulatedStops).route_id
                  }-${index}`}
                  transitStep={item as any}
                  isLast={index === data.length - 1}
                  onPress={onPressStop}
                />
              );
            })}
          </VStack>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
};

const stylesheet = createStyleSheet(theme => ({
  scrollViewContainerStyle: {
    paddingHorizontal: theme.spacing['5'],
    paddingBottom:
      UnistylesRuntime.insets.bottom + theme.spacing['5'] + theme.spacing['14'],
  },
  bottomSheetContainer: {
    zIndex: 12,
  },
  backdropContainer: {
    zIndex: 10,
  },
  bottomActionContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing['6'],
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing['2'],
    zIndex: 999,
  },
  stopActionButtonTitle: {
    color: theme.colors.error,
  },
}));

export default Directions;
