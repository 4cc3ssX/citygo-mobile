import React from 'react';
import {FlashList} from '@shopify/flash-list';

import {useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Container, RowItem} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {supportedLanguages, supportedLng} from '@locales/helpers';
import {useAppStore} from '@store/app';

const Language = () => {
  const themeName = useThemeName();
  const {theme} = useStyles();
  const app = useAppStore();
  return (
    <Container
      barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
      bg={theme.colors.surface}>
      <FlashList
        showsVerticalScrollIndicator={false}
        data={Object.keys(supportedLanguages)}
        estimatedItemSize={theme.spacing['12']}
        renderItem={({item: lang}) => {
          return (
            <RowItem
              h={theme.spacing['12']}
              bg={theme.colors.surface}
              p={0}
              onPress={() => app.setLanguage(lang as supportedLng)}>
              <RowItem.Content>
                {supportedLanguages[lang as supportedLng]}
              </RowItem.Content>
              <RowItem.Right>
                {app.language === lang && (
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </RowItem.Right>
            </RowItem>
          );
        }}
      />
    </Container>
  );
};

export default Language;
