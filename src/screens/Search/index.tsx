import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, TextInput, View} from 'react-native';
import {zodResolver} from '@hookform/resolvers/zod';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ContentLoader, {Rect} from 'react-content-loader/native';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  InputAccessoryView,
  RowItem,
  Separator,
  Text,
  VStack,
} from '@components/ui';
import {Constants} from '@constants';
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
  keys: ['name.en', 'name.mm'],
};

const chooseOnMapButtonNativeID = 'choose-location-on-map';

const Search = ({navigation, route}: Props) => {
  const {chooseFor, stop} = route.params;

  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const app = useAppStore();

  const {styles, theme} = useStyles(stylesheet);

  /* State */
  const [searchStops, setSearchStops] = useState<IStop[]>([]);

  /* Query */
  const {isFetching: isStopsFetching, data: stops} = useGetStops();

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

  const onChooseLocationOnMap = useCallback(() => {
    const dest = destRef.current;

    const initialStop = stops?.find(s => s.id === getValues()[dest]?.preferId);

    const initialRegion = initialStop
      ? Constants.getDefaultMapDelta(initialStop.lat, initialStop.lng)
      : null;

    navigation.navigate('ChooseFromMap', {
      initialRegion,
      prevRouteName: 'Search',
      prevRouteProps: {
        chooseFor: dest,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, stops]);

  const onSelectStop = useCallback(
    (selectedStop: IStop) => {
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
          preferId: selectedStop.id,
          name: selectedStop.name.en,
          road: selectedStop.road.en,
          township: selectedStop.township.en,
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
      if (value.length > 2) {
        const fuseResult = fuse.search(value);

        const filteredStops = fuseResult.map(result => result.item);

        setSearchStops(filteredStops);
      } else {
        resetField(dest);
        setSearchStops(stops || []);
      }
    },
    [fuse, resetField, stops],
  );

  useEffect(() => {
    if (stops) {
      setSearchStops(stops);
    }
  }, [stops]);

  useEffect(() => {
    if (chooseFor && stop) {
      destRef.current = chooseFor;
      onSelectStop(stop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chooseFor, stop]);

  const itemSeparatorComponent = useCallback(
    () => <Separator my={theme.spacing['1']} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const listEmptyComponent = useCallback(() => {
    if (!isStopsFetching && searchStops.length === 0) {
      return <EmptyList mb={theme.spacing['10']} title="No stops found" />;
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
        {Array(6)
          .fill(0)
          .map((_value, index) => {
            const y = (theme.spacing['15'] + theme.spacing['2.5']) * index;

            return (
              <Rect
                key={`content-loader-${index}`}
                x="0"
                y={`${y}`}
                rx={`${theme.roundness}`}
                ry={`${theme.roundness}`}
                width="100%"
                height={theme.spacing['14']}
              />
            );
          })}
      </ContentLoader>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStopsFetching, searchStops.length, theme.colors.background]);

  return (
    <Container
      hasHeader
      containerPaddingTop={theme.spacing['3']}
      barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      bg={theme.colors.surface}
      style={[globalStyles.container, styles.container]}>
      <InputAccessoryView nativeID={chooseOnMapButtonNativeID}>
        <Button
          br={0}
          variant="ghost"
          bg={theme.colors.blueSoft1}
          icon={<Ionicons name="map" color={theme.colors.primary} size={22} />}
          onPress={onChooseLocationOnMap}>
          {t('ChooseLocationOnMap')}
        </Button>
      </InputAccessoryView>
      <FContainer pb={theme.spacing['2.5']} px={theme.spacing['6']}>
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
              const selectedStop = stops?.find(st => st.id === value?.preferId);

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
              const selectedStop = stops?.find(st => st.id === value?.preferId);

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
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={listEmptyComponent}
        renderItem={({item}) => (
          <RowItem h={theme.spacing['15']} onPress={() => onSelectStop(item)}>
            <RowItem.Left bg={theme.colors.background}>
              <Text size="xl" textAlign="center">
                📍
              </Text>
            </RowItem.Left>
            <RowItem.Content>
              <Text size="md">{item.name[app.language]}</Text>
              <Text size="xs" color={theme.colors.gray2} numberOfLines={1}>
                {item.road[app.language]}, {item.township[app.language]}
              </Text>
            </RowItem.Content>
          </RowItem>
        )}
        keyExtractor={(item, index) => `stop-${item.id}-${index}`}
        contentContainerStyle={styles.listContainer(insets.bottom)}
      />
    </Container>
  );
};
const stylesheet = createStyleSheet(theme => ({
  container: {
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

  listContainer: (bottom: number) => ({
    // flexGrow: 1,
    paddingBottom: bottom + theme.spacing['4'],
  }),
}));

export default Search;
