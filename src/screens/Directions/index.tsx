import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {featureCollection, lineString} from '@turf/helpers';

import MapView, {Callout, Geojson, Marker, Region} from 'react-native-maps';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {BBox, FeatureCollection, Point} from 'geojson';
import useSupercluster from 'use-supercluster';

import {Container, MapCallout} from '@components/ui';
import {defaultMapProps} from '@configs/map';
import {useGetStops} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {useAppStore} from '@store/app';
import {useMapStore} from '@store/map';
import {ResponseFormat} from '@typescript/api';
import {IStop} from '@typescript/api/stops';
import {boundingBoxToBbox, convertFeatureToData} from '@utils/map';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Directions'
>;

const Directions = ({navigation, route}: Props) => {
  const {from, to, transitRoute} = route.params;

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

  /* Ref */
  const mapRef = useRef<MapView>(null);

  /* State */
  const [bounds, setBounds] = useState<BBox | null>(null);
  const [zoom, setZoom] = useState(0);

  /* Memo */
  const routeStopsGeoJSON = useMemo(() => {
    if (stopsGeoJSON) {
      return transitRoute.routes.flatMap(tr =>
        tr.stops.map(routeStopId =>
          stopsGeoJSON.features.find(sf => sf.id === routeStopId),
        ),
      );
    }

    return [];
  }, [stopsGeoJSON, transitRoute]);

  const transitRoutesGeoJSON = useMemo(() => {
    return featureCollection(
      transitRoute.routes.flatMap(({route_id, coordinates, ...prop}) =>
        lineString(
          coordinates.map(({lng, lat}) => [lng, lat]),
          prop,
          {
            id: route_id,
          },
        ),
      ),
    );
  }, [transitRoute.routes]);

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
      const regionBounds = await mapRef.current!.getMapBoundaries();
      const bbox = boundingBoxToBbox(regionBounds);

      setBounds(bbox);

      const regionZoom =
        Math.log2(360 * (width / 256 / region.longitudeDelta)) + 1;

      setZoom(regionZoom);
    },
    [width],
  );

  return (
    <Container
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}>
      <MapView
        ref={mapRef}
        initialRegion={map.lastRegion || undefined}
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
              <Callout tooltip>
                <MapCallout canPress={false}>{stop.name[app.language]}</MapCallout>
              </Callout>
            </Marker>
          );
        })}
        <Geojson
          geojson={transitRoutesGeoJSON}
          strokeColor={theme.colors.primary}
          strokeWidth={5}
        />
      </MapView>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  mapView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
}));

export default Directions;
