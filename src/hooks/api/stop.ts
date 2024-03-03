import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import {getNearestStops, getStops} from '@api/stop';
import {ResponseError, ResponseFormat} from '@typescript/api';
import {GetNearestStops} from '@typescript/api/request';
import {IStop} from '@typescript/api/stops';

export const useGetNearestStops = (
  options?: UseMutationOptions<IStop[], ResponseError, GetNearestStops>,
) =>
  useMutation<IStop[], ResponseError, GetNearestStops>({
    ...options,
    mutationKey: ['nearestStops'],
    mutationFn: getNearestStops,
  });

export const useGetStops = <T = IStop[]>(
  format: ResponseFormat = ResponseFormat.JSON,
  options?: UseQueryOptions<T, ResponseError>,
) =>
  useQuery<T, ResponseError>({
    ...options,
    queryKey: ['stops', format],
    queryFn: () => getStops<T>(format),
  });
