import {useColorScheme} from 'react-native';

import {useAppStore} from '@store/app';
import {IAppTheme} from '@typescript';
import {isSystemTheme} from '@utils/theme';

export const useThemeName = (): Exclude<IAppTheme, 'system'> => {
  const {theme} = useAppStore();
  const systemTheme = useColorScheme();

  return isSystemTheme(theme) ? systemTheme || 'light' : theme;
};
