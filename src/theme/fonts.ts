import {TextStyle} from 'react-native';

export type FontSizes = keyof (typeof fonts)['sizes'];
export type FontWeights = keyof (typeof fonts)['weights'];
export type LineHeights = keyof (typeof fonts)['lineHeights'];
export type FontFamily = keyof (typeof fonts)['family'];

export type TypoVariants = 'h1' | 'h2';

export const variants: Record<TypoVariants, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 42,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
  },
};

export const fonts = {
  lineHeights: {
    xs: 18,
    sm: 21,
    md: 24,
    lg: 30,
    xl: 42,
  },

  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  family: {
    inter: 'Inter',
    product: 'ProductSans',
  },

  sizes: {
    '2xs': 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
} as const;
