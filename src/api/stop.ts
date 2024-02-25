import {routes} from '@constants/api';
import {createRequest} from '@helpers/request';
import {IResponse} from '@typescript/api/response';
import {IStop} from '@typescript/api/stops';

export const getStops = async (): Promise<IStop[]> => {
  const {axios} = createRequest();

  const {data} = await axios.get<IResponse<IStop[]>>(routes.stops);

  if (data.status !== 'ok') {
    throw data.error;
  }

  return data.data;
};
