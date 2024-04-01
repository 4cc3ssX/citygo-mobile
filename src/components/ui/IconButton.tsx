import React, {memo} from 'react';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button, IButtonProps} from './Button';

export interface IIconButton extends IButtonProps {}

export const IconButton = memo(
  ({icon, size = 'md', style, ...rest}: IIconButton) => {
    const {styles} = useStyles(stylesheet);
    return (
      <Button
        color="surface"
        alignItems="center"
        justifyContent="center"
        activeOpacity={0.7}
        style={[styles.container(size), style]}
        {...rest}>
        {icon}
      </Button>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  container: (size: IButtonProps['size']) => ({
    width:
      size === 'sm'
        ? theme.spacing['10']
        : size === 'md'
        ? theme.spacing['12']
        : theme.spacing['14'],
    height:
      size === 'sm'
        ? theme.spacing['10']
        : size === 'md'
        ? theme.spacing['12']
        : theme.spacing['14'],
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: theme.roundness,
  }),
}));
