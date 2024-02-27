import React, {memo, useMemo} from 'react';
import {
  ColorValue,
  DimensionValue,
  FlexStyle,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';

import {omit, pick} from 'lodash';

export const FlexStyleKeys = [
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

export interface IStackProps extends ViewProps, StackStyle {
  w?: DimensionValue;
  h?: DimensionValue;
  bg?: ColorValue;
}

export const Stack = memo(({w, h, bg, style, ...rest}: IStackProps) => {
  const flexStyles = useMemo(() => pick(rest, FlexStyleKeys), [rest]);
  const props = useMemo(() => omit(rest, FlexStyleKeys), [rest]);

  return (
    <View
      style={StyleSheet.flatten([
        flexStyles,
        {width: w, height: h, backgroundColor: bg},
        style,
      ])}
      {...props}
    />
  );
});
