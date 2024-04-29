import React, {useCallback} from 'react';
import {FlatList} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {capitalize} from 'lodash';

import {
  Container,
  RowItem,
  RowItemContent,
  RowItemRight,
  Stack,
} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {useAppStore} from '@store/app';
import {appStyles} from '@styles/app';
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
    <Container hasHeader bg={theme.colors.surface} style={appStyles.container}>
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
              <RowItemContent>{capitalize(name)}</RowItemContent>
              <RowItemRight>
                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    color={theme.colors.primary}
                    size={24}
                  />
                )}
              </RowItemRight>
            </RowItem>
          );
        }}
        getItemLayout={(data, index) => ({
          length: theme.spacing['12'],
          offset: theme.spacing['12'] * index,
          index,
        })}
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
