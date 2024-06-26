import {routes} from '@constants/api';
import {createRequest} from '@helpers/request';
import {IResponse} from '@typescript/api';
import {IAds} from '@typescript/api/ads';

export const getAds = async <T = IAds[]>(): Promise<T> => {
  const {axios} = createRequest();

  const {data} = await axios.get<IResponse<T>>(routes.ads);

  if (data.status !== 'ok') {
    throw data.error || data.errors;
  }

  return data.data;
};
