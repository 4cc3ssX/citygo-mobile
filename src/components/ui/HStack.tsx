import React, {memo} from 'react';

import {IStackProps, Stack} from './Stack';

export interface IHStackProps extends Omit<IStackProps, 'flexDirection'> {}

export const HStack = memo((props: IHStackProps) => {
  return <Stack flexDirection="row" {...props} />;
});
