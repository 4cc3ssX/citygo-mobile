import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {toast} from '@baronha/ting';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import MapView, {Callout, Marker, Region} from 'react-native-maps';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';

import Color from 'color';
import {BBox, FeatureCollection, Point} from 'geojson';
import useSupercluster from 'use-supercluster';

import {MapCallout} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {useGetStops} from '@hooks/api';
import {useAppContext} from '@hooks/context';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {useStopStore} from '@store/stop';
import {ResponseFormat} from '@typescript/api';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

import StopCard from './components/StopCard';

type Props = NativeStackScreenProps<RootStackParamsList, 'ChooseFromMap'>;

const ChooseFromMap = ({navigation, route}: Props) => {
  const {initialRegion, prevRouteName, prevRouteProps} = route.params;

  const themeName = useThemeName();
  const {styles} = useStyles(stylesheet);

  const {locatePosition} = useAppContext();

  const {width} = useWindowDimensions();

  /* Store */
  const app = useAppStore();
  const map = useMapStore();
  const stopStore = useStopStore();

  /* Query */
  const {isFetching, data: stops} = useGetStops<
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

  /* State */
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

  const [currentStop, setCurrentStop] = useState<IStop | null>(null);

  /* Hooks */
  const {clusters} = useSupercluster({
    points: stops?.features || [],
    bounds: bounds || undefined,
    zoom,
    disableRefresh: isFetching,
    options: {
      radius: 35,
      maxZoom: 20,
    },
  });

  /* Handlers */
  const onConfirm = useCallback(
    (stop: IStop) => {
      navigation.navigate(prevRouteName, {
        ...prevRouteProps,
        stop,
      });
    },
    [navigation, prevRouteName, prevRouteProps],
  );

  const onPressMarkerHandler = useCallback((stop: IStop) => {
    setCurrentStop(stop);
  }, []);

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
    toast({
      title: 'Loading...',
      preset: 'spinner',
      duration: 0.5,
    });

    const {region} = await locatePosition();

    mapRef.current?.animateToRegion(region);
  }, [locatePosition]);

  useEffect(() => {
    if (!initialRegion) {
      onLocateMe();
    } else {
      mapRef.current?.animateToRegion(initialRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              image={{uri: 'marker'}}
              onSelect={() => onPressMarkerHandler(stop)}
              onDeselect={() => setCurrentStop(null)}>
              <Callout tooltip>
                <MapCallout canPress={false}>
                  {stop.name[app.language]}
                </MapCallout>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      {currentStop ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={styles.bottomActionContainer}>
          <StopCard stop={currentStop} onPress={onConfirm} />
        </Animated.View>
      ) : null}
    </>
  );
};

const stylesheet = createStyleSheet(theme => ({
  disabledButton: (color: string) => ({
    backgroundColor: Color(color).lighten(0.25).string(),
  }),
  bottomActionContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing['6'],
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing['2'],
    zIndex: 999,
  },
}));

export default ChooseFromMap;
