import React, {memo} from 'react';
import {ColorValue} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {getShortenRouteName} from '@utils/route';

import {Text} from './Text';
import {IVStackProps, VStack} from './VStack';

export interface IBusLineCardProps extends IVStackProps {
  color?: ColorValue;
}

export const BusLineCard = memo(
  ({color, children, style, ...rest}: IBusLineCardProps) => {
    const {styles, theme} = useStyles(stylesheet);

    return (
      <VStack
        alignItems="center"
        justifyContent="center"
        w={theme.spacing['10']}
        h={theme.spacing['12']}
        bg={theme.colors.primary}
        style={[styles.container, style]}
        {...rest}>
        {typeof children === 'string' ? (
          <Text
            type="semibold"
            size="sm"
            color={color || theme.colors.white}
            textAlign="center"
            numberOfLines={1}>
            {getShortenRouteName(children)}
          </Text>
        ) : (
          children
        )}
      </VStack>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    borderRadius: theme.radius['3'],
  },
}));
