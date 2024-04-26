import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import {findRoutes, getRouteById, getRoutes} from '@api/routes';
import {UnableToFindRoutes} from '@errors/routes';
import {ResponseError, ResponseErrors, ResponseFormat} from '@typescript/api';
import {IFindRoutes} from '@typescript/api/request';
import {IRoute, ITransitRoute} from '@typescript/api/routes';

export const useGetRoutes = (
  options?: UseQueryOptions<IRoute[], ResponseError>,
) =>
  useQuery<IRoute[], ResponseError>({
    ...options,
    queryKey: ['getRoutes'],
    queryFn: getRoutes,
  });

export const useGetRouteById = <T = IRoute>(
  format: ResponseFormat = ResponseFormat.JSON,
  options?: UseMutationOptions<T, ResponseErrors, {id: string}>,
) =>
  useMutation({
    ...options,
    mutationKey: ['getRouteById', format],
    mutationFn: ({id}: {id: string}) => getRouteById<T>(id, format),
  });

export const useFindRoutes = (
  options?: UseMutationOptions<
    ITransitRoute[],
    UnableToFindRoutes,
    IFindRoutes
  >,
) =>
  useMutation({
    ...options,
    mutationKey: ['findRoutes'],
    mutationFn: findRoutes,
  });
