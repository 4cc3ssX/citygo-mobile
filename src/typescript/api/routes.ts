import {ReplaceValueByType} from '..';

import {IStop} from './stops';
import {ICoordinates, ILocalizedString} from '.';

export interface IRoute {
  /**
   * The ID of the bus agency.
   */
  agency_id: string;
  /**
   * The gate name of the bus.
   */
  name: ILocalizedString;
  /**
   * The color of the bus line.
   */
  color: string;
  /**
   * The ID of the bus line.
   */
  route_id: string;
  /**
   * The IDs of the bus stop.
   */
  stops: number[];
  /**
   * The bus route LineString coordinates of the bus line.
   */
  coordinates: ICoordinates[];
}

export interface ITransitRoute {
  id: string;
  transitSteps: ITransitStep[];
}

export enum TransitType {
  TRANSIT = 'transit',
  WALK = 'walk',
}

export interface ITransitStep<T = ITransit> {
  type: TransitType;
  step: T | ITransitWalk;
  distance: number;
}

export interface ITransit extends IRoute {}

export interface ITransitPopulatedStops extends Omit<ITransit, 'stops'> {
  stops: IStop[];
}

export interface ITransitWalk {
  from: ICoordinates;
  to: ICoordinates;
}

export interface ITransferPoint {
  stop: number;
  routes: IRoute[];
}

export type IRouteSearchType = Pick<
  Partial<ReplaceValueByType<IRoute, ILocalizedString, string>>,
  'name' | 'route_id' | 'stops'
>;
