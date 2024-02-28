import React from 'react';

import {useStyles} from 'react-native-unistyles';

import {Text} from './Text';
import {IVStackProps, VStack} from './VStack';

export interface ISectionProps extends IVStackProps {}

export interface ISectionChildProps extends IVStackProps {}

const Section = ({children, ...rest}: ISectionProps) => {
  const {theme} = useStyles();

  return (
    <VStack gap={theme.spacing['5']} {...rest}>
      {children}
    </VStack>
  );
};

Section.Title = ({children, ...rest}: ISectionChildProps) => {
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
};

Section.Content = ({...rest}: ISectionChildProps) => {
  return <VStack {...rest} />;
};

export {Section};
