/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {useTranslation} from 'react-i18next';
import {useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';
import Home from '@screens/Home';
import Map from '@screens/Map';
import Services from '@screens/Services';
import Settings from '@screens/Settings';

import {CustomTab} from './components';

export type RootTabParamsList = {
  Home: undefined;
  Services: undefined;
  Map: undefined;
  Settings: undefined;
};

const RNTab = createBottomTabNavigator<RootTabParamsList>();

export default function Tab() {
  const {t} = useTranslation();
  const {theme} = useStyles();
  return (
    <RNTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarActiveBackgroundColor: theme.colors.blueSoft2,
        tabBarInactiveBackgroundColor: theme.colors.surface,
      }}
      tabBar={props => <CustomTab theme={theme} {...props} />}>
      <RNTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: t('Home'),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <RNTab.Screen
        name="Services"
        component={Services}
        options={{
          tabBarLabel: t('Services'),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                name={focused ? 'services' : 'services-outline'}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <RNTab.Screen
        name="Map"
        component={Map}
        options={{
          lazy: false,
          tabBarLabel: t('Map'),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                name={focused ? 'map' : 'map-outline'}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <RNTab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: t('Settings'),
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                name={focused ? 'settings' : 'settings-outline'}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </RNTab.Navigator>
  );
}
