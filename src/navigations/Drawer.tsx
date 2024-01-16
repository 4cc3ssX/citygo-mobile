/* eslint-disable react/no-unstable-nested-components */
import React, {memo} from 'react';
import {Dimensions} from 'react-native';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';

import {Icon, useTheme} from 'react-native-paper';

/* Screens */
import Home from '@screens/Home';

import {CustomDrawer} from './components';

export type RootDrawerParamsList = {
  Home: undefined;
};

const RNDrawer = createDrawerNavigator<RootDrawerParamsList>();

const {width} = Dimensions.get('screen');

const screenOptions: DrawerNavigationOptions = {
  lazy: true,
  overlayColor: 'rgba(0, 0, 0, 0.25)',
  drawerPosition: 'left',
  drawerType: width >= 768 ? 'permanent' : 'front',
  drawerContentContainerStyle: {
    paddingStart: 20,
    paddingEnd: 20,
    flexGrow: 1,
  },
  drawerStyle: {
    borderTopRightRadius: 20, // only compatible with drawerType: 'front',
    borderBottomRightRadius: 20,
  },
  keyboardDismissMode: 'none',
};

function Drawer() {
  const theme = useTheme();
  return (
    <RNDrawer.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawer}
      screenOptions={{
        ...screenOptions,
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.onPrimary,
        drawerInactiveTintColor: theme.colors.primary,
      }}>
      <RNDrawer.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          drawerIcon: props => <Icon source="home-outline" {...props} />,
        }}
      />
    </RNDrawer.Navigator>
  );
}

export default memo(Drawer);
