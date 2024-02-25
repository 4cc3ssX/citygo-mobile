import React, {memo} from 'react';
import {ViewProps} from 'react-native';

import {Stack, StackStyle} from './Stack';

export interface IVStackProps
  extends ViewProps,
    Omit<StackStyle, 'flexDirection'> {}

export const VStack = memo((props: IVStackProps) => {
  return <Stack flexDirection="column" {...props} />;
});
