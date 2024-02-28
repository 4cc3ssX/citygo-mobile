import {IAppTheme} from '@theme/themes';

export const isSystemTheme = (theme: IAppTheme): theme is 'system' =>
  theme === 'system';
