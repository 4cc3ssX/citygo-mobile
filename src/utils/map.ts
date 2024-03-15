import {BoundingBox, EdgePadding} from 'react-native-maps';

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

export const getDynamicFitByBottomSheet = (
  initial: EdgePadding,
  index: number,
): EdgePadding => {
  if (index === 0) {
    return initial;
  }

  const top = initial.top * index;
  const bottom = initial.bottom * index;
  const right = initial.right * index;
  const left = initial.left * index;

  return {
    top,
    right,
    left,
    bottom,
  };
};
