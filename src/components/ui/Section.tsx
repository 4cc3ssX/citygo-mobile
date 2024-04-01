import React, {memo} from 'react';

import {useStyles} from 'react-native-unistyles';

import {Text} from './Text';
import {IVStackProps, VStack} from './VStack';

export interface ISectionProps extends IVStackProps {}

export interface ISectionChildProps extends IVStackProps {}

export const Section = memo(({children, ...rest}: ISectionProps) => {
  const {theme} = useStyles();

  return (
    <VStack gap={theme.spacing['5']} {...rest}>
      {children}
    </VStack>
  );
});

export const SectionTitle = memo(({children, ...rest}: ISectionChildProps) => {
  return (
    <VStack {...rest}>
      {typeof children === 'string' ? (
        <Text family="product" size="xl">
          {children}
        </Text>
      ) : (
        children
      )}
    </VStack>
  );
});

export const SectionContent = memo(({...rest}: ISectionChildProps) => {
  return <VStack {...rest} />;
});
