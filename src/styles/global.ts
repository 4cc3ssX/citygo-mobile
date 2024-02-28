import {createStyleSheet} from 'react-native-unistyles';

export const globalStyles = createStyleSheet({
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
