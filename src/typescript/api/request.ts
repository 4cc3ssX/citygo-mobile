import {DistanceUnits} from '@helpers/validations';

import {ResponseFormat} from './response';
import {ISearchStops} from './stops';
import {ICoordinates} from '.';

export interface GetNearestStops {
  lat: number;
  lng: number;
  distance_unit?: DistanceUnits;
  format?: ResponseFormat;
  count?: number;
}

export interface PreferSearch extends Omit<ISearchStops, 'id'> {
  position?: ICoordinates | undefined;
}

export interface IFindRoutes {
  from: PreferSearch;
  to: PreferSearch;
}
