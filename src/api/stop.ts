import {routes} from '@constants/api';
import {createRequest} from '@helpers/request';
import {GetNearestStops} from '@typescript/api/request';
import {IResponse, ResponseFormat} from '@typescript/api/response';
import {IStop} from '@typescript/api/stops';

export const getNearestStops = async (params: GetNearestStops) => {
  const {axios} = createRequest();

  const {data} = await axios.get<IResponse<IStop[]>>(routes.nearestStops, {
    params,
  });

  if (data.status !== 'ok') {
    throw data.error || data.errors;
  }

  return data.data;
};

export const getStops = async <T = IStop[]>(
  format: ResponseFormat = ResponseFormat.JSON,
): Promise<T> => {
  const {axios} = createRequest();

  const {data} = await axios.get<IResponse<T>>(
    `${routes.stops}?format=${format}`,
  );

  if (data.status !== 'ok') {
    throw data.error || data.errors;
  }

  return data.data;
};
