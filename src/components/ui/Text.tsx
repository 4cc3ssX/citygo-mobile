import React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {FontSizes, FontWeights} from '@theme/fonts';

export interface ITextProps extends TextProps, Pick<TextStyle, 'color'> {
  size?: FontSizes | number;
  type?: FontWeights;
}

export const Text = ({
  color = '#000000',
  size = 'sm',
  type = 'normal',
  style,
  ...rest
}: ITextProps) => {
  const {styles, theme} = useStyles(stylesheet);
  return (
    <RNText
      style={[
        styles.text,
        style,
        {
          color,
          fontSize: typeof size === 'string' ? theme.fonts.sizes[size] : size,
          fontWeight: theme.fonts.weights[type],
        },
      ]}
      {...rest}
    />
  );
};

const stylesheet = createStyleSheet(theme => ({
  text: {
    fontFamily: theme.fonts.family.inter,
  },
}));
