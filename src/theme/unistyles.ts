import {UnistylesRegistry} from 'react-native-unistyles';

import {breakpoints} from './breakpoints';
import {dark, light} from './themes';

// if you defined breakpoints
type AppBreakpoints = typeof breakpoints;

// if you defined themes
export type AppThemes = {
  light: typeof light;
  dark: typeof dark;
};

// override library types
declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    light,
    dark,
    // register other themes with unique names
  })
  .addConfig({
    initialTheme: 'light',
  });
