/* eslint-disable react/no-unstable-nested-components */
import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';

import Language from '@screens/Language';
import {Settings} from '@screens/Settings';

import Tab from './Tab';

export type RootStackParamsList = {
  MainTab: undefined;
  Settings: undefined;
  Language: undefined;
};

const RNStack = createNativeStackNavigator<RootStackParamsList>();

function Stack() {
  const {t} = useTranslation();

  return (
    <RNStack.Navigator screenOptions={{}}>
      <RNStack.Screen
        name="MainTab"
        component={Tab}
        options={{
          headerShown: false,
          title: 'Home', // back native button title
        }}
      />
      <RNStack.Screen
        name="Settings"
        component={Settings}
        options={{title: t('Settings')}}
      />
      <RNStack.Screen
        name="Language"
        component={Language}
        options={{title: t('Language')}}
      />
    </RNStack.Navigator>
  );
}

export default memo(Stack);
