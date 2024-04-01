import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '@components/icons';
import {
  BusLineCard,
  HStack,
  JoinDot,
  Link,
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {useAppStore} from '@store/app';
import {globalStyles} from '@styles/global';
import {
  ITransitPopulatedStops,
  ITransitStep,
  ITransitWalk,
  TransitType,
} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {calculateTime} from '@utils';

export interface IDirectionCardProps {
  transitStep: Omit<ITransitStep, 'step'> & {
    step: ITransitPopulatedStops & ITransitWalk;
  };
  isLast: boolean;
  onPress: (stop: IStop) => void;
}

export const DirectionCard = ({
  transitStep,
  isLast,
  onPress,
}: IDirectionCardProps) => {
  const {walkSpeed, language} = useAppStore();
  const {styles, theme} = useStyles(stylesheet);

  /* State */
  const [viewStops, setViewStops] = useState(false);

  return (
    <VStack>
      <HStack alignItems="center" gap={theme.spacing['2']}>
        <BusLineCard
          bg={
            transitStep.type === TransitType.WALK
              ? theme.colors.gray3
              : transitStep.step.color
          }>
          {transitStep.type === TransitType.WALK ? (
            <Icon name="walk" color={theme.colors.text} size={22} />
          ) : (
            transitStep.step.route_id.split('-')[0]
          )}
        </BusLineCard>
        {transitStep.type === TransitType.WALK ? (
          <HStack
            flex={1}
            px={theme.spacing['3']}
            br={10}
            h={theme.spacing['11']}
            alignItems="center"
            justifyContent="center"
            gap={theme.spacing['1']}>
            <View style={globalStyles.flex}>
              <Text size="sm">
                Walk {calculateTime(transitStep.distance, walkSpeed)} mins{' '}
              </Text>
            </View>
            <Text size="xs" color={theme.colors.gray2}>
              {transitStep.distance.toFixed(2)} km
            </Text>
          </HStack>
        ) : (
          <HStack
            flex={1}
            px={theme.spacing['3']}
            bg={theme.colors.gray3}
            br={10}
            h={theme.spacing['11']}
            alignItems="center"
            justifyContent="center"
            gap={theme.spacing['1']}>
            <View style={globalStyles.flex}>
              <Text size="xs" numberOfLines={2}>
                {transitStep.step.name[language]}
              </Text>
            </View>
            <Text size="xs" color={theme.colors.gray2}>
              {transitStep.distance.toFixed(2)} km
            </Text>
          </HStack>
        )}
      </HStack>
      {transitStep.type === TransitType.TRANSIT ? (
        <>
          <HStack alignItems="center">
            <JoinDot color={transitStep.step.color} />
            <Pressable onPress={() => onPress(transitStep.step.stops.at(0)!)}>
              <Text size="sm">
                {transitStep.step.stops.at(0)?.name[language]}
              </Text>
            </Pressable>
          </HStack>
          {transitStep.step.stops.length > 2 && (
            <HStack alignItems="flex-start">
              <JoinDot color={transitStep.step.color} showDot={false} />
              <VStack
                px={theme.spacing['2']}
                py={theme.spacing[2.5]}
                style={styles.viewMoreContainer}>
                <Link
                  underlined={false}
                  color={theme.colors.text}
                  onPress={() => setViewStops(!viewStops)}>
                  <HStack alignItems="center" gap={theme.spacing['1']}>
                    <Ionicons
                      name="chevron-down"
                      color={theme.colors.text}
                      size={14}
                    />
                    <Text>
                      {viewStops ? 'Hide' : 'View'}{' '}
                      {transitStep.step.stops.length - 2} bus stops
                    </Text>
                  </HStack>
                </Link>
                {viewStops && (
                  <Animated.View
                    entering={FadeInUp}
                    exiting={FadeOutDown}
                    style={styles.viewMoreStopsContainer}>
                    {transitStep.step.stops.slice(1, -1).map((stop, index) => {
                      return (
                        <HStack
                          key={`stops-${stop.id}-${index}`}
                          pl={theme.spacing['4.5']} // icon size + gap
                          h={theme.spacing['8']}
                          alignItems="center">
                          <JoinDot
                            color={transitStep.step.color}
                            style={styles.joinDotContainer}
                            dotStyle={styles.joinDotStyle}
                          />
                          <Pressable onPress={() => onPress(stop)}>
                            <Text>{stop.name[language]}</Text>
                          </Pressable>
                        </HStack>
                      );
                    })}
                  </Animated.View>
                )}
              </VStack>
            </HStack>
          )}
          <HStack alignItems="center">
            {isLast ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                w={theme.spacing['10']}
                h={theme.spacing['10']}>
                <Icon name="pin" color={theme.colors.gray2} size={24} />
              </Stack>
            ) : (
              <JoinDot color={transitStep.step.color} />
            )}
            <Pressable onPress={() => onPress(transitStep.step.stops.at(-1)!)}>
              <Text>{transitStep.step.stops.at(-1)?.name[language]}</Text>
            </Pressable>
          </HStack>
        </>
      ) : null}
    </VStack>
  );
};

const stylesheet = createStyleSheet(theme => ({
  viewMoreContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  viewMoreStopsContainer: {
    paddingTop: theme.spacing['2.5'],
  },
  joinDotContainer: {
    position: 'absolute',
    left: -theme.spacing['10'] - theme.spacing['2'],
    top: 2,
    bottom: 0,
  },
  joinDotStyle: {
    top: theme.spacing['10'] / 2 - 16,
  },
}));
