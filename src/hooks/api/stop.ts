import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import {getNearestStops, getPaginatedStops, getStops} from '@api/stop';
import {ResponseError, ResponseFormat} from '@typescript/api';
import {GetNearestStops} from '@typescript/api/request';
import {IStop} from '@typescript/api/stops';

export const useGetNearestStops = (
  options?: UseMutationOptions<IStop[], ResponseError, GetNearestStops>,
) =>
  useMutation({
    ...options,
    mutationKey: ['nearestStops'],
    mutationFn: getNearestStops,
  });

export const useGetStops = <T = IStop[]>(
  format: ResponseFormat = ResponseFormat.JSON,
  options?: UseQueryOptions<T, ResponseError>,
) =>
  useQuery({
    ...options,
    queryKey: ['stops', format],
    queryFn: () => getStops<T>(format),
  });

export const useGetPaginatedStops = () =>
  useInfiniteQuery({
    queryKey: ['stops', 'pagination'],
    queryFn: ({pageParam}) => getPaginatedStops(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.metadata?.nextPage,
    getPreviousPageParam: firstPage => firstPage.metadata?.prevPage,
  });
