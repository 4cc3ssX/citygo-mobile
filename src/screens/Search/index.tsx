import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, InputAccessoryView, TextInput, View} from 'react-native';
import {zodResolver} from '@hookform/resolvers/zod';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Fuse, {IFuseOptions} from 'fuse.js';

import {Icon} from '@components/icons';
import {
  Button,
  Container,
  EmptyList,
  FContainer,
  IconButton,
  Input,
  RowItem,
  Separator,
  Text,
  VStack,
} from '@components/ui';
import {findRouteSchema, FindRouteValues} from '@helpers/validations';
import {useGetStops} from '@hooks/api';
import {useThemeName} from '@hooks/useThemeName';
import {RootStackParamsList} from '@navigations/Stack';
import {useAppStore} from '@store/app';
import {globalStyles} from '@styles/global';
import {IStop} from '@typescript/api/stops';

type Props = NativeStackScreenProps<RootStackParamsList, 'Search'>;

const fuseOptions: IFuseOptions<IStop> = {
  threshold: 0.2,
  keys: [
    'name.en',
    'name.mm',
    'road.en',
    'road.mm',
    'township.en',
    'township.mm',
  ],
};

const chooseOnMapButtonNativeID = 'choose-location-on-map';

const Search = ({navigation}: Props) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const app = useAppStore();

  const {styles, theme} = useStyles(stylesheet);

  /* State */
  const [searchStops, setSearchStops] = useState<IStop[]>([]);

  /* Query */
  const {data: stops} = useGetStops();

  const fuse = useMemo(() => new Fuse(stops || [], fuseOptions), [stops]);

  /* Form */
  const {
    control,
    setValue,
    getValues,
    resetField,

    formState: {isValid},
    handleSubmit,
  } = useForm<FindRouteValues>({
    resolver: zodResolver(findRouteSchema),
    mode: 'onChange',
  });

  /* Ref */
  const fromInputRef = useRef<TextInput>(null);
  const toInputRef = useRef<TextInput>(null);
  const destRef = useRef<'from' | 'to'>('from');

  /* Handlers */
  const onSubmitHandler = useCallback(
    (values: FindRouteValues) => {
      navigation.navigate('FindRoute', values);
    },
    [navigation],
  );

  const onSelectStop = useCallback(
    (stop: IStop) => {
      const dest = destRef.current;

      if (dest === 'from') {
        fromInputRef.current?.blur();
        toInputRef.current?.focus();
      } else {
        toInputRef.current?.blur();
      }

      setValue(
        dest,
        {
          preferId: stop.id,
          name: stop.name.en,
          road: stop.road.en,
          township: stop.township.en,
        },
        {
          shouldValidate: true,
        },
      );

      // reset to default
      setSearchStops(stops || []);
    },
    [setValue, stops],
  );

  const onSwapHandler = useCallback(() => {
    const values = getValues();

    if (values.from || values.to) {
      setValue('from', values.to);
      setValue('to', values.from);
    }
  }, [getValues, setValue]);

  const onChangeHandler = useCallback(
    (value: string) => {
      const dest = destRef.current;
      if (value) {
        const fuseResult = fuse.search(value);

        const filteredStops = fuseResult
          .slice(0, 20)
          .map(result => result.item);

        setSearchStops(filteredStops);
      } else {
        resetField(dest);
        setSearchStops(stops || []);
      }
    },
    [fuse, resetField, stops],
  );

  /* Effects */
  useEffect(() => {
    if (stops) {
      setSearchStops(stops.slice(0, 20));
    }
  }, [stops]);

  const itemSeparatorComponent = useCallback(
    () => <Separator my={theme.spacing['1']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const listEmptyComponent = useCallback(() => {
    return <EmptyList mb={theme.spacing['10']} title="No stops found" />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      edges={{bottom: 'off'}}
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      bg={theme.colors.surface}
      style={[globalStyles.container, styles.container]}>
      <InputAccessoryView nativeID={chooseOnMapButtonNativeID}>
        <Button
          br={0}
          variant="ghost"
          bg={theme.colors.blueSoft1}
          icon={<Ionicons name="map" color={theme.colors.primary} size={22} />}>
          {t('ChooseLocationOnMap')}
        </Button>
      </InputAccessoryView>
      <FContainer style={styles.findRouteContainer(insets)}>
        <Button
          disabled={!isValid}
          size="lg"
          h={theme.spacing['12']}
          onPress={handleSubmit(onSubmitHandler)}>
          {t('FindTheBestRoute')}
        </Button>
      </FContainer>
      <View>
        <View style={[styles.swapContainer]}>
          <IconButton
            size="md"
            color="primary"
            icon={
              <Ionicons
                name="swap-vertical-outline"
                color={theme.colors.white}
                size={24}
              />
            }
            onPress={onSwapHandler}
          />
        </View>
        <VStack gap={theme.spacing['2.5']}>
          <Controller
            control={control}
            render={({field: {value}}) => {
              const selectedStop = stops?.find(
                stop => stop.id === value?.preferId,
              );

              return (
                <Input
                  ref={fromInputRef}
                  defaultValue={selectedStop?.name[app.language]}
                  h={theme.spacing['16']}
                  placeholder="Start Point"
                  leftElement={<Icon name="gps" color={theme.colors.gray5} />}
                  onFocus={() => (destRef.current = 'from')}
                  inputAccessoryViewID={chooseOnMapButtonNativeID}
                  onChangeText={onChangeHandler}
                />
              );
            }}
            name="from"
          />
          <Controller
            control={control}
            render={({field: {value}}) => {
              const selectedStop = stops?.find(
                stop => stop.id === value?.preferId,
              );

              return (
                <Input
                  ref={toInputRef}
                  defaultValue={selectedStop?.name[app.language]}
                  h={theme.spacing['16']}
                  placeholder="End Point"
                  leftElement={<Icon name="pin" color={theme.colors.gray5} />}
                  onFocus={() => (destRef.current = 'to')}
                  inputAccessoryViewID={chooseOnMapButtonNativeID}
                  onChangeText={onChangeHandler}
                />
              );
            }}
            name="to"
          />
        </VStack>
      </View>

      <FlatList
        data={searchStops}
        extraData={themeName}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={listEmptyComponent}
        renderItem={({item: stop}) => (
          <RowItem onPress={() => onSelectStop(stop)}>
            <RowItem.Left bg={theme.colors.background}>
              <Text size="xl" textAlign="center">
                📍
              </Text>
            </RowItem.Left>
            <RowItem.Content>
              <Text size="md">{stop.name[app.language]}</Text>
              <Text size="xs" color={theme.colors.gray2} numberOfLines={1}>
                {stop.road[app.language]}, {stop.township[app.language]}
              </Text>
            </RowItem.Content>
          </RowItem>
        )}
        contentContainerStyle={styles.listContainer(insets.bottom)}
      />
    </Container>
  );
};
const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingVertical: theme.spacing['5'],
    gap: theme.spacing['5'],
  },
  swapContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: theme.spacing['8'],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  findRouteContainer: (insets: EdgeInsets) => ({
    paddingBottom: insets.bottom + theme.spacing['3.5'],
    paddingHorizontal: theme.spacing['6'],
  }),
  listContainer: (bottom: number) => ({
    flexGrow: 1,
    paddingBottom: bottom + theme.spacing['4'],
  }),
}));

export default Search;
