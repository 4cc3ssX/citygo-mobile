import {
  Easing,
  ReduceMotion,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

export const defaultSpringConfig: WithSpringConfig = {
  mass: 1,
  damping: 10,
  stiffness: 50,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
};

export const defaultTimingConfig: WithTimingConfig = {
  duration: 600,
  easing: Easing.linear,
  reduceMotion: ReduceMotion.System,
};
