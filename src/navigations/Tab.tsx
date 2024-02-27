/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';
import Home from '@screens/Home';
import Map from '@screens/Map';
import Services from '@screens/Services';
import Settings from '@screens/Settings';

import CustomTab from './components/CustomTab';

export type RootTabParamsList = {
  Home: undefined;
  Services: undefined;
  Map: undefined;
  Settings: undefined;
};

const RNTab = createBottomTabNavigator<RootTabParamsList>();

export default function Tab() {
  const {theme} = useStyles();
  return (
    <RNTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarActiveBackgroundColor: theme.colors.blueSoft2,
        tabBarInactiveBackgroundColor: theme.colors.white,
      }}
      tabBar={props => <CustomTab theme={theme} {...props} />}>
      <RNTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
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
          tabBarLabel: 'Services',
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
          tabBarLabel: 'Map',
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
          tabBarLabel: 'Settings',
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
