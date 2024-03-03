import {StyleSheet} from 'react-native';

import {spacing} from '@theme/spacing';

export const globalStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing['6'],
  },
  flex: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 16,
    zIndex: 999,
  },
});
