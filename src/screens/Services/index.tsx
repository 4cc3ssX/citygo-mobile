import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {useStyles} from 'react-native-unistyles';

import {Container, Text} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {RootTabParamsList} from '@navigations/Tab';

type Props = NativeStackScreenProps<RootTabParamsList, 'Services'>;

const Services = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeName = useThemeName();
  const {theme} = useStyles();
  return (
    <Container
      edges={['top', 'left', 'right']}
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}>
      <Text>services</Text>
    </Container>
  );
};

export default Services;
