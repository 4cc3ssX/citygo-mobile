import React from 'react';

import Svg, {Circle, Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const UserIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 18" fill="none" {...props}>
      <Circle
        cx={3.489}
        cy={3.489}
        r={3.489}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.308}
        transform="matrix(-1 0 0 1 10.956 1.617)"
      />
      <Path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.308}
        d="M1.361 13.771c0-.75.472-1.42 1.179-1.672a14.65 14.65 0 0 1 9.854 0 1.776 1.776 0 0 1 1.178 1.672v1.148a1.702 1.702 0 0 1-1.942 1.685l-.833-.12a23.55 23.55 0 0 0-6.66 0l-.833.12a1.702 1.702 0 0 1-1.943-1.685V13.77Z"
      />
    </Svg>
  );
};

export {UserIcon as user};
