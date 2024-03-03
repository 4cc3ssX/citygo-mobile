import React from 'react';
import {ColorValue} from 'react-native';

import {useStyles} from 'react-native-unistyles';

import {IStackProps, Stack} from './Stack';
import {Text} from './Text';

export interface ISeparatorProps extends IStackProps {
  size?: number;
  color?: ColorValue;
  direction?: 'horizontal' | 'vertical';
}

export const Separator = ({
  size = 1,
  color,
  direction = 'horizontal',
  children,
  ...rest
}: ISeparatorProps) => {
  const {theme} = useStyles();
  return (
    <Stack
      gap={children ? theme.spacing['2'] : 0}
      {...rest}
      flexDirection={direction === 'horizontal' ? 'row' : 'column'}
      alignItems="center">
      <Stack
        flex={1}
        w={direction === 'horizontal' ? 'auto' : size}
        h={direction === 'horizontal' ? size : 'auto'}
        bg={color || theme.colors.border}
      />

      {direction === 'horizontal' && children ? (
        typeof children === 'string' ? (
          <Text size="xs" color={theme.colors.gray2}>
            {children}
          </Text>
        ) : (
          children
        )
      ) : null}
      <Stack
        flex={1}
        w={direction === 'horizontal' ? 'auto' : size}
        h={direction === 'horizontal' ? size : 'auto'}
        bg={color || theme.colors.border}
      />
    </Stack>
  );
};
