import React, {useCallback, useMemo, useRef, useState} from 'react';
import {toast} from '@baronha/ting';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FlashList} from '@shopify/flash-list';

import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {isEqual} from 'lodash';

import {
  Container,
  CustomBackdrop,
  RowItem,
  RowItemContent,
  RowItemLeft,
  Text,
} from '@components/ui';
import {RootStackParamsList} from '@navigations/Stack';
import {IRecentRoute} from '@store/types';
import {useUserStore} from '@store/user';
import {appStyles} from '@styles/app';

import HistoryCard from './component/HistoryCard';
import {Details} from './Details';

type Props = NativeStackScreenProps<RootStackParamsList, 'History'>;

const History = ({navigation}: Props) => {
  const {styles, theme} = useStyles(stylesheet);

  /* Store */
  const {
    bookmarks,
    recentRoutes,
    removeRecentRoute,
    addToBookmark,
    removeFromBookmark,
  } = useUserStore();

  /* State */
  const [activeItem, setActiveItem] = useState<IRecentRoute | null>(null);

  /* Memo */
  const isBookmarked = useMemo(
    () => bookmarks.find(bookmark => isEqual(bookmark, activeItem)),
    [activeItem, bookmarks],
  );

  /* Ref */
  const bottomSheetRef = useRef<BottomSheet>(null);

  /* Handlers */
  const onRestartHandler = useCallback(
    (item: IRecentRoute) => {
      navigation.navigate('Directions', {
        from: {
          preferId: item.from.id,
          name: item.from.name.en,
          road: item.from.road.en,
          township: item.from.township.en,
        },
        to: {
          preferId: item.to.id,
          name: item.to.name.en,
          road: item.to.road.en,
          township: item.to.township.en,
        },
        transitRoute: item,
      });
    },
    [navigation],
  );

  const onPressHandler = useCallback(
    (item: IRecentRoute) => {
      navigation.navigate('HistoryDetails', item);
    },
    [navigation],
  );

  const onLongPress = useCallback((item: IRecentRoute) => {
    setActiveItem(item);

    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 50);
  }, []);

  const onDeleteHandler = useCallback(() => {
    if (activeItem) {
      removeRecentRoute(activeItem);

      toast({
        title: 'Success',
        message: 'Successfully deleted',
        haptic: 'success',
      });

      bottomSheetRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);

  const onAddBookmarkHandler = useCallback(() => {
    if (activeItem) {
      if (!isBookmarked) {
        addToBookmark(activeItem);
      } else {
        removeFromBookmark(activeItem);
      }

      toast({
        title: 'Success',
        message: `Successfully ${isBookmarked ? 'removed' : 'added'}`,
        haptic: 'success',
      });

      bottomSheetRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, isBookmarked]);

  const backdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => (
      <CustomBackdrop
        {...props}
        style={appStyles.bottomSheetBackdrop}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.1}
      />
    ),

    [],
  );

  return (
    <Container hasHeader bg={theme.colors.surface} style={appStyles.container}>
      <FlashList
        estimatedItemSize={120}
        data={recentRoutes}
        renderItem={({item}) => (
          <HistoryCard
            {...item}
            onRestart={() => onRestartHandler(item)}
            onPress={() => onPressHandler(item)}
            onLongPress={() => onLongPress(item)}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          animateOnMount={false}
          enablePanDownToClose
          enableDynamicSizing
          backdropComponent={backdropComponent}
          handleIndicatorStyle={appStyles.bottomSheetHandleIndicator}
          backgroundStyle={[appStyles.bottomSheetBackground]}
          containerStyle={[appStyles.bottomSheetContainer]}>
          <BottomSheetView
            style={[appStyles.bottomSheetView, styles.bottomSheetView]}>
            <RowItem
              br={theme.spacing['3']}
              h={theme.spacing['12']}
              gap={theme.spacing['0.5']}
              underlayColor={theme.colors.gray4}
              onPress={onAddBookmarkHandler}>
              <RowItemLeft bg="transparent">
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  color={theme.colors.primary}
                  size={24}
                />
              </RowItemLeft>
              <RowItemContent>
                <Text size="md" color={theme.colors.text}>
                  {isBookmarked ? 'Remove from bookmark' : 'Add to bookmark'}
                </Text>
              </RowItemContent>
            </RowItem>
            <RowItem
              br={theme.spacing['3']}
              h={theme.spacing['12']}
              gap={theme.spacing['0.5']}
              underlayColor={theme.colors.errorBackground}
              onPress={onDeleteHandler}>
              <RowItemLeft bg="transparent">
                <Ionicons
                  name="trash-outline"
                  color={theme.colors.error}
                  size={24}
                />
              </RowItemLeft>
              <RowItemContent>
                <Text size="md" color={theme.colors.error}>
                  Delete
                </Text>
              </RowItemContent>
            </RowItem>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    </Container>
  );
};

const stylesheet = createStyleSheet(theme => ({
  bottomSheetView: {
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing['4'],
    gap: theme.spacing['2'],
  },
}));

export default History;
export {Details as HistoryDetails};
