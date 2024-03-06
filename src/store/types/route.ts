import {ITransitRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';

export interface IRecentRoute extends ITransitRoute {
  recentRoutes: any;
  from: IStop;
  to: IStop;
}
