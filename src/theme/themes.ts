import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';

import merge from 'deepmerge';

import {IAppTheme} from '@typescript';

import {darkColors, lightColors} from './colors';
import {fonts} from './fonts';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// Unistyles themes
export const light = {
  colors: lightColors,
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;

export const dark = {
  colors: darkColors,
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;

// React Native Paper
export const lightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
  fonts,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
  fonts,
};

export const CombinedDefaultTheme = merge(lightTheme, LightTheme);
export const CombinedDarkTheme = merge(darkTheme, DarkTheme);

export const themes: Record<
  Exclude<IAppTheme, 'system'>,
  typeof CombinedDefaultTheme
> = {
  light: CombinedDefaultTheme,
  dark: CombinedDarkTheme,
};
