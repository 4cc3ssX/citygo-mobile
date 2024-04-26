import {LinkingOptions} from '@react-navigation/native';

import {Configs} from '@configs/app';
import {RootStackParamsList} from '@navigations/Stack';

export const linking: LinkingOptions<RootStackParamsList> = {
  prefixes: [Configs.APP_DOMAIN, Configs.APP_PREFIX],
  config: {
    initialRouteName: 'MainTab',
    screens: {
      MainTab: {
        initialRouteName: 'Home',
        screens: {
          Home: 'home',
          Services: 'services',
          Map: 'map',
          Settings: 'settings',
        },
      },

      Routes: 'routes',
      Search: 'routes/find',

      History: 'history',
      Bookmarks: 'bookmarks',

      // settings
      AppTheme: 'settings/theme',
      NotificationSettings: 'settings/notifications',
      Language: 'settings/language',
    },
  },
};
