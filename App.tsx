import 'react-native-gesture-handler';
import '@theme/unistyles';
import '@locales';

import React, {useEffect} from 'react';
import {Platform, StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';
import {PaperProvider} from 'react-native-paper';
import {UnistylesRuntime} from 'react-native-unistyles';

import {AppContextProvider} from '@hooks/context';
import Stack from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {themes} from '@theme/themes';
import {isSystemTheme} from '@utils/theme';

function Main() {
  const {
    i18n: {language, changeLanguage},
  } = useTranslation();

  /* State */
  const app = useAppStore();

  /* Theme */
  const systemTheme = useColorScheme();

  const theme = isSystemTheme(app.theme)
    ? themes[systemTheme || 'light']
    : themes[app.theme];

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
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack />
      </NavigationContainer>
    </PaperProvider>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)');
      StatusBar.setTranslucent(true);
    }
  }, []);
  return (
    <AppContextProvider>
      <StatusBar barStyle="dark-content" animated />
      <Main />
    </AppContextProvider>
  );
}

export default App;
