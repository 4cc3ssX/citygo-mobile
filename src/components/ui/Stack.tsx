import React, {memo, useMemo} from 'react';
import {FlexStyle, View, ViewProps} from 'react-native';

import {omit, pick} from 'lodash';

export const FlexStyleKeys: (keyof FlexStyle)[] = [
  'flex',
  'flexDirection',
  'alignContent',
  'alignItems',
  'alignSelf',
  'justifyContent',
  'flexWrap',
  'gap',
  'rowGap',
  'columnGap',
] as const;

export type StackStyle = Pick<FlexStyle, (typeof FlexStyleKeys)[number]>;

export interface IStackProps extends ViewProps, StackStyle {}

export const Stack = memo(({style, ...rest}: IStackProps) => {
  const flexStyles = useMemo(() => pick(rest, FlexStyleKeys), [rest]);
  const props = useMemo(() => omit(rest, FlexStyleKeys), [rest]);

  return <View style={[flexStyles, style]} {...props} />;
});
