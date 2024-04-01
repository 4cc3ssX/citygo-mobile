import React, {memo, useEffect} from 'react';
import {View} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';
import {defaultSpringConfig} from '@helpers/animation';

import {HStack} from './HStack';
import {IStackProps} from './Stack';

export interface IStopProgress extends IStackProps {
  color: string;
  remainingStops: number;
  totalStops: number;
}

export const StopProgress = memo(
  ({color, remainingStops, totalStops, ...props}: IStopProgress) => {
    const {theme, styles} = useStyles(stylesheet);

    /* Animated Value */
    const progressValue = useSharedValue(0);
    const rightIconValue = useSharedValue(0);

    const progressDerivedValue = useDerivedValue(() => {
      return withSpring(progressValue.value, defaultSpringConfig);
    });

    const rightIconDerivedValue = useDerivedValue(() => {
      return withSpring(rightIconValue.value, defaultSpringConfig);
    });

    const animatedSeparatorStyle = useAnimatedStyle(() => {
      return {
        width: `${progressDerivedValue.value}%`,
      };
    });

    const animatedRightIconContainer = useAnimatedStyle(() => {
      return {
        right: rightIconDerivedValue.value,
      };
    });

    useEffect(() => {
      progressValue.value = ((totalStops - remainingStops) / totalStops) * 100;

      if (remainingStops === totalStops) {
        rightIconValue.value = 0;
      } else {
        rightIconValue.value = -(30 / 2) - 20 / 2;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remainingStops]);

    return (
      <HStack alignItems="center" {...props}>
        <Icon name="marker" color={color} size={20} />
        <View style={styles.separatorContainer}>
          <HStack alignItems="center" gap={theme.spacing['1']}>
            <View style={[styles.separator, styles.separatorItem]} />
            <View style={[styles.separator, styles.separatorItem]} />
            <View style={[styles.separator, styles.separatorItem]} />
            <HStack flex={1} h={3} alignItems="center">
              <View style={[styles.separator, styles.separatorItem]} />
              <Icon name="marker" color={theme.colors.gray4} size={10} />
              <View style={[styles.separator, styles.separatorItem]} />
            </HStack>
          </HStack>
          <Animated.View
            style={[
              styles.separator,
              styles.animatedSeparator,
              {backgroundColor: color},
              animatedSeparatorStyle,
            ]}>
            <Animated.View
              style={[styles.rightCircleContainer, animatedRightIconContainer]}>
              <Icon name="right-circle" size={30} color={color} />
            </Animated.View>
          </Animated.View>
        </View>
        <Icon
          name="marker"
          color={remainingStops === 0 ? color : theme.colors.gray4}
          size={20}
        />
      </HStack>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  separatorContainer: {
    flex: 1,
    zIndex: 15,
  },
  separator: {
    backgroundColor: theme.colors.gray4,
    height: 3,
  },
  separatorItem: {
    flex: 1,
  },
  animatedSeparator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 40,
  },
  rightCircleContainer: {
    position: 'absolute',
    top: -(30 / 2) + 3 / 2, // half circle + half height of progress
    backgroundColor: 'white',
    borderRadius: 999,
  },
}));
