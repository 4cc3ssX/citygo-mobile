import React, {memo, useMemo} from 'react';
import {Pressable} from 'react-native';

import {useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import dayjs from 'dayjs';

import {BusLineCard, HStack, Link, Stack, Text, VStack} from '@components/ui';
import {useAppStore} from '@store/app';
import {IRecentRoute} from '@store/types';
import {ITransit, TransitType} from '@typescript/api/routes';

export interface IHistoryCardProps extends IRecentRoute {
  onPress: () => void;
  onRestart: () => void;
  onLongPress?: () => void;
}

const HistoryCard = ({
  from,
  to,
  transitSteps,
  startTime,
  onPress,
  onRestart,
  onLongPress,
}: IHistoryCardProps) => {
  const {theme} = useStyles();
  const app = useAppStore();

  const steps = useMemo(
    () => transitSteps.filter(transit => transit.type === TransitType.TRANSIT),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <HStack py={theme.spacing['3']} gap={theme.spacing['3']}>
        <Stack pt={theme.spacing['1']}>
          <Ionicons name="bus" color={theme.colors.primary} size={20} />
        </Stack>
        <VStack flex={2} gap={theme.spacing['3']}>
          <Text size="md" numberOfLines={2}>
            {from.name[app.language]} to {to.name[app.language]}
          </Text>
          <Text size="xs" color={theme.colors.gray2} numberOfLines={1}>
            {dayjs.unix(startTime).format('DD MMM YYYY, hh:mm A')}
          </Text>
          <Link
            underlined={false}
            type="medium"
            color={theme.colors.primary}
            onPress={onRestart}>
            Restart
          </Link>
        </VStack>
        <HStack alignSelf="center" gap={theme.spacing['1']}>
          {steps.slice(0, 2).map((transit, index) => {
            if (index === 1 && steps.length > 2) {
              return (
                <BusLineCard
                  key={`transit-${transit.type}-${
                    (transit.step as ITransit).route_id
                  }`}
                  bg={theme.colors.gray3}
                  color={theme.colors.gray5}>
                  {`+${steps.length - 1}`}
                </BusLineCard>
              );
            }
            return (
              <BusLineCard
                key={`transit-${transit.type}-${
                  (transit.step as ITransit).route_id
                }`}
                bg={(transit.step as ITransit).color}>
                {(transit.step as ITransit).route_id}
              </BusLineCard>
            );
          })}
        </HStack>
      </HStack>
    </Pressable>
  );
};

export default memo(HistoryCard);
