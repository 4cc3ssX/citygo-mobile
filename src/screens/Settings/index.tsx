import React, {useCallback} from 'react';
import {SectionList} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Container,
  RowItem,
  RowItemContent,
  RowItemLeft,
  RowItemRight,
  Stack,
  Text,
} from '@components/ui';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {appStyles} from '@styles/app';

import {settings} from './data/settings';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Settings'
>;

const Settings = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  const sectionSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['5']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const itemSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['2']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Container
      edges={['top', 'left', 'right']}
      style={[appStyles.container, styles.container]}>
      <Text size="3xl" family="product">
        {t('Settings')}
      </Text>

      <SectionList
        sections={settings}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({section: {title}}) => (
          <Text family="product" size="xl">
            {t(title as any)}
          </Text>
        )}
        SectionSeparatorComponent={sectionSeparatorComponent}
        ItemSeparatorComponent={itemSeparatorComponent}
        renderItem={({item}) => (
          <RowItem onPress={() => navigation.navigate(item.to as any)}>
            <RowItemLeft bg={theme.colors.blueSoft1}>
              {item.icon({color: theme.colors.primary, size: 20})}
            </RowItemLeft>
            <RowItemContent>{t(item.title as any)}</RowItemContent>
            <RowItemRight pr={theme.spacing['3']}>
              <Ionicons
                name="chevron-forward-outline"
                size={14}
                color={theme.colors.gray2}
              />
            </RowItemRight>
          </RowItem>
        )}
        keyExtractor={item => `${item.title}`}
      />
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingVertical: theme.spacing['3'],
    gap: theme.spacing['5'],
  },
}));

export default Settings;
