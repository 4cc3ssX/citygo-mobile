import React, {memo} from 'react';
import {StyleSheet, ViewProps} from 'react-native';

import {useSoftInputHeightChanged} from 'react-native-avoid-softinput';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet} from 'react-native-unistyles';

export interface IFContainerProps extends ViewProps {
  keyboardAvoiding?: boolean;
  position?: 'top' | 'bottom';
}

export const FContainer = memo(
  ({
    keyboardAvoiding = false,
    position = 'bottom',
    style,
    ...rest
  }: IFContainerProps) => {
    const insets = useSafeAreaInsets();
    const buttonContainerPaddingValue = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => {
      return {
        paddingBottom: buttonContainerPaddingValue.value,
      };
    });

    useSoftInputHeightChanged(({softInputHeight}) => {
      if (keyboardAvoiding) {
        buttonContainerPaddingValue.value = withTiming(softInputHeight);
      }
    });

    return (
      <Animated.View
        style={[
          styles.container(position),
          style,
          containerStyle,
          {
            paddingTop:
              StyleSheet.flatten(style)?.paddingTop ||
              0 + (position === 'top' ? insets.top : 0),
            paddingBottom:
              StyleSheet.flatten(style)?.paddingBottom ||
              0 + (position === 'bottom' ? insets.bottom : 0),
          },
        ]}
        {...rest}
      />
    );
  },
);

FContainer.displayName = 'FloatContainer';

const styles = createStyleSheet({
  container: (position: IFContainerProps['position']) => ({
    position: 'absolute',
    top: position === 'top' ? 0 : undefined,
    bottom: position === 'bottom' ? 0 : undefined,
    left: 0,
    right: 0,
    zIndex: 999,
  }),
});
