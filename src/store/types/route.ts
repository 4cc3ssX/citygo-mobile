import {ITransitRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';

export interface IRecentRoute extends ITransitRoute {
  from: IStop;
  to: IStop;
  startTime: number;
  endTime: number | null;
}

export interface IBookmarkRoute extends ITransitRoute {
  groupId: string | null;
  from: IStop;
  to: IStop;
  startTime: number;
  endTime: number | null;
}

export interface IBookmarkGroup {
  id: string;
  name: string;
}
