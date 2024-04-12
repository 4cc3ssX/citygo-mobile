import React, {useMemo} from 'react';

import {useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';
import {
  BusLineCard,
  HStack,
  IconButton,
  Separator,
  Stack,
  StopProgress,
  Text,
  VStack,
} from '@components/ui';
import {useAppStore} from '@store/app';
import {
  ITransitPopulatedStops,
  ITransitStep,
  TransitType,
} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';
import {calculateTime} from '@utils';

export interface IActionCardProps {
  initial: boolean;
  step: ITransitStep<ITransitPopulatedStops>;
  currentStop: IStop;
  stops: IStop[];
  speed: number;
}

export const ActionCard = ({
  initial,
  step: {type, step, distance},
  currentStop,
  stops,
  speed,
}: IActionCardProps) => {
  const {language} = useAppStore();
  const {theme} = useStyles();

  const currentStopIndex = useMemo(
    () => stops.findIndex(stop => stop.id === currentStop.id),
    [currentStop.id, stops],
  );

  const nextStop = useMemo(
    () => (initial ? currentStop : stops[currentStopIndex + 1]),
    [currentStop, currentStopIndex, initial, stops],
  );

  const remainingStops = useMemo(() => {
    return stops.slice(currentStopIndex);
  }, [currentStopIndex, stops]);

  return (
    <Stack
      br={theme.roundness}
      bg={theme.colors.surface}
      p={theme.spacing['3.5']}
      gap={theme.spacing['3.5']}>
      <HStack alignItems="center" gap={theme.spacing['4']}>
        <BusLineCard
          bg={
            type === TransitType.WALK
              ? theme.colors.gray3
              : (step as ITransitPopulatedStops).color
          }>
          {type === TransitType.TRANSIT ? (
            (step as ITransitPopulatedStops).route_id
          ) : (
            <Icon name="walk" color={theme.colors.text} size={24} />
          )}
        </BusLineCard>
        <VStack flex={1}>
          <Text size="md">to {nextStop.name[language]}</Text>
          <Text size="xs" color={theme.colors.gray2}>
            {remainingStops.length} Stops left
          </Text>
        </VStack>
        <IconButton
          icon={<Icon name="bell" color={theme.colors.primary} size={22} />}
        />
      </HStack>
      <Separator />
      <HStack alignItems="center" gap={theme.spacing['3']}>
        <StopProgress
          flex={1}
          mx={theme.spacing['3']}
          color={theme.colors.warning}
          remainingStops={remainingStops.length}
          totalStops={stops.length}
        />
        <VStack alignItems="center">
          <Text size="xs" textAlign="center" color={theme.colors.gray2}>
            Duration
          </Text>
          <Text size="md" textAlign="center" numberOfLines={1}>
            {calculateTime(distance, speed)} min
          </Text>
        </VStack>
      </HStack>
    </Stack>
  );
};
