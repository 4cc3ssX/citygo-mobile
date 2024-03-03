import React, {memo} from 'react';
import {Pressable, StyleProp, ViewStyle} from 'react-native';

import {useStyles} from 'react-native-unistyles';

import {ColorKeys} from '@theme/colors';
import {StringOmit} from '@typescript';

import {Stack} from './Stack';

export interface IRadioProps {
  size?: 'sm' | 'md';
  color?: StringOmit<ColorKeys>;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  isChecked: boolean;
  onChange?: (value: boolean) => void;
}

const Radio = memo(
  ({
    disabled,
    disabledStyle,
    isChecked,
    onChange,
    color = 'primary',
  }: IRadioProps) => {
    const {theme} = useStyles();

    return (
      <Pressable disabled={disabled} onPress={() => onChange?.(!isChecked)}>
        <Stack
          w={theme.spacing['4']}
          h={theme.spacing['4']}
          p={theme.spacing['1']}
          alignItems="center"
          justifyContent="center"
          br={theme.radius.full}
          bg={
            isChecked
              ? theme.colors[color as ColorKeys] || theme.colors.primary
              : theme.colors.gray2
          }
          style={[disabled && disabledStyle]}>
          <Stack
            w={theme.spacing.full}
            h={theme.spacing.full}
            bg={theme.colors.surface}
            br={theme.radius.full}
          />
        </Stack>
      </Pressable>
    );
  },
);

export {Radio};
