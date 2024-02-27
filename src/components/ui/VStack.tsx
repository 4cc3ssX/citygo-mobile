import React, {memo} from 'react';

import {IStackProps, Stack} from './Stack';

export interface IVStackProps extends Omit<IStackProps, 'flexDirection'> {}

export const VStack = memo((props: IVStackProps) => {
  return <Stack flexDirection="column" {...props} />;
});
