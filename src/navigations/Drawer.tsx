/* eslint-disable react/no-unstable-nested-components */
import React, {memo} from 'react';
import {Dimensions, useWindowDimensions} from 'react-native';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';

import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {CustomDrawer} from './components';
import Tab from './Tab';

export type RootDrawerParamsList = {
  Tab: undefined;
};

const RNDrawer = createDrawerNavigator<RootDrawerParamsList>();

const screenOptions: DrawerNavigationOptions = {
  lazy: true,
  overlayColor: 'rgba(0, 0, 0, 0.25)',
  drawerPosition: 'left',
  keyboardDismissMode: 'none',
};

function Drawer() {
  const {t} = useTranslation();
  const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;
  return (
    <RNDrawer.Navigator
      initialRouteName="Tab"
      drawerContent={CustomDrawer}
      screenOptions={{
        ...screenOptions,
        drawerType: isLargeScreen ? 'permanent' : 'slide',
        drawerStyle: {
          borderTopRightRadius: 20, // only compatible with drawerType: 'front',
          borderBottomRightRadius: 20,
        },
      }}>
      <RNDrawer.Screen
        name="Tab"
        component={Tab}
        options={{
          headerShown: false,
          title: t('Explore'),
          drawerIcon: props => <Ionicons name="map-marker" {...props} />,
        }}
      />
    </RNDrawer.Navigator>
  );
}

export default memo(Drawer);
