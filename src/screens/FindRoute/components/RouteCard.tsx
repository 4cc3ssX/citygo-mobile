import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';
import {
  BusLineCard,
  HStack,
  IconButton,
  Separator,
  Text,
  VStack,
} from '@components/ui';
import {FindRouteValues} from '@helpers/validations';
import {useAppStore} from '@store/app';
import {ITransit, ITransitRoute, TransitType} from '@typescript/api/routes';
import {calculateTime} from '@utils';

export interface IRouteCardProps extends ITransitRoute {
  to: FindRouteValues['to'];
  onPress?: () => void;
}

export const RouteCard = ({to, transitSteps, onPress}: IRouteCardProps) => {
  const {walkSpeed, speedLimit} = useAppStore();
  const {styles, theme} = useStyles(stylesheet);

  const duration = useMemo(
    () =>
      transitSteps.reduce((prev, curr) => {
        if (typeof prev === 'number') {
          return (
            prev +
            calculateTime(
              curr.distance,
              curr.type === TransitType.TRANSIT ? speedLimit : walkSpeed,
            )
          );
        }
        return calculateTime(
          curr.distance,
          curr.type === TransitType.TRANSIT ? speedLimit : walkSpeed,
        );
      }, 0),
    [speedLimit, transitSteps, walkSpeed],
  );
  return (
    <Pressable onPress={onPress}>
      <VStack
        bw={1}
        br={theme.roundness}
        bc={theme.colors.border}
        py={theme.spacing['4']}
        px={theme.spacing['6']}
        gap={theme.spacing['3']}>
        <HStack alignItems="center">
          <VStack flex={1} gap={theme.spacing['0.5']}>
            <Text size="xs">To</Text>
            <Text family="product" size="lg" numberOfLines={1}>
              {to.name}
            </Text>
          </VStack>
          <HStack gap={theme.spacing['3']}>
            <IconButton
              w={theme.spacing[10]}
              h={theme.spacing[10]}
              br={theme.spacing['3']}
              color="blueSoft2"
              icon={<Icon name="bus" />}
            />
            <IconButton
              w={theme.spacing[10]}
              h={theme.spacing[10]}
              br={theme.spacing['3']}
              color="background"
              icon={<Icon name="bookmark" color={theme.colors.gray5} />}
            />
          </HStack>
        </HStack>
        <HStack alignItems="center">
          <Icon
            name="gps"
            color={theme.colors.gray5}
            size={theme.spacing['6']}
          />
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
                    <BusLineCard bg={(transit.step as ITransit).color}>
                      {(transit.step as ITransit).route_id.split('-')[0]}
                    </BusLineCard>
                  ) : (
                    <BusLineCard bg={theme.colors.gray3}>
                      <Icon
                        name="walk"
                        color={theme.colors.text}
                        size={theme.spacing['6']}
                      />
                    </BusLineCard>
                  )}

                  <Separator
                    flex={1}
                    size={2}
                    color={
                      isLast
                        ? theme.colors.gray4
                        : (transit.step as ITransit).color
                    }
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
          <Icon
            name="pin"
            color={theme.colors.gray5}
            size={theme.spacing['6']}
          />
        </HStack>
        <Separator />
        <HStack alignItems="center" justifyContent="space-between">
          <Text size="xs">Duration: {duration} min</Text>
          <Text size="xs">{transitSteps.length} Changes</Text>
        </HStack>
      </VStack>

      <View style={styles.indicatorContainer}>
        <Separator
          br={theme.roundness}
          color={theme.colors.success}
          direction="vertical"
          size={2}
          h={theme.spacing['18']}
        />
      </View>
    </Pressable>
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
