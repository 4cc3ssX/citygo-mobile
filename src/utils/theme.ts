import {IAppTheme} from '@typescript';

export const isSystemTheme = (theme: IAppTheme): theme is 'system' =>
  theme === 'system';
