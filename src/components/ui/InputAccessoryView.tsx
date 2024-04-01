import React, {memo, useCallback} from 'react';
import {
  InputAccessoryView as RNInputAccessoryView,
  InputAccessoryViewProps,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
} from 'react-native';

import {useReanimatedKeyboardAnimation} from 'react-native-keyboard-controller';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export interface IInputAccessoryViewProps extends InputAccessoryViewProps {}

export const InputAccessoryView = memo(
  ({children, ...rest}: IInputAccessoryViewProps) => {
    const {height, progress} = useReanimatedKeyboardAnimation();

    /* Animation */
    const contentHeight = useSharedValue(0);

    const containerAnimatedStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        progress.value,
        [0, 1],
        [height.value + contentHeight.value, height.value],
      );
      return {
        transform: [{translateY}],
      };
    });

    /* Handler */
    const onLayoutHandler = useCallback(
      (e: LayoutChangeEvent) => {
        contentHeight.value = e.nativeEvent.layout.height;
      },
      [contentHeight],
    );

    if (Platform.OS === 'ios') {
      return <RNInputAccessoryView {...rest}>{children}</RNInputAccessoryView>;
    }

    return (
      <Animated.View
        {...rest}
        onLayout={onLayoutHandler}
        style={[styles.container, containerAnimatedStyle]}>
        {children}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
