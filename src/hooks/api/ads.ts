import {useQuery, UseQueryOptions} from '@tanstack/react-query';

import {getAds} from '@api/ads';
import {ResponseError} from '@typescript/api';
import {IAds} from '@typescript/api/ads';

export const useGetAds = (options?: UseQueryOptions<IAds[], ResponseError>) =>
  useQuery({
    ...options,
    queryKey: ['getAds'],
    queryFn: getAds,
  });
