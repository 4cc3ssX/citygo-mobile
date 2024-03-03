import React from 'react';

import Svg, {Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const BookmarkIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 22" fill="none" {...props}>
      <Path
        stroke="currentColor"
        d="M1.25 6A4.75 4.75 0 0 1 6 1.25h6A4.75 4.75 0 0 1 16.75 6v13.168c0 1.385-1.532 2.221-2.696 1.472l-4.378-2.814a1.25 1.25 0 0 0-1.352 0L3.946 20.64c-1.164.75-2.696-.087-2.696-1.472V6ZM6 6.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H6Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export {BookmarkIcon as bookmark};
