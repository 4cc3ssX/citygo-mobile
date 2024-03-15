import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet, useWindowDimensions} from 'react-native';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {featureCollection, lineString} from '@turf/helpers';

import MapView, {
  Callout,
  Geojson,
  LatLng,
  Marker,
  Region,
} from 'react-native-maps';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {BBox, FeatureCollection, Point} from 'geojson';
import {omit} from 'lodash';
import useSupercluster from 'use-supercluster';

import {Icon} from '@components/icons';
import {
  Button,
  Container,
  CustomBackdrop,
  FContainer,
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
import {globalStyles} from '@styles/global';
import {ResponseFormat} from '@typescript/api';
import {ITransit, TransitType} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

import {DirectionCard} from './components/DirectionCard';
import {DirectionRouteDetails} from './components/DirectionRouteDetails';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Directions'
>;

const Directions = ({navigation, route}: Props) => {
  const {from, to, transitRoute} = route.params;

  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  const {width} = useWindowDimensions();

  /* Store */
  const app = useAppStore();
  const map = useMapStore();

  /* Query */
  const {data: stops} = useGetStops();
  const {isFetching: isStopsFetching, data: stopsGeoJSON} = useGetStops<
    FeatureCollection<Point, IStop>
  >(ResponseFormat.GEOJSON);

  /* Ref */
  const mapRef = useRef<MapView>(null);
  const canCluster = useRef(false);

  /* Bottom Sheet */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '60%'], []);

  /* State */
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

  /* Memo */
  const transitRouteData = useMemo(() => {
    return transitRoute.transitSteps.map(r => {
      if (r.type === TransitType.WALK) {
        return r;
      }

      return {
        ...r,
        step: {
          ...r.step,
          stops: (r.step as ITransit).stops.map(
            s => stops?.find(stop => stop.id === s) as IStop,
          ),
        },
      };
    });
  }, [stops, transitRoute.transitSteps]);

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
      radius: 40,
      maxZoom: 20,
    },
  });

  /* Handlers */
  const handleRegionChange = useCallback(
    async (region: Region) => {
      if (!canCluster.current) {
        return;
      }

      const regionBounds = await mapRef.current!.getMapBoundaries();
      const bbox = boundingBoxToBbox(regionBounds);

      setBounds(bbox);

      const regionZoom =
        Math.log2(360 * (width / 256 / region.longitudeDelta)) + 1;

      setZoom(regionZoom);
    },
    [width],
  );

  const onPressStop = useCallback((stop: IStop) => {
    bottomSheetRef.current?.snapToIndex(0);

    // move to stop coordinate
    const region = Constants.getDefaultMapDelta(stop.lat, stop.lng);

    mapRef.current?.animateToRegion(region);
  }, []);

  const handleTransits = useCallback(() => {
    canCluster.current = true;

    // mapRef could be null on mount
    setTimeout(() => {
      // fit coords to map
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
    }, 10);
  }, [transitRoute.transitSteps]);

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
    <Container
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}>
      <FContainer px={theme.spacing['6']}>
        <Button size="lg" h={theme.spacing['12']}>
          Start
        </Button>
      </FContainer>
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
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainerStyle(insets)}>
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
                    (item.step as ITransit).route_id
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
      <MapView
        ref={mapRef}
        initialRegion={map.lastRegion || undefined}
        {...defaultMapProps}
        mapType="standard"
        userInterfaceStyle={themeName}
        onRegionChangeComplete={handleRegionChange}
        style={styles.mapView}>
        {clusters?.map((point, index) => {
          const properties = point.properties;

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
        {transitRoutesGeoJSON.map((geojson, index) => (
          <Geojson
            key={`geojson-transit-${index}`}
            geojson={geojson}
            strokeColor={geojson.features[0].properties.color}
            strokeWidth={5}
          />
        ))}
      </MapView>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  mapView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scrollViewContainerStyle: (insets: EdgeInsets) => ({
    paddingHorizontal: theme.spacing['5'],
    paddingBottom: insets.bottom + theme.spacing['5'] + theme.spacing['14'],
  }),
  bottomSheetContainer: {
    zIndex: 12,
  },
  backdropContainer: {
    zIndex: 10,
  },
}));

export default Directions;
