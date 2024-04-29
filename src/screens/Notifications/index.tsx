import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Container} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {appStyles} from '@styles/app';

type Props = NativeStackScreenProps<RootStackParamsList, 'Notifications'>;

const Notifications = ({}: Props) => {
  const {t} = useTranslation();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);
  return (
    <Container hasHeader style={[appStyles.container, styles.container]} />
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing['5'],
  },
}));

export default Notifications;
export * from './Settings';
