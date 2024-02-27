import React from 'react';

import Svg, {G, Rect} from 'react-native-svg';

import {IIconProps} from './Icon';

export const ServicesIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 19 19" fill="none" {...props}>
      <Rect
        width={7}
        height={7}
        x={1}
        y={1}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        rx={2.5}
      />
      <Rect
        width={7}
        height={7}
        x={1}
        y={11}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        rx={2.5}
      />
      <Rect
        width={7}
        height={7}
        x={11}
        y={1}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        rx={2.5}
      />
      <Rect
        width={7}
        height={7}
        x={11}
        y={11}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        rx={2.5}
      />
    </Svg>
  );
};

export const ServicesOutlineIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 19 19" fill="none" {...props}>
      <G stroke="currentColor" strokeWidth={1.5}>
        <Rect width={7} height={7} x={1} y={1} rx={2.5} />
        <Rect width={7} height={7} x={1} y={11} rx={2.5} />
        <Rect width={7} height={7} x={11} y={1} rx={2.5} />
        <Rect width={7} height={7} x={11} y={11} rx={2.5} />
      </G>
    </Svg>
  );
};

export {ServicesIcon as services, ServicesOutlineIcon as servicesOutline};
