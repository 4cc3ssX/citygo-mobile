import React, {ReactElement} from 'react';
import {
  DimensionValue,
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
  icon?: ReactElement;
  color?: StringOmit<ColorKeys>;
  variant?: 'solid' | 'clear' | 'outline';
  titleProps?: ITextProps;
  disableStyle?: StyleProp<ViewStyle>;
  w?: DimensionValue;
  h?: DimensionValue;
}

export const Button = ({
  w,
  h,
  icon,
  color = 'primary',
  variant = 'solid',
  titleProps,
  disabled,
  activeOpacity = 0.75,
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
          ),
          {width: w || '100%', height: h || theme.spacing['14']},
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
  buttonContainer: (color: string, variant: IButtonProps['variant']) => ({
    paddingVertical: theme.spacing['2'],
    paddingHorizontal: theme.spacing['3'],
    justifyContent: 'center',
    backgroundColor: variant === 'solid' ? color : 'transparent',
    borderWidth: variant === 'outline' ? StyleSheet.hairlineWidth : 0,
    borderColor: variant === 'outline' ? color : 'transparent',
    borderRadius: theme.roundness,
    gap: theme.spacing['3'],
  }),
  buttonIconContainer: {},
  buttonTitleContainer: {},
  buttonTitle: (color: string, variant: IButtonProps['variant']) => ({
    color: variant === 'solid' ? theme.colors.white : color,
  }),
}));
