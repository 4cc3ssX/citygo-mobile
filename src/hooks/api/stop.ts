import {
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import {Optional} from 'utility-types';

import {getNearestStops, getPaginatedStops, getStops} from '@api/stop';
import {ResponseError, ResponseFormat} from '@typescript/api';
import {GetNearestStops} from '@typescript/api/request';
import {IStop} from '@typescript/api/stops';

export const useGetNearestStops = (
  options?: UseMutationOptions<IStop[], ResponseError, GetNearestStops>,
) =>
  useMutation({
    ...options,
    mutationKey: ['getNearestStops'],
    mutationFn: getNearestStops,
  });

export const useGetStops = <T = IStop[]>(
  format: ResponseFormat = ResponseFormat.JSON,
  options?: Optional<DefinedInitialDataOptions<T, ResponseError>, 'queryKey'>,
  onSuccess?: (data: T) => void,
) =>
  useQuery({
    ...options,
    queryKey: ['getStops', format],
    queryFn: () => getStops<T>(format, onSuccess),
  }) as DefinedUseQueryResult<T, ResponseError>;

export const useGetPaginatedStops = () =>
  useInfiniteQuery({
    queryKey: ['getPaginatedStops'],
    queryFn: ({pageParam}) => getPaginatedStops(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.metadata?.nextPage,
    getPreviousPageParam: firstPage => firstPage.metadata?.prevPage,
  });
