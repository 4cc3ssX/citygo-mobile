import React, {memo} from 'react';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from './Text';
import {IVStackProps, VStack} from './VStack';

export interface IBusLineCardProps extends IVStackProps {}

export const BusLineCard = memo(
  ({children, style, ...rest}: IBusLineCardProps) => {
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
            color={theme.colors.white}
            textAlign="center"
            numberOfLines={1}>
            {children}
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
