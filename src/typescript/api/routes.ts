import {ReplaceValueByType} from '@typescript';

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
  route: Omit<IRoute, 'stops' | 'coordinates'>[];
  transitSteps: ITransitSteps[];
  coordinates: ICoordinates[];
  distance: number;
}

export enum ITransitType {
  TRANSIT = 'transit',
  WALK = 'walk',
}

export interface ITransitSteps {
  [ITransitType.TRANSIT]: ITransitStop;
  [ITransitType.WALK]?: ITransitWalk;
}

export interface ITransitStop {
  id: string;
  stops: number[];
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
