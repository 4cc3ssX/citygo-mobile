import React from 'react';

import Svg, {Circle} from 'react-native-svg';

import {IIconProps} from './Icon';

export const MarkerIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...props}>
      <Circle
        cx={11}
        cy={11}
        r={9.263}
        fill="#417CEF"
        stroke="#fff"
        strokeWidth={2.526}
      />
    </Svg>
  );
};

export {MarkerIcon as marker};
