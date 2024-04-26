import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '@components/icons';
import {BusLineCard, HStack, Separator, Text, VStack} from '@components/ui';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {IRecentRoute} from '@store/types';
import {ITransit, TransitType} from '@typescript/api/routes';

export interface IRecentRouteCardProps extends IRecentRoute {}

export interface IRouteCardPlaceholderProps {
  onPress?: () => void;
}

export const RouteCardPlaceholder = ({onPress}: IRouteCardPlaceholderProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamsList>>();
  const {styles, theme} = useStyles(stylesheet);

  /* Handler */
  const onPressHandler = useCallback(() => {
    if (!onPress) {
      navigation.navigate('Search', {});
      return;
    }

    onPress();
  }, [navigation, onPress]);

  return (
    <Pressable onPress={onPressHandler}>
      <View style={[styles.container, styles.placeholderContainer]}>
        <HStack
          alignItems="center"
          justifyContent="center"
          gap={theme.spacing['1']}>
          <Ionicons name="add" color={theme.colors.primary} size={24} />
          <Text
            type="medium"
            size="md"
            color={theme.colors.primary}
            textAlign="center">
            Start your next route
          </Text>
        </HStack>
      </View>
    </Pressable>
  );
};

export const RecentRouteCard = ({
  from,
  to,
  transitSteps,
}: IRecentRouteCardProps) => {
  const {language} = useAppStore();
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
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
                  <BusLineCard bg={(transit.step as ITransit).color}>
                    {(transit.step as ITransit).route_id}
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
        <Icon name="pin" color={theme.colors.gray5} size={theme.spacing['6']} />
      </HStack>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing['4'],
    paddingHorizontal: theme.spacing['6'],
    gap: theme.spacing['3'],
  },
  placeholderContainer: {
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.blueSoft1,
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.spacing['32'],
  },
}));
