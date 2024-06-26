import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useStyles} from 'react-native-unistyles';

import {Container} from '@components/ui';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {appStyles} from '@styles/app';

type Props = NativeStackScreenProps<RootStackParamsList, 'HistoryDetails'>;

export const Details = ({route, navigation}: Props) => {
  const {from, to} = route.params;

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
