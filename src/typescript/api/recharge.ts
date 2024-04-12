import {ReplaceValueByType} from '@typescript';

import {ICoordinates, ILocalizedString} from '.';

export interface IRecharge extends ICoordinates {
  /**
   * The ID of the recharge station
   */
  id: number;
  /**
   * The name of the recharge station
   */
  name: ILocalizedString;
  /**
   * The road name of the recharge station
   */
  road: ILocalizedString;
  /**
   * The township name of the recharge station
   */
  township: ILocalizedString;
}

export type IRechargeSearchType = Pick<
  Partial<ReplaceValueByType<IRecharge, ILocalizedString, string>>,
  'name' | 'road' | 'township'
>;
