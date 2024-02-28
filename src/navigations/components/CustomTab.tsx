import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {createStyleSheet} from 'react-native-unistyles';
import {UnistylesTheme} from 'react-native-unistyles/lib/typescript/src/types';

import {HStack, Text} from '@components/ui';
import {defaultSpringConfig, defaultTimingConfig} from '@helpers/animation';
import {spacing} from '@theme/spacing';

export interface ITabItemProps {
  index: number;
  activeIndex: number;
  tabCount: number;
  isActive: boolean;
  icon?: (props: {
    focused: boolean;
    color: string;
    size: number;
  }) => React.ReactNode;
  label: string;
  activeTintColor: string;
  inactiveTintColor: string;
  activeBackgroundColor: string;
  inactiveBackgroundColor: string;
  containerBackgroundColor: string;
  onPress?: () => void;
}

/* Tab Constants */
const MIN_TAB_SIZE = 60;
const MAX_TAB_SIZE = 160;
export const TAB_HEIGHT = 60;
const TAB_RAIDUS = MIN_TAB_SIZE / 2;

/* Separator */
const SEPARATOR_WIDTH = MIN_TAB_SIZE / 2;
const SEPARATOR_HEIGHT = 8;

const TabItem = ({
  isActive,
  index,
  activeIndex,
  tabCount,
  icon,
  label,
  activeTintColor,
  inactiveTintColor,
  activeBackgroundColor,
  inactiveBackgroundColor,
  containerBackgroundColor,
  onPress,
}: ITabItemProps) => {
  /* Boder Radius States */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isFirstItem = useMemo(() => index === 0, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isLastItem = useMemo(() => index === tabCount - 1, []);

  const isNextItem = useMemo(
    () => index === activeIndex + 1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex],
  );
  const isPrevItem = useMemo(
    () => index === activeIndex - 1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex],
  );

  /* Derived Values */
  const labelPaddingDerivedValue = useDerivedValue(() => {
    return withTiming(isActive ? spacing['2.5'] : 0, {
      ...defaultTimingConfig,
      duration: 400,
    });
  }, [isActive]);

  const labelOpacityDerivedValue = useDerivedValue(() => {
    return withTiming(isActive ? 1 : 0, {
      ...defaultTimingConfig,
      duration: isActive ? 800 : 200,
    });
  }, [isActive]);

  const iconMarginDerivedValue = useDerivedValue(() => {
    return withTiming(isActive ? spacing['5'] : 0, {
      ...defaultTimingConfig,
      duration: 400,
    });
  }, [isActive]);

  const iconContainerWidthDerivedValue = useDerivedValue(() => {
    return withTiming(
      isActive ? MIN_TAB_SIZE - spacing['8'] : MIN_TAB_SIZE - spacing['5'],
      defaultTimingConfig,
    );
  }, [isActive]);

  const tabWidthDerivedValue = useDerivedValue(() => {
    return withSpring(
      isActive ? MAX_TAB_SIZE : MIN_TAB_SIZE,
      defaultSpringConfig,
    );
  }, [isActive]);

  const tabBackgroundDerivedValue = useDerivedValue(() => {
    return withTiming(isActive ? 1 : 0, {
      ...defaultTimingConfig,
      duration: 500,
    });
  }, [isActive]);

  const separatorHeightDerivedValue = useDerivedValue(() => {
    const isSelected = isActive || isNextItem || isPrevItem;
    return withTiming(isSelected ? SEPARATOR_HEIGHT : TAB_HEIGHT * 0.7, {
      ...defaultTimingConfig,
      duration: isSelected ? 300 : 100,
    });
  }, [isActive, isNextItem, isPrevItem]);

  const itemMarginRightDerivedValue = useDerivedValue(() => {
    const isSelected =
      isActive || isPrevItem || (isLastItem && activeIndex === tabCount - 1);
    return withTiming(isSelected ? 6 : 0, {
      ...defaultTimingConfig,
      duration: isSelected ? 400 : 50,
    });
  }, [isActive, isNextItem, isPrevItem]);

  /* Animated Styles */
  const labelContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: labelOpacityDerivedValue.value,
    };
  });

  const iconContainerStyle = useAnimatedStyle(() => {
    return {
      width: iconContainerWidthDerivedValue.value,
      marginLeft: iconMarginDerivedValue.value,
    };
  });

  const tabStyle = useAnimatedStyle(() => {
    return {
      width: tabWidthDerivedValue.value,
      marginRight: itemMarginRightDerivedValue.value,
      borderTopLeftRadius:
        isActive || isFirstItem || isNextItem ? TAB_RAIDUS : 0,

      borderBottomLeftRadius:
        isActive || isFirstItem || isNextItem ? TAB_RAIDUS : 0,
      borderTopRightRadius:
        isActive || isLastItem || isPrevItem ? TAB_RAIDUS : 0,
      borderBottomRightRadius:
        isActive || isLastItem || isPrevItem ? TAB_RAIDUS : 0,
    };
  });

  const tabBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        tabBackgroundDerivedValue.value,
        [0, 1],
        [inactiveBackgroundColor, activeBackgroundColor],
      ),
      paddingRight: labelPaddingDerivedValue.value,
    };
  });

  const itemSeparatorStyle = useAnimatedStyle(() => {
    return {
      height: separatorHeightDerivedValue.value,
    };
  }, []);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.tabItemOuterContianer,
          {backgroundColor: containerBackgroundColor},
          tabStyle,
        ]}>
        <Animated.View
          style={[styles.tabItemInnerContainer, tabBackgroundStyle]}>
          <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
            {typeof icon === 'function' &&
              icon({
                focused: isActive,
                color: (isActive
                  ? activeTintColor
                  : inactiveTintColor) as string,
                size: 22,
              })}
          </Animated.View>
          <Animated.View style={[styles.labelContainer, labelContainerStyle]}>
            {typeof label === 'string' && (
              <Text
                color={isActive ? activeTintColor : inactiveTintColor}
                size="md"
                textAlign="center"
                numberOfLines={1}>
                {label}
              </Text>
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
      {!isLastItem && (
        <View style={styles.itemSeparatorContainer}>
          <Animated.View
            style={[
              styles.itemSeparator,
              {backgroundColor: containerBackgroundColor},
              itemSeparatorStyle,
            ]}
          />
        </View>
      )}
    </Pressable>
  );
};

