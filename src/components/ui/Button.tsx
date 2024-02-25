import React, {ReactElement} from 'react';
import {
  DimensionValue,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import renderNode from '@helpers/renderNode';
import {globalStyles} from '@styles/global';

import {ITextProps, Text} from './Text';

export interface IButtonProps extends TouchableOpacityProps {
  icon?: ReactElement;
  variant?: 'solid' | 'clear' | 'outline';
  titleProps?: ITextProps;
  disableStyle?: StyleProp<ViewStyle>;
  w?: DimensionValue;
  h?: DimensionValue;
}

export const Button = ({
  icon,
  variant,
  titleProps,
  disabled,
  children,
  style,
  w,
  h,
  ...rest
}: IButtonProps) => {
  const {styles, theme} = useStyles(stylesheet);
  return (
    <TouchableOpacity activeOpacity={0.6} disabled={disabled} {...rest}>
      <View
        style={[
          globalStyles.centerRow,
          styles.buttonContainer,
          {width: w || '100%', height: h || theme.spacing['14']},
          style,
        ]}>
        {icon && <View style={styles.buttonIconContainer}>{icon}</View>}

        <View style={styles.buttonTitleContainer}>
          {React.Children.toArray(children).map((child, index) => (
            <React.Fragment key={index}>
              {typeof child === 'string'
                ? renderNode(Text, child, {
                    style: [styles.buttonTitle],
                    ...titleProps,
                  })
                : child}
            </React.Fragment>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(theme => ({
  buttonContainer: {
    paddingVertical: theme.spacing['2'],
    paddingHorizontal: theme.spacing['3'],
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    gap: theme.spacing['3'],
  },
  buttonIconContainer: {},
  buttonTitleContainer: {},
  buttonTitle: {
    color: theme.colors.white,
  },
}));
