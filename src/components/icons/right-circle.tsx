import React from 'react';

import Svg, {Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const RightCircleIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30" fill="none" {...props}>
      <Path
        fill="currentColor"
        fillRule="evenodd"
        d="M30 15c0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15Zm-11.716 1.125-2.58 2.58a1.125 1.125 0 0 0 1.591 1.59l3.44-3.439a2.625 2.625 0 0 0 0-3.712l-3.44-3.44a1.125 1.125 0 0 0-1.59 1.591l2.579 2.58H9a1.125 1.125 0 0 0 0 2.25h9.284Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export {RightCircleIcon as rightCircleIcon};
