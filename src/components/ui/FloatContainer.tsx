import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';
import {createStyleSheet} from 'react-native-unistyles';

export interface IFContainerProps extends SafeAreaViewProps {
  position?: 'top' | 'bottom';
}

export const FContainer = memo(
  ({position = 'top', style, ...rest}: IFContainerProps) => {
    return (
      <SafeAreaView
        {...rest}
        edges={['left', 'right', position]}
        style={StyleSheet.flatten([style, styles.container(position)])}
      />
    );
  },
);

FContainer.displayName = 'FloatContainer';

const styles = createStyleSheet({
  container: (position: IFContainerProps['position']) => ({
    position: 'absolute',
    top: position === 'top' ? 0 : undefined,
    bottom: position === 'bottom' ? 0 : undefined,
    left: 0,
    right: 0,
    zIndex: 999,
  }),
});
