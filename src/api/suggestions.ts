import {routes} from '@constants/api';
import {createRequest} from '@helpers/request';
import {IResponse} from '@typescript/api';
import {ISuggestion} from '@typescript/api/suggestions';

export const getSuggestions = async <T = ISuggestion[]>(): Promise<T> => {
  const {axios} = createRequest();

  const {data} = await axios.get<IResponse<T>>(routes.suggestions);

  if (data.status !== 'ok') {
    throw data.error || data.errors;
  }

  return data.data;
};
