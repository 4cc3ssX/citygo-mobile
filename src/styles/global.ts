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
  bottomSheetContainer: {
    borderRadius: spacing['11'],
  },
  bottomSheetHandleIndicator: {
    width: spacing['12'],
    backgroundColor: lightColors.gray5,
  },
  bottomSheetView: {
    gap: spacing['4'],
  },
});
