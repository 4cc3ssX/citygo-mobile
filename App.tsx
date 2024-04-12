import 'react-native-gesture-handler';
import '@theme/unistyles';
import '@locales';
import '@helpers/toast';

import React, {useEffect, useRef} from 'react';
import {useColorScheme} from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';
import {SystemBars} from 'react-native-bars';
import {enableFreeze, enableScreens} from 'react-native-screens';
import {UnistylesRuntime} from 'react-native-unistyles';

import {logScreenView} from '@helpers/analytics';
import {AppContextProvider} from '@hooks/context';
import Stack from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {isSystemTheme} from '@utils/theme';

enableScreens(true);
enableFreeze(true);

function Main() {
  const {
    i18n: {language, changeLanguage},
  } = useTranslation();

  /* Ref */
  const routeNameRef = useRef<string>();
  const navigationRef = useNavigationContainerRef();

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
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
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
