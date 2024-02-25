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
  const {drawerContentStyle, drawerContentContainerStyle} =
    focusedDescriptor.options;

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
          const {title, drawerIcon, drawerItemStyle} = descriptors[route.key]
            .options as DrawerNavigationOptions;

          return (
            <Drawer.Item
              key={`${route.key}-${index}`}
              label={title !== undefined ? title : route.name}
              icon={props => drawerIcon && drawerIcon({...props, focused})}
              active={focused}
              style={drawerItemStyle}
              onPress={() => onPressDrawerItem(route, focused)}
            />
          );
        })}
        <Drawer.Section title={t('Preferences')}>
          <Drawer.Item
            icon="cog-outline"
            label={t('Settings')}
            onPress={() => navigation.navigate('Settings')}
          />
        </Drawer.Section>
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
