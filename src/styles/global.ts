import {createStyleSheet} from 'react-native-unistyles';

export const globalStyles = createStyleSheet({
  container: {
    paddingHorizontal: 25,
  },
  flex1: {
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