const CustomTab = ({
  theme,
  navigation,
  state,
  descriptors,
  insets,
}: BottomTabBarProps & {theme: UnistylesTheme}) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      style={[styles.container, {bottom: insets.bottom + theme.spacing['2']}]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={`bottom-tab-${index}`}
            index={index}
            activeIndex={state.index}
            tabCount={state.routes.length}
            isActive={isFocused}
            icon={options.tabBarIcon}
            label={label as string}
            activeTintColor={options.tabBarActiveTintColor as string}
            inactiveTintColor={options.tabBarInactiveTintColor as string}
            activeBackgroundColor={
              options.tabBarActiveBackgroundColor as string
            }
            inactiveBackgroundColor={
              options.tabBarInactiveBackgroundColor as string
            }
            containerBackgroundColor={theme.colors.surface}
            onPress={onPress}
          />
        );
      })}
    </HStack>
  );
};

const styles = createStyleSheet({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  iconContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemOuterContianer: {
    height: TAB_HEIGHT,
    padding: spacing['2'],
    zIndex: 10,
  },
  tabItemInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingLeft: spacing['0.5'],
    borderRadius: TAB_RAIDUS,
  },
  labelContainer: {
    flex: 1,
  },
  itemSeparatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: -(SEPARATOR_WIDTH / 2.5),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  itemSeparator: {
    width: SEPARATOR_WIDTH,
  },
});

export {CustomTab};
