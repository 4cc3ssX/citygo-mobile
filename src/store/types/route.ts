import {ITransitRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';

export interface IRecentRoute extends ITransitRoute {
  from: IStop;
  to: IStop;
  startTime: number;
  endTime: number;
}
