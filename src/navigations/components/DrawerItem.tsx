import React, {memo, ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';

import {Badge, customText, useTheme} from 'react-native-paper';

const Text = customText<'medium'>();

interface IDrawerItem extends PressableProps {
  label: string | ((props: {color: string; focused: boolean}) => ReactNode);
  labelStyle?: StyleProp<TextStyle>;
  icon?: (props: {color: string; size: number; focused: boolean}) => ReactNode;
  focused?: boolean;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  activeTintColor?: string;
  inactiveTintColor?: string;
  allowFontScaling?: boolean;
  badge?: number;
}

const DrawerItem = ({
  label,
  labelStyle,
  icon,
  focused = false,
  badge,
  allowFontScaling,
  ...rest
}: IDrawerItem) => {
  const theme = useTheme();

  const {
    activeTintColor = theme.colors.primary,
    inactiveTintColor = theme.colors.primary,
    activeBackgroundColor = theme.colors.primary,
    inactiveBackgroundColor = 'transparent',
    ...props
  } = rest;

  return (
    <Pressable {...props}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: focused
              ? activeBackgroundColor
              : inactiveBackgroundColor,
          },
        ]}>
        {icon &&
          icon({
            color: focused ? activeTintColor : inactiveTintColor,
            size: 24,
            focused,
          })}
        <View>
          {typeof label === 'string' ? (
            <Text
              variant="medium"
              numberOfLines={1}
              style={[
                {color: focused ? activeTintColor : inactiveTintColor},
                labelStyle,
              ]}
              allowFontScaling={allowFontScaling}>
              {label}
            </Text>
          ) : typeof label === 'function' ? (
            label({
              color: focused ? activeTintColor : inactiveTintColor,
              focused,
            })
          ) : null}
        </View>

        {badge && <Badge>{badge}</Badge>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 8,
  },
});

export default memo(
  DrawerItem,
  (prevProps, nextProps) =>
    prevProps.label === nextProps.label &&
    prevProps.focused === nextProps.focused &&
    prevProps.badge === nextProps.badge,
);
