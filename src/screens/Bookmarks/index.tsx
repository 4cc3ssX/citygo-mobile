import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {Container} from '@components/ui';
import {RootStackParamsList} from '@navigations/Stack';
import {appStyles} from '@styles/app';
import { useStyles } from 'react-native-unistyles';

type Props = NativeStackScreenProps<RootStackParamsList, 'Bookmarks'>;

const Bookmarks = ({navigation}: Props) => {
    const {theme} = useStyles();
  return (
    <Container
      hasHeader
      bg={theme.colors.surface}
      style={appStyles.container}>

      </Container>
  );
};
