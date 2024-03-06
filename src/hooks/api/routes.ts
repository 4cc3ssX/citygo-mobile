import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import {findRoutes, getRouteById, getRoutes} from '@api/routes';
import {FindRouteValues} from '@helpers/validations';
import {ResponseError, ResponseErrors, ResponseFormat} from '@typescript/api';
import {IRoute, ITransitRoute} from '@typescript/api/routes';

export const useGetRoutes = (
  options?: UseQueryOptions<IRoute[], ResponseError>,
) =>
  useQuery<IRoute[], ResponseError>({
    ...options,
    queryKey: ['routes'],
    queryFn: getRoutes,
  });

export const useGetRouteById = <T = IRoute>(
  format: ResponseFormat = ResponseFormat.JSON,
  options?: UseMutationOptions<T, ResponseErrors, {id: string}>,
) =>
  useMutation<T, ResponseErrors, {id: string}>({
    ...options,
    mutationKey: ['getRouteById', format],
    mutationFn: ({id}: {id: string}) => getRouteById<T>(id, format),
  });
export const useFindRoutes = (
  options?: UseMutationOptions<
    ITransitRoute[],
    ResponseErrors,
    FindRouteValues
  >,
) =>
  useMutation<ITransitRoute[], ResponseErrors, FindRouteValues>({
    ...options,
    mutationKey: ['findRoutes'],
    mutationFn: findRoutes,
  });
