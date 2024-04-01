import React, {useMemo} from 'react';

import {useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '@components/icons';
import {BusLineCard, HStack, IconButton, Text, VStack} from '@components/ui';
import {useAppStore} from '@store/app';
import {ITransit, ITransitRoute, TransitType} from '@typescript/api/routes';
import {calculateTime} from '@utils';

export interface IDirectionRouteDetailsProps {
  route: ITransitRoute;
}

export const DirectionRouteDetails = ({route}: IDirectionRouteDetailsProps) => {
  const app = useAppStore();
  const {theme} = useStyles();

  const duration = useMemo(
    () =>
      route.transitSteps.reduce((prev, curr) => {
        if (typeof prev === 'number') {
          return (
            prev +
            calculateTime(
              curr.distance,
              curr.type === TransitType.TRANSIT
                ? app.speedLimit
                : app.walkSpeed,
            )
          );
        }
        return calculateTime(
          curr.distance,
          curr.type === TransitType.TRANSIT ? app.speedLimit : app.walkSpeed,
        );
      }, 0),
    [app.speedLimit, app.walkSpeed, route.transitSteps],
  );

  return (
    <VStack
      bg={theme.colors.surface}
      br={theme.roundness}
      p={theme.spacing[4]}
      gap={theme.spacing['4']}>
      <HStack alignItems="flex-start" justifyContent="space-between">
        <HStack flex={1} alignItems="center" gap={theme.spacing['1']}>
          {route.transitSteps.map((transit, index) => {
            return transit.type === TransitType.TRANSIT ? (
              <BusLineCard
                key={`direction-route-detail-${transit.type}-${
                  (transit.step as ITransit).route_id
                }`}
                bg={(transit.step as ITransit).color}>
                {(transit.step as ITransit).route_id.split('-')[0]}
              </BusLineCard>
            ) : (
              <BusLineCard
                key={`direction-route-detail-${transit.type}-${index}`}
                bg={theme.colors.gray3}>
                <Icon
                  name="walk"
                  color={theme.colors.text}
                  size={theme.spacing['6']}
                />
              </BusLineCard>
            );
          })}
        </HStack>
        <HStack>
          <IconButton
            w={theme.spacing[10]}
            h={theme.spacing[10]}
            br={theme.spacing['3']}
            color="blueSoft2"
            icon={<Icon name="bus" />}
          />
        </HStack>
      </HStack>
      <HStack alignItems="center" justifyContent="space-evenly">
        <HStack gap={theme.spacing['1.5']}>
          <Ionicons name="time" color={theme.colors.gray2} size={18} />
          <Text size="xs" color={theme.colors.gray2}>
            {duration} min
          </Text>
        </HStack>
        <HStack gap={theme.spacing['1.5']}>
          <Ionicons name="flag" color={theme.colors.gray2} size={18} />
          <Text size="xs" color={theme.colors.gray2}>
            {
              route.transitSteps
                .filter(t => t.type === TransitType.TRANSIT)
                .flatMap(r => (r.step as ITransit).stops).length
            }{' '}
            Stops
          </Text>
        </HStack>
        <Text size="xs" color={theme.colors.gray2}>
          {
            route.transitSteps.filter(t => t.type === TransitType.TRANSIT)
              .length
          }{' '}
          Changes
        </Text>
      </HStack>
    </VStack>
  );
};