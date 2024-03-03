import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import {findRoutes, getRoutes} from '@api/routes';
import {FindRouteValues} from '@helpers/validations';
import {ResponseError, ResponseErrors} from '@typescript/api';
import {IRoute, ITransitRoute} from '@typescript/api/routes';

export const useGetRoutes = (
  options?: UseQueryOptions<IRoute[], ResponseError>,
) =>
  useQuery<IRoute[], ResponseError>({
    ...options,
    queryKey: ['stops'],
    queryFn: getRoutes,
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
