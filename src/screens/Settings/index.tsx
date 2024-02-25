import React from 'react';
import {Linking} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';

import {Container} from '@components/ui';
import {supportedLanguages} from '@locales/helpers';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {IAppTheme} from '@typescript';
import { useStyles } from 'react-native-unistyles';

type Props = NativeStackScreenProps<RootStackParamsList, 'Settings'>;

export const Settings = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {theme} = useStyles();
  const app = useAppStore();
  return (
    <Container barStyle={theme.dark ? 'light-content' : 'dark-content'}>
      <List.Section>
        <List.Subheader>{t('Preferences')}</List.Subheader>
        <List.Item
          title="Language"
          description={supportedLanguages[app.language]}
          onPress={() => navigation.navigate('Language')}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>Theme</List.Subheader>
        <RadioButton.Group
          onValueChange={newValue => app.setTheme(newValue as IAppTheme)}
          value={app.theme}>
          <RadioButton.Item label="Light" value="light" />
          <RadioButton.Item label="Dark" value="dark" />
          <RadioButton.Item label="System" value="system" />
        </RadioButton.Group>
      </List.Section>
      <List.Section>
        <List.Subheader>App Permissions</List.Subheader>
        <List.Item
          title="Location"
          description="Enable location access for a personalized experience."
          onPress={Linking.openSettings}
        />
      </List.Section>
    </Container>
  );
};
