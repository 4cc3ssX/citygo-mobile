import React from 'react';

import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '@components/icons';
import {BusLineCard, HStack, Separator, Text, VStack} from '@components/ui';
import {useAppStore} from '@store/app';
import {ITransitRoute, TransitType} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';

export interface IRecentRouteCardProps extends Omit<ITransitRoute, 'distance'> {
  from: IStop;
  to: IStop;
}

export const RecentRouteCard = ({
  from,
  to,
  transitSteps,
}: IRecentRouteCardProps) => {
  const {language} = useAppStore();
  const {styles, theme} = useStyles(stylesheet);

  return (
    <VStack
      bw={1}
      br={theme.roundness}
      bc={theme.colors.border}
      py={theme.spacing['4']}
      px={theme.spacing['6']}
      gap={theme.spacing['3']}>
      <HStack
        gap={theme.spacing['2']}
        justifyContent="space-between"
        alignItems="center">
        <VStack flex={1} gap={theme.spacing['0.5']}>
          <Text color={theme.colors.gray2} size="xs">
            Start point
          </Text>
          <Text family="product" size="lg" numberOfLines={1}>
            {from.name[language]}
          </Text>
        </VStack>
        <Ionicons
          name="swap-horizontal-outline"
          color={theme.colors.primary}
          size={24}
        />
        <VStack flex={1} gap={theme.spacing['0.5']}>
          <Text color={theme.colors.gray2} size="xs" textAlign="right">
            End point
          </Text>
          <Text family="product" size="lg" textAlign="right" numberOfLines={1}>
            {to.name[language]}
          </Text>
        </VStack>
      </HStack>
      <Separator />
      <HStack alignItems="center">
        <Icon name="gps" color={theme.colors.gray5} size={theme.spacing['6']} />
        <HStack alignItems="center" flex={1}>
          <Separator
            ml={theme.spacing['2']}
            size={2}
            color={theme.colors.gray4}
            w={theme.spacing['4']}
          />
          {transitSteps.map((transit, index) => {
            const isLast = index === transitSteps.length - 1;
            return (
              <HStack
                key={`${transit.type}-${index}`}
                flex={1}
                alignItems="center"
                mr={isLast ? theme.spacing['2'] : 0}
                overflow="hidden">
                {transit.type === TransitType.TRANSIT ? (
                  <BusLineCard bg={transit.step.color}>
                    {transit.step.id.split('-')[0]}
                  </BusLineCard>
                ) : (
                  <BusLineCard bg={theme.colors.gray2}>
                    <Icon
                      name="walk"
                      color={theme.colors.gray5}
                      size={theme.spacing['6']}
                    />
                  </BusLineCard>
                )}

                <Separator
                  flex={1}
                  size={2}
                  color={isLast ? theme.colors.gray4 : transit.step.color}
                  w={
                    index > 1 && index === transitSteps.length - 2
                      ? theme.spacing['12']
                      : !isLast
                      ? theme.spacing['8']
                      : undefined
                  }
                />
              </HStack>
            );
          })}
        </HStack>
        <Icon name="pin" color={theme.colors.gray5} size={theme.spacing['6']} />
      </HStack>
    </VStack>
  );
};

const stylesheet = createStyleSheet(theme => ({
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
}));
