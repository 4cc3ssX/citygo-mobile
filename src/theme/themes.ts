import {darkColors, lightColors} from './colors';
import {fonts} from './fonts';
import {radius} from './radius';
import {spacing} from './spacing';

// Unistyles themes
export const light = {
  colors: lightColors,
  fonts,
  spacing,
  radius,
  roundness: 15,
} as const;

export const dark = {
  colors: darkColors,
  fonts,
  spacing,
  radius,
  roundness: 15,
} as const;
