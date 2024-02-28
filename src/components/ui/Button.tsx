import React, {ReactElement} from 'react';
import {
  StyleProp,
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
  variant?: 'solid' | 'clear' | 'outline';
  titleProps?: ITextProps;
  disableStyle?: StyleProp<ViewStyle>;
}

export const Button = ({
  size = 'md',
  w,
  h,
  icon,
  color = 'primary',
  variant = 'solid',
  titleProps,
  disabled = false,
  activeOpacity = 0.6,
  onPress,
  children,
  style,
  ...rest
}: IButtonProps) => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}>
      <HStack
        w={w}
        h={h}
        alignItems="center"
        style={[
          styles.buttonContainer(
            theme.colors[color as ColorKeys] || color,
            variant,
            disabled,
            size,
          ),
          style,
        ]}
        {...rest}>
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
                      ),
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
        ? theme.spacing['2']
        : theme.spacing['3'],
    paddingHorizontal:
      size === 'sm'
        ? theme.spacing['2']
        : size === 'md'
        ? theme.spacing['3']
        : theme.spacing['6'],
    justifyContent: 'center',
    backgroundColor: !disabled
      ? variant === 'solid'
        ? color
        : 'transparent'
      : theme.colors.disabledBackground,
    borderWidth: variant === 'outline' ? StyleSheet.hairlineWidth : 0,
    borderColor: variant === 'outline' ? color : 'transparent',
    borderRadius: theme.roundness,
    gap: theme.spacing['2'],
  }),
  buttonIconContainer: {},
  buttonTitleContainer: {},
  buttonTitle: (
    color: string,
    variant: IButtonProps['variant'],
    disabled: boolean,
  ) => ({
    color: !disabled
      ? variant === 'solid'
        ? theme.colors.white
        : variant === 'clear'
        ? theme.colors.text
        : color
      : theme.colors.disabled,
  }),
}));
