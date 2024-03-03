import React from 'react';

import Svg, {Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const BusIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 23 23" fill="none" {...props}>
      <Path
        fill="currentColor"
        d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-3-8-3s-8-.5-8 3v10Zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17Zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Zm1.5-7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3Z"
      />
      <Path fill="currentColor" d="M10 0h1v3h-1zM13 0h1v3h-1z" />
    </Svg>
  );
};

export {BusIcon as bus};
