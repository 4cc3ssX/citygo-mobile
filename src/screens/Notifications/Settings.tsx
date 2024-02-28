import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Container} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  'NotificationSettings'
>;

const NotificationSettings = (props: Props) => {
  const {t} = useTranslation();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);
  return (
    <Container
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      style={styles.container}
    />
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing['5'],
  },
}));

export {NotificationSettings};
