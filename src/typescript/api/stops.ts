import {ReplaceValueByType} from '@typescript';

import {ICoordinates, ILocalizedString} from '.';

export interface IStop extends ICoordinates {
  /**
   * The ID of the stop
   */
  id: number;
  /**
   * The name of the stop
   */
  name: ILocalizedString;
  /**
   * The road name of the stop
   */
  road: ILocalizedString;
  /**
   * The township name of the stop
   */
  township: ILocalizedString;
}

export type IStopSearchType = Pick<
  Partial<ReplaceValueByType<IStop, ILocalizedString, string>>,
  'id' | 'name' | 'road' | 'township'
>;
