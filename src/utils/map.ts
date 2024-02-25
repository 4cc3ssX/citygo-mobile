import {Region} from 'react-native-maps';

import {ICoordinates} from '@typescript/api';
import {IStop} from '@typescript/api/stops';

export function getDelta(lat: number, lng: number, distance: number): Region {
  distance = distance / 2;
  const circumference = 40075;
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
  const angularDistance = distance / circumference;

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
  const longitudeDelta = Math.abs(
    Math.atan2(
      Math.sin(angularDistance) * Math.cos(lat),
      Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat),
    ),
  );

  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta,
    longitudeDelta,
  };
}

export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  // Haversine formula for accurate distance calculation
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180; // Convert to radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function filterStopsWithinRadius(
  at: ICoordinates,
  stops: IStop[],
  radius: number,
): IStop[] {
  const filteredItems: IStop[] = [];

  for (const stop of stops) {
    const distance = haversine(at.lat, at.lng, stop.lat, stop.lng);
    if (distance <= radius) {
      filteredItems.push(stop);
    }
  }

  return filteredItems;
}
