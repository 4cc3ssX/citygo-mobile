import {StyleSheet} from 'react-native';

import {lightColors} from '@theme/colors';
import {spacing} from '@theme/spacing';

export const globalStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing['6'],
  },
  flex: {
    flex: 1,
  },
  bottomSheetBackground: {
    borderRadius: spacing['11'],
  },
  bottomSheetContainer: {
    zIndex: 12,
  },
  bottomSheetHandleIndicator: {
    width: spacing['12'],
    backgroundColor: lightColors.gray5,
  },
  bottomSheetView: {
    paddingHorizontal: spacing['5'],
  },
  bottomSheetBackdrop: {
    zIndex: 8,
  },
});
