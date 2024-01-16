import React from 'react';
import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {CommonActions, DrawerActions} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-paper';

import DrawerItem from './DrawerItem';

const CustomDrawer = ({
  descriptors,
  state,
  navigation,
  ...rest
}: DrawerContentComponentProps) => {
  const {t} = useTranslation();

  /* Drawer props */
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const {
    drawerContentStyle,
    drawerContentContainerStyle,
    drawerActiveTintColor,
    drawerInactiveTintColor,
    drawerActiveBackgroundColor,
    drawerInactiveBackgroundColor,
  } = focusedDescriptor.options;

  const onPressDrawerItem = useCallback(
    (route: (typeof state.routes)[number], focused: boolean) => {
      const event = navigation.emit({
        type: 'drawerItemPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.dispatch({
          ...(focused
            ? DrawerActions.closeDrawer()
            : CommonActions.navigate({name: route.name, merge: true})),
          target: state.key,
        });
      }
    },
    [navigation, state],
  );

  return (
    <DrawerContentScrollView
      {...rest}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={drawerContentContainerStyle}
      style={drawerContentStyle}>
      <View style={styles.routeContainer}>
        {state.routes.map((route, index) => {
          const focused = focusedRoute.key === route.key; // this is need due to filter of Home key
          const {
            title,
            drawerLabel,
            drawerIcon,
            drawerLabelStyle,
            drawerItemStyle,
            drawerAllowFontScaling,
          } = descriptors[route.key].options as DrawerNavigationOptions;

          return (
            <DrawerItem
              key={`${route.key}-${index}`}
              label={
                drawerLabel !== undefined
                  ? drawerLabel
                  : title !== undefined
                  ? title
                  : route.name
              }
              icon={drawerIcon}
              focused={focused}
              activeTintColor={drawerActiveTintColor}
              inactiveTintColor={drawerInactiveTintColor}
              activeBackgroundColor={drawerActiveBackgroundColor}
              inactiveBackgroundColor={drawerInactiveBackgroundColor}
              allowFontScaling={drawerAllowFontScaling}
              labelStyle={drawerLabelStyle}
              style={drawerItemStyle}
              onPress={() => onPressDrawerItem(route, focused)}
            />
          );
        })}
        <DrawerItem
          label={t('Settings')}
          // eslint-disable-next-line react/no-unstable-nested-components
          icon={props => <Icon source="cog-outline" {...props} />}
          activeTintColor={drawerActiveTintColor}
          inactiveTintColor={drawerInactiveTintColor}
          activeBackgroundColor={drawerActiveBackgroundColor}
          inactiveBackgroundColor={drawerInactiveBackgroundColor}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    paddingVertical: 15,
    gap: 6,
  },
});

export default CustomDrawer;
