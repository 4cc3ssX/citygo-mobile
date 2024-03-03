import React from 'react';

import Svg, {Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const ChevronRightIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 16" fill="none" {...props}>
      <Path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="m1 15 5.33-6.219a1.2 1.2 0 0 0 0-1.562L1 1"
      />
    </Svg>
  );
};

export {ChevronRightIcon as chevronRightIcon};
