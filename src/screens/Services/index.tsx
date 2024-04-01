import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Container, HStack, Stack, Text} from '@components/ui';
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

  const findOnMapHandler = (type: 'routes') => {
    navigation.navigate('Routes', {
      initialRoute: null,
    });
  };

  return (
    <Container
      edges={['top', 'left', 'right']}
      style={[globalStyles.container, styles.container]}>
      <Text size="3xl" family="product">
        {t('Services')}
      </Text>
      <HStack gap={theme.spacing['2.5']}>
        <ServiceCard
          icon="📍"
          title="Find On Map"
          subtitle="Bus Lines"
          badge={`+${getReadableBadgeCount(routes?.length)}`}
          onPress={() => findOnMapHandler('routes')}
        />
        <ServiceCard
          icon="💰"
          title="Find On Map"
          subtitle="Top-up"
          badge={`+99`}
          onPress={() => findOnMapHandler('routes')}
        />
      </HStack>
      <Stack gap={theme.spacing['4']}>
        <Text size="xl">{t('OtherFeatures')}</Text>
      </Stack>
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
