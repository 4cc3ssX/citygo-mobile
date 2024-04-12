import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '@components/icons';
import {
  Container,
  HStack,
  RowItem,
  RowItemContent,
  RowItemLeft,
  RowItemRight,
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {useGetRoutes} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {RootTabParamsList} from '@navigations/Tab';
import {globalStyles} from '@styles/global';
import {getReadableBadgeCount} from '@utils';

import {ServiceCard} from './components/ServiceCard';

type Props = NativeStackScreenProps<
  RootTabParamsList & RootStackParamsList,
  'Services'
>;

const Services = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  const {data: routes} = useGetRoutes();

  return (
    <Container
      edges={['top', 'left', 'right']}
      style={[globalStyles.container, styles.container]}>
      <Text size="3xl" family="product">
        {t('Services')}
      </Text>
      <HStack gap={theme.spacing['2.5']}>
        <ServiceCard
          iconBg={theme.colors.errorBackground}
          icon={
            <Ionicons name="bookmarks" color={theme.colors.error} size={18} />
          }
          title="Bookmarks"
          subtitle="Bus Lines"
          badge={`+${getReadableBadgeCount(routes?.length)}`}
          onPress={() => {}}
        />
        <ServiceCard
          icon="💰"
          title="Find On Map"
          subtitle="Top-up"
          badge={'+99'}
          onPress={() => {}}
        />
      </HStack>
      <Stack gap={theme.spacing['4']}>
        <Text size="xl">{t('OtherFeatures')}</Text>
      </Stack>
      <VStack gap={theme.spacing['2.5']}>
        <RowItem
          onPress={() => navigation.navigate('Routes', {initialRoute: null})}>
          <RowItemLeft bg={theme.colors.blueSoft1}>
            <Ionicons name="bus" color={theme.colors.primary} size={20} />
          </RowItemLeft>
          <RowItemContent>Explore Bus Services</RowItemContent>
          <RowItemRight pr={theme.spacing['2']}>
            <Icon name="chevron-right" size={14} color={theme.colors.gray2} />
          </RowItemRight>
        </RowItem>
        <RowItem onPress={() => navigation.navigate('History')}>
          <RowItemLeft bg={theme.colors.blueSoft1}>
            <Ionicons
              name="document-text"
              color={theme.colors.primary}
              size={20}
            />
          </RowItemLeft>
          <RowItemContent>History</RowItemContent>
          <RowItemRight pr={theme.spacing['2']}>
            <Icon name="chevron-right" size={14} color={theme.colors.gray2} />
          </RowItemRight>
        </RowItem>
      </VStack>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingVertical: theme.spacing['3'],
    gap: theme.spacing['5'],
  },
}));

export default Services;
