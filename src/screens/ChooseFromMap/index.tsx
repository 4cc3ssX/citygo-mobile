import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import Geolocation from 'react-native-geolocation-service';
import MapView, {Callout, Marker, Region} from 'react-native-maps';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import Color from 'color';
import {BBox, FeatureCollection, Point} from 'geojson';
import useSupercluster from 'use-supercluster';

import {Icon} from '@components/icons';
import {Container, IconButton, MapCallout, VStack} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {Constants} from '@constants';
import {useGetStops} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {useStopStore} from '@store/stop';
import {ResponseFormat} from '@typescript/api';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'ChooseFromMap'
>;

const ChooseFromMap = ({navigation, route}: Props) => {
  const {initialRegion, prevRouteName, prevRouteProps} = route.params;

  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

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
  const [isLocating, setIsLocating] = useState(false);
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

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
  const onPressMarkerHandler = useCallback(
    (stop: IStop) => {
      navigation.navigate(prevRouteName, {
        ...prevRouteProps,
        stop,
      });
    },
    [navigation, prevRouteName, prevRouteProps],
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

  const onLocateMe = useCallback(() => {
    setIsLocating(true);

    Geolocation.getCurrentPosition(
      ({coords}) => {
        const region = Constants.getDefaultMapDelta(
          coords.latitude,
          coords.longitude,
        );

        mapRef.current?.animateToRegion(region);

        setTimeout(() => {
          setIsLocating(false);
        }, 500);
      },
      () => {
        setIsLocating(false);
      },
      {
        accuracy: {
          android: 'low',
          ios: 'bestForNavigation',
        },
        maximumAge: 5000,
      },
    );
  }, []);

  useEffect(() => {
    if (!initialRegion) {
      onLocateMe();
    } else {
      mapRef.current?.animateToRegion(initialRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
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
    bottom: insets.bottom + theme.spacing['10'],
    zIndex: 8,
  }),
  disabledButton: (color: string) => ({
    backgroundColor: Color(color).lighten(0.25).string(),
  }),
}));

export default ChooseFromMap;
