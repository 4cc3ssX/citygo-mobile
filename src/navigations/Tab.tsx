/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Go from '@screens/Go';
import Home from '@screens/Home';

export type RootTabParamsList = {
  Home: undefined;
  Go: undefined;
};

const RNTab = createBottomTabNavigator<RootTabParamsList>();

export default function Tab() {
  return (
    <RNTab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // tabBar={({navigation, state, descriptors, insets}) => (
      //   <BottomNavigation.Bar
      //     navigationState={state}
      //     safeAreaInsets={insets}
      //     onTabPress={({route, preventDefault}) => {
      //       const event = navigation.emit({
      //         type: 'tabPress',
      //         target: route.key,
      //         canPreventDefault: true,
      //       });

      //       if (event.defaultPrevented) {
      //         preventDefault();
      //       } else {
      //         navigation.dispatch({
      //           ...CommonActions.navigate(route.name, route.params),
      //           target: state.key,
      //         });
      //       }
      //     }}
      //     renderIcon={({route, focused, color}) => {
      //       const {options} = descriptors[route.key];
      //       if (options.tabBarIcon) {
      //         return options.tabBarIcon({focused, color, size: 24});
      //       }

      //       return null;
      //     }}
      //     getLabelText={({route}) => {
      //       const {options} = descriptors[route.key];
      //       const label =
      //         options.title !== undefined ? options.title : route.name;

      //       return label;
      //     }}
      //   />
      // )}
    >
      <RNTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                name={focused ? 'map-marker' : 'map-marker-outline'}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <RNTab.Screen
        name="Go"
        component={Go}
        options={{
          tabBarLabel: 'Go',
          tabBarIcon: ({color, size}) => {
            return <Icon name="bus" size={size} color={color} />;
          },
        }}
      />
    </RNTab.Navigator>
  );
}
