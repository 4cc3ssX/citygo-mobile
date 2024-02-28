import React from 'react';

import Svg, {G, Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const BellBrokenIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 18" fill="none" {...props}>
      <G stroke="currentColor" strokeLinecap="round" strokeWidth={1.25}>
        <Path d="M5.068 1.5a5.073 5.073 0 0 1 7.86 4.24v1.743c0 .917.59 1.719 1.06 2.506.247.414.389.898.389 1.415 0 1.336-.955 2.482-2.278 2.665-1.314.183-2.955.366-4.244.366-1.289 0-2.93-.183-4.244-.366-1.323-.183-2.278-1.329-2.278-2.665 0-.517.142-1 .389-1.415.47-.787 1.06-1.59 1.06-2.506V5.739c0-.693.14-1.353.39-1.954M9.667 16.362a2.172 2.172 0 0 1-3.623 0" />
      </G>
    </Svg>
  );
};

export {BellBrokenIcon as bellBroken};
