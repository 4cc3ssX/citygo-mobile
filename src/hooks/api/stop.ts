import {useQuery, UseQueryOptions} from '@tanstack/react-query';

import {getStops} from '@api/stop';
import {ResponseError} from '@typescript/api';
import {IStop} from '@typescript/api/stops';

export const useGetStops = (
  options?: UseQueryOptions<IStop[], ResponseError>,
) =>
  useQuery<IStop[], ResponseError>({
    ...options,
    queryKey: ['stops'],
    queryFn: getStops,
  });
