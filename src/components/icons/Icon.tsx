import React, {memo, useMemo} from 'react';

import {SvgProps} from 'react-native-svg';
import {useStyles} from 'react-native-unistyles';

import {IconKeys, icons} from '.';

export interface IIconProps extends SvgProps {
  size?: number;
}

export interface IIconComponentProps extends IIconProps {
  name: IconKeys;
}

export const Icon = memo(({name, ...props}: IIconComponentProps) => {
  const {theme} = useStyles();

  const IconComponent = useMemo(() => icons[name], [name]);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent color={theme.colors.text} {...props} />;
});
