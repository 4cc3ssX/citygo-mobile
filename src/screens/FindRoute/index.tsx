import React, {useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ContentLoader, {Rect} from 'react-content-loader/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';
import {
  Container,
  EmptyList,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from '@components/ui';
import {useFindRoutes} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {globalStyles} from '@styles/global';
import {ITransitRoute} from '@typescript/api/routes';

import {RouteCard} from './components/RouteCard';

type Props = NativeStackScreenProps<RootStackParamsList, 'FindRoute'>;

const FindRoute = ({navigation, route}: Props) => {
  const values = route.params;

  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const {styles, theme} = useStyles(stylesheet);

  /* Query */
  const {
    isPending: isFindRoutesPending,
    data: routes,
    mutate: findRoutes,
  } = useFindRoutes();

  /* Handlers */
  const onRefresh = useCallback(() => {
    findRoutes(values);
  }, [findRoutes, values]);

  const onPressItem = useCallback(
    (transitRoute: ITransitRoute) => {
      navigation.navigate('Directions', {
        ...values,
        transitRoute,
      });
    },
    [navigation, values],
  );

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ItemSeparatorComponent = useCallback(
    () => <Stack h={theme.spacing['5']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const listEmptyComponent = useCallback(() => {
    if (!isFindRoutesPending && routes?.length === 0) {
      return <EmptyList mb={theme.spacing['10']} title="No available routes" />;
    }

    return (
      <ContentLoader
        speed={2}
        width="100%"
        height={600}
        viewBox="0 0 300 600"
        preserveAspectRatio="none"
        backgroundColor={theme.colors.background}
        foregroundColor={theme.colors.gray4}>
        {Array(3)
          .fill(0)
          .map((_value, index) => {
            const y = (theme.spacing['44'] + theme.spacing['5']) * index;

            return (
              <Rect
                key={`content-loader-${index}`}
                x="0"
                y={`${y}`}
                rx={`${theme.roundness}`}
                ry={`${theme.roundness}`}
                width="100%"
                height={theme.spacing['44']}
              />
            );
          })}
      </ContentLoader>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFindRoutesPending, routes?.length, theme.colors.background]);

  return (
    <Container
      hasHeader
      containerPaddingTop={theme.spacing['3']}
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      style={[globalStyles.container, styles.container]}>
      <VStack gap={theme.spacing['2.5']}>
        <Input
          editable={false}
          value={values.from.name}
          h={theme.spacing['16']}
          leftElement={<Icon name="gps" color={theme.colors.gray5} />}
        />
        <Input
          editable={false}
          value={values.to.name}
          h={theme.spacing['16']}
          leftElement={<Icon name="pin" color={theme.colors.gray5} />}
        />
      </VStack>
      <HStack
        mt={theme.spacing['2']}
        mb={theme.spacing['1']}
        alignItems="center"
        justifyContent="space-between">
        <Text family="product" size="xl">
          {t('AvailableRoutes')}
        </Text>
      </HStack>
      <FlatList
        data={routes}
        refreshing={isFindRoutesPending}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={listEmptyComponent}
        renderItem={({item: transit}) => (
          <RouteCard
            to={values.to}
            {...transit}
            onPress={() => onPressItem(transit)}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.routeListContainer}
      />
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing['3'],
  },
  routeListContainer: {
    paddingVertical: theme.spacing['2'],
    paddingBottom: theme.spacing['10'],
  },
}));

export default FindRoute;
