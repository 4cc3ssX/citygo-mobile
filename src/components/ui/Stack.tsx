import React, {memo, useMemo} from 'react';
import {
  ColorValue,
  DimensionValue,
  FlexStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {isUndefined, omit, omitBy, pick} from 'lodash';

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
  'overflow',
] as const;

export type StackStyle = Pick<FlexStyle, (typeof FlexStyleKeys)[number]>;

export interface IStackProps extends ViewProps, StackStyle {
  maxW?: DimensionValue;
  minH?: DimensionValue;
  w?: DimensionValue;
  h?: DimensionValue;
  bg?: ColorValue;
  br?: number;
  bw?: number;
  bc?: ColorValue;
  p?: number;
  pt?: number;
  pb?: number;
  pr?: number;
  pl?: number;
  px?: number;
  py?: number;
}

export const Stack = memo(
  ({
    maxW,
    minH,
    w,
    h,
    bg,
    br,
    bw,
    bc,
    p,
    pt,
    pb,
    pr,
    pl,
    px,
    py,
    style,
    ...rest
  }: IStackProps) => {
    const flexStyles = useMemo(() => pick(rest, FlexStyleKeys), [rest]);
    const props = useMemo(() => omit(rest, FlexStyleKeys), [rest]);

    return (
      <View
        style={[
          style,
          flexStyles,
          omitBy<ViewStyle>(
            {
              maxWidth: maxW,
              minHeight: minH,
              width: w,
              height: h,
              backgroundColor: bg,
              borderRadius: br,
              borderWidth: bw,
              borderColor: bc,
              padding: p,
              paddingTop: pt,
              paddingBottom: pb,
              paddingLeft: pl,
              paddingRight: pr,
              paddingHorizontal: px,
              paddingVertical: py,
            },
            isUndefined,
          ),
        ]}
        {...props}
      />
    );
  },
);
