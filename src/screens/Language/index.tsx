import React from 'react';

import {Container} from '@components/ui';
import {supportedLanguages, supportedLng} from '@locales/helpers';
import {useAppStore} from '@store/app';
import { useStyles } from 'react-native-unistyles';

const Language = () => {
  const {theme} = useStyles();
  const app = useAppStore();
  return (
    <Container barStyle={theme.dark ? 'light-content' : 'dark-content'}>
      <RadioButton.Group
        onValueChange={newValue => app.setLanguage(newValue as supportedLng)}
        value={app.language}>
        {Object.keys(supportedLanguages).map(lang => (
          <RadioButton.Item
            key={lang}
            label={supportedLanguages[lang as supportedLng]}
            value={lang}
          />
        ))}
      </RadioButton.Group>
    </Container>
  );
};

export default Language;
