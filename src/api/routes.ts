import {routes} from '@constants/api';
import {UnableToFindRoutes} from '@errors/routes';
import {createRequest} from '@helpers/request';
import {IResponse, ResponseFormat} from '@typescript/api';
import {IFindRoutes} from '@typescript/api/request';
import {IRoute, ITransitRoute} from '@typescript/api/routes';

export const getRoutes = async () => {
  const {axios} = createRequest();

  const {data} = await axios.get<IResponse<IRoute[]>>(routes.routes);

  if (data.status !== 'ok') {
    throw data.error || data.errors;
  }

  return data.data;
};

export const getRouteById = async <T = IRoute>(
  id: string,
  format: ResponseFormat = ResponseFormat.JSON,
): Promise<T> => {
  const {axios} = createRequest();

  const {data} = await axios.get<IResponse<T>>(
    `${routes.routes}/${id}?format=${format}`,
  );

  if (data.status !== 'ok') {
    throw data.error || data.errors;
  }

  return data.data;
};

export const findRoutes = async (values: IFindRoutes) => {
  const {axios} = createRequest();

  const {data} = await axios.post<IResponse<ITransitRoute[]>>(
    routes.findRoutes,
    values,
  );

  if (data.status !== 'ok') {
    if (data.error) {
      throw new UnableToFindRoutes(data.error.message);
    }
  }

  return data.data;
};
