import React, {forwardRef} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';

import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import RNCarousel, {
  ICarouselInstance,
  TCarouselProps,
} from 'react-native-reanimated-carousel';
import {useStyles} from 'react-native-unistyles';

import {appStyles} from '@styles/app';
import {AdImage} from '@typescript/api/ads';

import {HStack} from './HStack';

const INDICATOR_WIDTH = 15;
const INDICATOR_HEIGHT = 5;

export interface ICarouselCardProps {
  image: AdImage;
  onPress: () => void;
}

export const CarouselCard = ({image, onPress}: ICarouselCardProps) => {
  const {theme} = useStyles();

  return (
    <Pressable
      style={[
        appStyles.carouselCardContainer,
        {backgroundColor: theme.colors.surface},
      ]}
      onPress={onPress}>
      <Image
        source={{uri: image.url}}
        resizeMode="stretch"
        style={StyleSheet.absoluteFillObject}
      />
    </Pressable>
  );
};

export const Carousel = forwardRef<ICarouselInstance, TCarouselProps>(
  ({data, ...rest}, ref) => {
    const {theme} = useStyles();
    const progressValue = useSharedValue<number>(0);

    return (
      <View style={appStyles.carouselContainer}>
        <RNCarousel
          ref={ref}
          pagingEnabled
          snapEnabled
          autoPlay
          autoPlayInterval={3000}
          vertical={false}
          {...rest}
          data={data}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 45,
          }}
          onProgressChange={(_, absoluteProgress) =>
            (progressValue.value = absoluteProgress)
          }
        />
        <HStack alignItems="center">
          {data.map((_, index) => (
            <PaginationItem
              inactiveBackgroundColor={theme.colors.gray4}
              backgroundColor={theme.colors.primary}
              animValue={progressValue}
              index={index}
              key={`carousel-indicator-${index}`}
              length={data.length}
            />
          ))}
        </HStack>
      </View>
    );
  },
);

const PaginationItem: React.FC<{
  index: number;
  inactiveBackgroundColor: string;
  backgroundColor: string;
  length: number;
  animValue: SharedValue<number>;
}> = ({animValue, index, length, backgroundColor, inactiveBackgroundColor}) => {
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-INDICATOR_WIDTH, 0, INDICATOR_WIDTH];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-INDICATOR_WIDTH, 0, INDICATOR_WIDTH];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={[
        {
          backgroundColor: inactiveBackgroundColor,
          width: INDICATOR_WIDTH,
          height: INDICATOR_HEIGHT,
        },
        styles.indicatorContainer,
      ]}>
      <Animated.View
        style={[
          {
            backgroundColor,
          },
          styles.indicator,
          animStyle,
        ]}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  indicatorContainer: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  indicator: {
    borderRadius: 50,
    flex: 1,
  },
});
