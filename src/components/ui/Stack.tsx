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
  minW?: DimensionValue;
  maxH?: DimensionValue;
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
  mt?: number;
  mb?: number;
  mr?: number;
  ml?: number;
  mx?: number;
  my?: number;
}

export const Stack = memo(
  ({
    maxW,
    minW,
    maxH,
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
    mt,
    mb,
    mr,
    ml,
    mx,
    my,
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
              minWidth: minW,
              maxHeight: maxH,
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
              marginTop: mt,
              marginBottom: mb,
              marginRight: mr,
              marginLeft: ml,
              marginHorizontal: mx,
              marginVertical: my,
            },
            isUndefined,
          ),
        ]}
        {...props}
      />
    );
  },
);
