import React, {useCallback} from 'react';
import {FlatList} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {capitalize} from 'lodash';

import {Container, RowItem, Stack} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {useAppStore} from '@store/app';
import {globalStyles} from '@styles/global';
import {appThemes} from '@theme/themes';

const AppTheme = () => {
  const app = useAppStore();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  const itemSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['2']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <Container
      barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
      bg={theme.colors.surface}
      style={globalStyles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={appThemes}
        extraData={theme.colors.surface}
        ItemSeparatorComponent={itemSeparatorComponent}
        renderItem={({item: name}) => {
          const isSelected = app.theme === name;
          return (
            <RowItem
              h={theme.spacing['12']}
              p={0}
              bw={0}
              bg={theme.colors.surface}
              px={theme.spacing['3']}
              onPress={() => app.setTheme(name)}>
              <RowItem.Content>{capitalize(name)}</RowItem.Content>
              <RowItem.Right>
                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    color={theme.colors.primary}
                    size={24}
                  />
                )}
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
    paddingVertical: theme.spacing['2'],
  },
}));
export default AppTheme;
