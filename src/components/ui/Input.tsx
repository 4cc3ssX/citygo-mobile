import React, {forwardRef, memo, ReactElement} from 'react';
import {StyleProp, TextInput, TextInputProps, ViewStyle} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {HStack, IHStackProps} from './HStack';
import {Stack} from './Stack';

export interface IInputProps
  extends TextInputProps,
    Omit<IHStackProps, 'style'> {
  leftElement?: ReactElement;
  rightElement?: ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = memo(
  forwardRef<TextInput, IInputProps>(
    (
      {w, h, bg, leftElement, rightElement, containerStyle, ...inputProps},
      ref,
    ) => {
      const {styles, theme} = useStyles(stylesheet);

      return (
        <HStack
          w={w}
          h={h}
          bg={bg}
          alignItems="center"
          style={[containerStyle, styles.container]}>
          {leftElement && (
            <Stack alignItems="center" justifyContent="center">
              {leftElement}
            </Stack>
          )}
          <TextInput
            ref={ref}
            autoComplete="off"
            autoCorrect={false}
            placeholderTextColor={theme.colors.gray2}
            {...inputProps}
            style={[styles.input, inputProps.style]}
          />
          {rightElement && (
            <Stack alignItems="center" justifyContent="center">
              {rightElement}
            </Stack>
          )}
        </HStack>
      );
    },
  ),
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    height: theme.spacing['14'],
    paddingHorizontal: theme.spacing['5'],
    backgroundColor: theme.colors.gray3,
    borderRadius: theme.roundness,
  },
  input: {
    flex: 2,
    fontFamily: theme.fonts.family.product,
    color: theme.colors.text,
    fontSize: theme.fonts.sizes.lg,
    marginHorizontal: theme.spacing['4'],
  },
}));
