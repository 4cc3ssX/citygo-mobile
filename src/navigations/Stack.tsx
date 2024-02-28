import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';

import AppTheme from '@screens/AppTheme';
import Language from '@screens/Language';
import {NotificationSettings} from '@screens/Notifications';

import {StackHeader} from './components/Header';
import Tab from './Tab';

export type RootStackParamsList = {
  MainTab: undefined;
  Language: undefined;
  NotificationSettings: undefined;
  AppTheme: undefined;
};

const RNStack = createNativeStackNavigator<RootStackParamsList>();

function Stack() {
  const {t} = useTranslation();

  return (
    <RNStack.Navigator
      screenOptions={{
        header: StackHeader,
      }}>
      <RNStack.Screen
        name="MainTab"
        component={Tab}
        options={{
          headerShown: false,
          title: 'Home', // back native button title
        }}
      />
      <RNStack.Screen
        name="Language"
        component={Language}
        options={{title: t('Language')}}
      />
      <RNStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{title: t('Notifications')}}
      />
      <RNStack.Screen
        name="AppTheme"
        component={AppTheme}
        options={{title: t('AppTheme')}}
      />
    </RNStack.Navigator>
  );
}

export default memo(Stack);
