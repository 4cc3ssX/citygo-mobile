import React from 'react';

import {useStyles} from 'react-native-unistyles';

import {Text} from './Text';
import {IVStackProps, VStack} from './VStack';

export interface EmptyViewProps extends IVStackProps {
  title: string;
  message?: string;
}

export const EmptyList = ({title, message, ...rest}: EmptyViewProps) => {
  const {theme} = useStyles();
  return (
    <VStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap={theme.spacing['1']}
      {...rest}>
      <Text
        color={theme.colors.gray5}
        family="product"
        size="lg"
        textAlign="center">
        {title}
      </Text>
      {message && (
        <Text color={theme.colors.gray2} textAlign="center">
          {message}
        </Text>
      )}
    </VStack>
  );
};
