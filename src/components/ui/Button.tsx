import React, {ReactElement} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import {StyleSheet} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import renderNode from '@helpers/renderNode';
import {ColorKeys} from '@theme/colors';
import {StringOmit} from '@typescript';

import {HStack, IHStackProps} from './HStack';
import {ITextProps, Text} from './Text';

export interface IButtonProps
  extends IHStackProps,
    Pick<
      TouchableOpacityProps,
      'activeOpacity' | 'onPress' | 'onLongPress' | 'disabled'
    > {
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactElement;
  color?: StringOmit<ColorKeys>;
  variant?: 'solid' | 'clear' | 'outline' | 'ghost';
  titleProps?: ITextProps;
  titleStyle?: StyleProp<TextStyle>;
  disableStyle?: StyleProp<ViewStyle>;
}

export const Button = ({
  pointerEvents,
  size = 'md',
  w,
  h,
  icon,
  color = 'primary',
  variant = 'solid',
  titleStyle,
  titleProps,
  disabled = false,
  activeOpacity = 0.95,
  onPress,
  children,
  style,
  disableStyle,
  ...rest
}: IButtonProps) => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={pointerEvents === 'none' || disabled}
      onPress={onPress}>
      <HStack
        w={w}
        h={h}
        alignItems="center"
        br={theme.roundness}
        {...rest}
        style={[
          styles.buttonContainer(
            theme.colors[color as ColorKeys] || color,
            variant,
            disabled,
            size,
          ),
          style,
          disabled && disableStyle,
        ]}>
        {icon && <View style={styles.buttonIconContainer}>{icon}</View>}

        <View style={styles.buttonTitleContainer}>
          {React.Children.toArray(children).map((child, index) => (
            <React.Fragment key={index}>
              {typeof child === 'string'
                ? renderNode(Text, child, {
                    style: [
                      styles.buttonTitle(
                        theme.colors[color as ColorKeys] || color,
                        variant,
                        disabled,
                        size,
                      ),
                      titleStyle,
                    ],
                    ...titleProps,
                  })
                : child}
            </React.Fragment>
          ))}
        </View>
      </HStack>
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(theme => ({
  buttonContainer: (
    color: string,
    variant: IButtonProps['variant'],
    disabled: boolean,
    size: IButtonProps['size'],
  ) => ({
    paddingVertical:
      size === 'sm'
        ? theme.spacing['1']
        : size === 'md'
        ? theme.spacing['2.5']
        : theme.spacing['3'],
    paddingHorizontal:
      size === 'sm'
        ? theme.spacing['2']
        : size === 'md'
        ? theme.spacing['5']
        : theme.spacing['6'],
    justifyContent: 'center',
    backgroundColor: !disabled
      ? variant === 'solid'
        ? color
        : variant === 'ghost'
        ? color
        : 'transparent'
      : theme.colors.disabledBackground,
    borderWidth: variant === 'outline' ? StyleSheet.hairlineWidth : 0,
    borderColor: variant === 'outline' ? color : 'transparent',
    gap: theme.spacing['2'],
  }),
  buttonIconContainer: {},
  buttonTitleContainer: {},
  buttonTitle: (
    color: string,
    variant: IButtonProps['variant'],
    disabled: boolean,
    size: IButtonProps['size'],
  ) => ({
    color: !disabled
      ? variant === 'solid'
        ? theme.colors.white
        : variant === 'clear'
        ? theme.colors.text
        : color
      : theme.colors.disabled,
    fontSize:
      size === 'sm'
        ? theme.fonts.sizes.sm
        : size === 'md'
        ? theme.fonts.sizes.sm
        : theme.fonts.sizes.md,
  }),
}));
