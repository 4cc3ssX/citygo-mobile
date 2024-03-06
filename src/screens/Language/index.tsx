import React, {useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Container, Radio, RowItem, Stack, Text} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {supportedLanguages, supportedLng} from '@locales/helpers';
import {useAppStore} from '@store/app';
import {globalStyles} from '@styles/global';

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
    <Container
      hasHeader
      barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
      style={globalStyles.container}>
      <FlashList
        showsVerticalScrollIndicator={false}
        data={Object.keys(supportedLanguages)}
        estimatedItemSize={theme.spacing['16']}
        ItemSeparatorComponent={itemSeparatorComponent}
        renderItem={({item: lang}) => {
          const isSelected = app.language === lang;
          return (
            <RowItem
              bw={2}
              bc={isSelected ? theme.colors.primary : theme.colors.border}
              bg={theme.colors.background}
              onPress={() => app.setLanguage(lang as supportedLng)}>
              <RowItem.Left bg={theme.colors.background}>
                <Text size="xl" textAlign="center">
                  {flags[lang as supportedLng]}
                </Text>
              </RowItem.Left>
              <RowItem.Content>
                {supportedLanguages[lang as supportedLng]}
              </RowItem.Content>
              <RowItem.Right pr={theme.spacing['3']}>
                <Radio isChecked={isSelected} />
              </RowItem.Right>
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
