import {useQuery, UseQueryOptions} from '@tanstack/react-query';

import {getSuggestions} from '@api/suggestions';
import {ResponseError} from '@typescript/api';
import {ISuggestion} from '@typescript/api/suggestions';

export const useGetSuggestions = (
  options?: UseQueryOptions<ISuggestion[], ResponseError>,
) =>
  useQuery({
    ...options,
    queryKey: ['getSuggestions'],
    queryFn: getSuggestions,
  });
