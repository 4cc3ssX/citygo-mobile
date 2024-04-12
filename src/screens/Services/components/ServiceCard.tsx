import React, {ReactNode} from 'react';
import {Pressable} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {HStack, IVStackProps, Stack, Text, VStack} from '@components/ui';

export interface IServiceCardProps extends IVStackProps {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  subtitle: string;
  badge?: number | string;
  onPress?: () => void;
}

export const ServiceCard = ({
  icon,
  iconBg,
  title,
  subtitle,
  badge,
  onPress,
  ...rest
}: IServiceCardProps) => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <Pressable style={styles.serviceCardContainer} onPress={onPress}>
      <VStack
        maxW={theme.spacing['44']}
        p={theme.spacing['4']}
        br={theme.roundness}
        gap={theme.spacing['6']}
        bg={theme.colors.surface}
        {...rest}>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <Stack
            w={theme.spacing['10']}
            h={theme.spacing['10']}
            bg={iconBg || theme.colors.blueSoft1}
            br={theme.spacing['3']}
            justifyContent="center"
            alignItems="center">
            {typeof icon === 'string' ? <Text size="lg">{icon}</Text> : icon}
          </Stack>
          {typeof badge !== 'undefined' ? (
            <Stack
              maxW={theme.spacing['14']}
              bg={theme.colors.primary}
              br={theme.roundness}
              py={theme.spacing['0.5']}
              px={theme.spacing['3']}
              justifyContent="center"
              alignItems="center">
              <Text size="xs" color={theme.colors.white} numberOfLines={1}>
                {badge}
              </Text>
            </Stack>
          ) : null}
        </HStack>
        <HStack justifyContent="space-between" alignItems="flex-end">
          <VStack gap={theme.spacing['1']}>
            <Text size="2xs" color={theme.colors.gray2} numberOfLines={1}>
              {subtitle}
            </Text>
            <Text size="md" numberOfLines={1}>
              {title}
            </Text>
          </VStack>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={theme.colors.gray2}
          />
        </HStack>
      </VStack>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(theme => ({
  serviceCardContainer: {
    flex: 1,
  },
}));
