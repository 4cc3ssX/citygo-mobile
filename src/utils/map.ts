import {BoundingBox} from 'react-native-maps';

import {Feature, Point} from 'geojson';

export const boundingBoxToBbox = (
  boundingBox: BoundingBox,
): [number, number, number, number] => {
  const {northEast, southWest} = boundingBox;
  return [
    southWest.longitude,
    southWest.latitude,
    northEast.longitude,
    northEast.latitude,
  ];
};

export const convertFeatureToData = <T>(feature: Feature<Point, T>): T => {
  return {
    id: feature.id,
    ...feature.properties,
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
  };
};
