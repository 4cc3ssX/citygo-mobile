import React from 'react';

import Svg, {Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const GPSIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 23 23" fill="none" {...props}>
      <Path
        fill="currentColor"
        d="M9.61 19.098a.842.842 0 0 1-.78.534c-.082 0-.205 0-.287-.04-3.122-1.11-5.298-3.985-5.627-7.27H.821A.824.824 0 0 1 0 11.5c0-.452.37-.821.821-.821h2.095c.37-4.108 3.655-7.393 7.763-7.763V.821c0-.451.37-.821.821-.821.452 0 .821.37.821.821v2.875c0 .452-.37.822-.821.822A6.976 6.976 0 0 0 4.518 11.5c0 2.916 1.848 5.545 4.6 6.571.41.165.616.616.493 1.027Zm12.569-8.42h-2.095a8.521 8.521 0 0 0-5.38-7.187.834.834 0 0 0-1.068.452.834.834 0 0 0 .452 1.068 6.956 6.956 0 0 1 4.394 6.489 6.976 6.976 0 0 1-6.982 6.982.824.824 0 0 0-.821.822v2.875c0 .451.37.821.821.821.452 0 .821-.37.821-.821v-2.095c4.108-.37 7.393-3.655 7.763-7.763h2.095c.451 0 .821-.37.821-.821a.824.824 0 0 0-.821-.821ZM11.5 6.983a4.505 4.505 0 0 1 4.518 4.518 4.505 4.505 0 0 1-4.518 4.518A4.505 4.505 0 0 1 6.982 11.5 4.505 4.505 0 0 1 11.5 6.982Zm0 3.286a1.21 1.21 0 0 0-1.232 1.232 1.21 1.21 0 0 0 1.232 1.232 1.21 1.21 0 0 0 1.232-1.232 1.21 1.21 0 0 0-1.232-1.232Z"
      />
    </Svg>
  );
};

export {GPSIcon as gps};