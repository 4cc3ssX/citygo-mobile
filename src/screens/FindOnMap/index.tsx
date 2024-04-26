import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useStyles} from 'react-native-unistyles';

import {Container} from '@components/ui';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {appStyles} from '@styles/app';

type Props = NativeStackScreenProps<RootStackParamsList, 'FindOnMap'>;

export const FindOnMaps = ({route, navigation}: Props) => {
  const {} = route.params;

  const {theme} = useStyles();
  const app = useAppStore();

  return (
    <Container
      barStyle="light-content"
      hasHeader
      bg={theme.colors.surface}
      style={appStyles.container}
    >

    </Container>
  );
};
