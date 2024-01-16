import {useMemo} from 'react';

import {createRequest, IRequestProps} from '@helpers/request';

export const useRequest = (props?: Omit<IRequestProps, 'token'>) => {
  return useMemo(() => createRequest({isPrivate: true, ...props}), [props]);
};
