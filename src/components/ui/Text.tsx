import React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {FontFamily, FontSizes, FontWeights} from '@theme/fonts';

export interface ITextProps
  extends TextProps,
    Pick<TextStyle, 'color' | 'textAlign'> {
  size?: FontSizes | number;
  type?: FontWeights;
  family?: FontFamily;
  underlined?: boolean;
}

export const Text = ({
  color = '#000000',
  size = 'sm',
  type = 'normal',
  family = 'inter',
  textAlign,
  underlined = false,
  style,
  ...rest
}: ITextProps) => {
  const {styles, theme} = useStyles(stylesheet);
  return (
    <RNText
      style={[
        styles.text(underlined),
        {
          color,
          fontFamily: theme.fonts.family[family],
          fontSize: typeof size === 'string' ? theme.fonts.sizes[size] : size,
          fontWeight: theme.fonts.weights[type],
          textAlign,
        },
        style,
      ]}
      {...rest}
    />
  );
};

const stylesheet = createStyleSheet(theme => ({
  text: (underlined: boolean) => ({
    fontFamily: theme.fonts.family.inter,
    textDecorationLine: underlined ? 'underline' : 'none',
  }),
}));
