/* eslint-disable react/no-unstable-nested-components */
import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {Appbar} from 'react-native-paper';

import {Settings} from '@screens/Settings';

import Drawer from './Drawer';

export type RootStackParamsList = {
  MainDrawer: undefined;
  Settings: undefined;
};

const RNStack = createNativeStackNavigator<RootStackParamsList>();

function Stack() {
  const {t} = useTranslation();

  return (
    <RNStack.Navigator
      screenOptions={{
        header: ({navigation, options}) => (
          <Appbar.Header mode="center-aligned">
            {navigation.canGoBack() && (
              <Appbar.BackAction size={18} onPress={navigation.goBack} />
            )}
            <Appbar.Content title={options.title} />
          </Appbar.Header>
        ),
      }}>
      <RNStack.Screen
        name="MainDrawer"
        component={Drawer}
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
    </RNStack.Navigator>
  );
}

export default memo(Stack);
