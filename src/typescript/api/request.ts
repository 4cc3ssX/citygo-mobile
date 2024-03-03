import {DistanceUnits} from '@helpers/validations';

import {ResponseFormat} from './response';

export interface GetNearestStops {
  lat: number;
  lng: number;
  distance_unit?: DistanceUnits;
  format?: ResponseFormat;
  count?: number;
}
