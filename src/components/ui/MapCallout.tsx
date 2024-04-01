import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';

import {HStack} from './HStack';
import {Text} from './Text';

export interface IMapCalloutProps {
  canPress?: boolean;
  children: string;
}

export const MapCallout = memo(
  ({canPress = true, children}: IMapCalloutProps) => {
    const {theme} = useStyles();
    return (
      <HStack
        br={10}
        bw={StyleSheet.hairlineWidth}
        bc={theme.colors.border}
        mb={theme.spacing['1.5']}
        py={theme.spacing['2']}
        px={theme.spacing['2.5']}
        justifyContent="center"
        alignItems="center"
        bg={theme.colors.surface}
        gap={theme.spacing[1]}>
        <View style={styles.labelContainer}>
          <Text size="xs" textAlign="center">
            {children}
          </Text>
        </View>
        {canPress && (
          <Icon name="chevron-right" color={theme.colors.text} size={10} />
        )}
      </HStack>
    );
  },
);

const styles = StyleSheet.create({
  labelContainer: {
    flex: 1,
  },
});
