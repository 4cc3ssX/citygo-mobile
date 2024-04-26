import React, {useCallback} from 'react';
import {FlatList} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {
  Container,
  Radio,
  RowItem,
  RowItemContent,
  RowItemLeft,
  RowItemRight,
  Stack,
  Text,
} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {supportedLanguages, supportedLng} from '@locales/helpers';
import {useAppStore} from '@store/app';
import {appStyles} from '@styles/app';

const flags = {
  mm: '🇲🇲',
  en: '🇺🇸',
} as const;

const Language = () => {
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);
  const app = useAppStore();

  const itemSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['2']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <Container hasHeader style={appStyles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Object.keys(supportedLanguages)}
        ItemSeparatorComponent={itemSeparatorComponent}
        renderItem={({item: lang}) => {
          const isSelected = app.language === lang;
          return (
            <RowItem
              bw={2}
              bc={isSelected ? theme.colors.primary : theme.colors.border}
              bg={theme.colors.background}
              onPress={() => app.setLanguage(lang as supportedLng)}>
              <RowItemLeft bg={theme.colors.background}>
                <Text size="xl" textAlign="center">
                  {flags[lang as supportedLng]}
                </Text>
              </RowItemLeft>
              <RowItemContent>
                {supportedLanguages[lang as supportedLng]}
              </RowItemContent>
              <RowItemRight pr={theme.spacing['3']}>
                <Radio isChecked={isSelected} />
              </RowItemRight>
            </RowItem>
          );
        }}
        contentContainerStyle={styles.container}
      />
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingVertical: theme.spacing['5'],
  },
}));

export default Language;
