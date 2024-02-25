import React, {memo} from 'react';
import {ViewProps} from 'react-native';

import {Stack, StackStyle} from './Stack';

export interface IHStackProps
  extends ViewProps,
    Omit<StackStyle, 'flexDirection'> {}

export const HStack = memo((props: IHStackProps) => {
  return <Stack flexDirection="row" {...props} />;
});
