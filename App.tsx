import 'react-native-gesture-handler';
import '@theme/unistyles';
import '@locales';

import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';
import {SystemBars} from 'react-native-bars';
import {enableLatestRenderer} from 'react-native-maps';
import {enableFreeze, enableScreens} from 'react-native-screens';
import {UnistylesRuntime} from 'react-native-unistyles';

import {AppContextProvider} from '@hooks/context';
import Stack from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {isSystemTheme} from '@utils/theme';

enableScreens(true);
enableFreeze(true);
enableLatestRenderer();

function Main() {
  const {
    i18n: {language, changeLanguage},
  } = useTranslation();

  /* State */
  const app = useAppStore();

  /* Theme */
  const systemTheme = useColorScheme();

  useEffect(() => {
    if (language !== app.language) {
      changeLanguage(app.language);
    }

    if (isSystemTheme(app.theme)) {
      UnistylesRuntime.setTheme(systemTheme || 'light');
    } else {
      UnistylesRuntime.setTheme(app.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.language, app.theme]);
  return (
    <NavigationContainer>
      <Stack />
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <AppContextProvider>
      <SystemBars barStyle="dark-content" animated />
      <Main />
    </AppContextProvider>
  );
}

export default App;
