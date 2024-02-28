import React from 'react';

import Svg, {Path} from 'react-native-svg';

import {IIconProps} from './Icon';

export const BookIcon = ({size = 24, ...props}: IIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 19 18" fill="none" {...props}>
      <Path
        fill="currentColor"
        fillRule="evenodd"
        d="m8.813 1.647-.076-.028a10.375 10.375 0 0 0-7.263 0C.66 1.925.09 2.683.09 3.56v12.081c0 1.322 1.38 2.105 2.546 1.668a7.062 7.062 0 0 1 4.94 0l1.237.464V1.647Zm1.308 16.127 1.237-.464a7.062 7.062 0 0 1 4.94 0c1.166.438 2.546-.346 2.546-1.668V3.562c0-.88-.569-1.637-1.384-1.943a10.375 10.375 0 0 0-7.263 0l-.076.028v16.127Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export {BookIcon as book};
