import {darkColors, lightColors} from './colors';
import {fonts} from './fonts';
import {spacing} from './spacing';

// Unistyles themes
export const light = {
  colors: lightColors,
  fonts,
  spacing,
  roundness: 15,
} as const;

export const dark = {
  colors: darkColors,
  fonts,
  spacing,
  roundness: 15,
} as const;
