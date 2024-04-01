import React, {memo} from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {isUndefined, omitBy} from 'lodash';

import {FontFamily, FontSizes, FontWeights, LineHeights} from '@theme/fonts';

export interface ITextProps
  extends TextProps,
    Pick<TextStyle, 'color' | 'textAlign'> {
  lineHeight?: LineHeights | number;
  size?: FontSizes | number;
  type?: FontWeights;
  family?: FontFamily;
  underlined?: boolean;
}

export const Text = memo(
  ({
    color,
    size = 'sm',
    type = 'normal',
    family = 'inter',
    textAlign,
    lineHeight,
    underlined = false,
    style,
    ...rest
  }: ITextProps) => {
    const {styles, theme} = useStyles(stylesheet);

    return (
      <RNText
        style={[
          styles.text(underlined),
          omitBy<TextStyle>(
            {
              color: color || theme.colors.text,
              fontFamily: theme.fonts.family[family],
              fontSize:
                typeof size === 'string' ? theme.fonts.sizes[size] : size,
              fontWeight: theme.fonts.weights[type],
              textAlign,
              lineHeight:
                typeof lineHeight === 'string'
                  ? theme.fonts.lineHeights[lineHeight]
                  : lineHeight,
            },
            isUndefined,
          ),
          style,
        ]}
        {...rest}
      />
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  text: (underlined: boolean) => ({
    fontFamily: theme.fonts.family.inter,
    textDecorationLine: underlined ? 'underline' : 'none',
  }),
}));
