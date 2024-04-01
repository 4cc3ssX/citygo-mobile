import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, ViewProps} from 'react-native';
import {useBottomSheet} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';

const CustomBackdropComponent = memo(
  ({
    animatedIndex,
    opacity = 0.5,
    appearsOnIndex = 1,
    disappearsOnIndex = 0,
    pressBehavior = 'close',
    enableTouchThrough = false,
    onPress,
    style,
    children,
  }: BottomSheetDefaultBackdropProps) => {
    //#region hooks
    const {snapToIndex, close} = useBottomSheet();
    const isMounted = useRef(false);
    //#endregion

    //#region variables
    const [pointerEvents, setPointerEvents] = useState<
      ViewProps['pointerEvents']
    >(enableTouchThrough ? 'none' : 'auto');
    //#endregion

    //#region callbacks
    const handleOnPress = useCallback(() => {
      onPress?.();

      if (pressBehavior === 'close') {
        close();
      } else if (pressBehavior === 'collapse') {
        snapToIndex(disappearsOnIndex as number);
      } else if (typeof pressBehavior === 'number') {
        snapToIndex(pressBehavior);
      }
    }, [snapToIndex, close, disappearsOnIndex, pressBehavior, onPress]);
    const handleContainerTouchability = useCallback(
      (shouldDisableTouchability: boolean) => {
        isMounted.current &&
          setPointerEvents(shouldDisableTouchability ? 'none' : 'auto');
      },
      [],
    );
    //#endregion

    //#region tap gesture
    const tapHandler = useMemo(() => {
      let gesture = Gesture.Tap().onEnd(() => {
        runOnJS(handleOnPress)();
      });
      return gesture;
    }, [handleOnPress]);
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: interpolate(
          animatedIndex.value,
          [-1, disappearsOnIndex, appearsOnIndex],
          [0, 0, opacity],
          Extrapolation.CLAMP,
        ),
      }),
      [animatedIndex.value, appearsOnIndex, disappearsOnIndex, opacity],
    );
    const containerStyle = useMemo(
      () => [
        StyleSheet.absoluteFill,
        {backgroundColor: '#000000'},
        style,
        containerAnimatedStyle,
      ],
      [style, containerAnimatedStyle],
    );
    //#endregion

    //#region effects
    useAnimatedReaction(
      () => animatedIndex.value <= disappearsOnIndex,
      (shouldDisableTouchability, previous) => {
        if (shouldDisableTouchability === previous) {
          return;
        }
        runOnJS(handleContainerTouchability)(shouldDisableTouchability);
      },
      [disappearsOnIndex],
    );

    // addressing updating the state after unmounting.
    // [link](https://github.com/gorhom/react-native-bottom-sheet/issues/1376)
    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);
    //#endregion

    const AnimatedView = (
      <Animated.View style={containerStyle} pointerEvents={pointerEvents}>
        {children}
      </Animated.View>
    );

    return pressBehavior !== 'none' ? (
      <GestureDetector gesture={tapHandler}>{AnimatedView}</GestureDetector>
    ) : (
      AnimatedView
    );
  },
);

const CustomBackdrop = memo(CustomBackdropComponent);
CustomBackdrop.displayName = 'BottomSheetCustomBackdrop';

export {CustomBackdrop};
