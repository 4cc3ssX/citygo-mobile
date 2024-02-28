import React from 'react';
import {FlashList} from '@shopify/flash-list';

import {useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {capitalize} from 'lodash';

import {Container, RowItem} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {useAppStore} from '@store/app';
import {appThemes} from '@theme/themes';

const AppTheme = () => {
  const app = useAppStore();
  const themeName = useThemeName();
  const {theme} = useStyles();

  return (
    <Container
      barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
      bg={theme.colors.surface}>
      <FlashList
        showsVerticalScrollIndicator={false}
        data={appThemes}
        extraData={theme.colors.surface}
        estimatedItemSize={theme.spacing['12']}
        renderItem={({item: name}) => {
          return (
            <RowItem
              h={theme.spacing['12']}
              bg={theme.colors.surface}
              p={0}
              onPress={() => app.setTheme(name)}>
              <RowItem.Content>{capitalize(name)}</RowItem.Content>
              <RowItem.Right>
                {app.theme === name && (
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

export default AppTheme;
