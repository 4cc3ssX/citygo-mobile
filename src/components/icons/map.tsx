import React from 'react';

import Svg, {Circle, G, Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const MapIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 22" fill="none" {...props}>
      <Path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        d="M17 9.417C17 14.845 10.6 20.5 9 20.5c-1.6 0-8-5.655-8-11.083C1 5.044 4.582 1.5 9 1.5s8 3.544 8 7.917Z"
      />
      <Circle
        cx={3}
        cy={3}
        r={3}
        stroke="#F6F6F6"
        strokeWidth={1.5}
        transform="matrix(-1 0 0 1 12 6)"
      />
    </Svg>
  );
};

export const MapOutlineIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 22" fill="none" {...props}>
      <G stroke="currentColor" strokeWidth={1.5}>
        <Path d="M17 9.417C17 14.845 10.6 20.5 9 20.5c-1.6 0-8-5.655-8-11.083C1 5.044 4.582 1.5 9 1.5s8 3.544 8 7.917Z" />
        <Circle cx={3} cy={3} r={3} transform="matrix(-1 0 0 1 12 6)" />
      </G>
    </Svg>
  );
};

export {MapIcon as map, MapOutlineIcon as mapOutline};
