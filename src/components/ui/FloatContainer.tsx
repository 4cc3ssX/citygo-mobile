import React, {memo} from 'react';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet} from 'react-native-unistyles';

import {IStackProps, Stack} from './Stack';

export interface IFContainerProps extends IStackProps {
  position?: 'top' | 'bottom';
}

export const FContainer = memo(
  ({position = 'bottom', pt, pb, style, ...rest}: IFContainerProps) => {
    const insets = useSafeAreaInsets();

    return (
      <Stack
        style={[
          styles.container(position),
          style,
          {
            paddingTop: (position === 'top' ? insets.top : 0) + (pt || 0),
            paddingBottom:
              (position === 'bottom' ? insets.bottom : 0) + (pb || 0),
          },
        ]}
        {...rest}
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
