import {createStyleSheet} from 'react-native-unistyles';

export const globalStyles = createStyleSheet({
  flex1: {
    flex: 1,
  },
  fab: (right: number, bottom: number) => ({
    position: 'absolute',
    right,
    bottom,
    zIndex: 999,
  }),
});
