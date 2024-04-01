import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import {SystemBars, SystemBarStyle} from 'react-native-bars';
import {
  Edge,
  Edges,
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useStyles} from 'react-native-unistyles';

import {Constants} from '@constants';
import {useThemeName} from '@hooks/useThemeName';

interface ContainerProps extends SafeAreaViewProps {
  containerPaddingTop?: number;
  hasHeader?: boolean;
  barStyle?: SystemBarStyle;
  bg?: string;
}

const defaultEdges: Edges = {
  top: 'off',
  bottom: 'off',
  left: 'off',
  right: 'off',
};

export const Container = memo(
  ({
    containerPaddingTop,
    hasHeader = false,
    barStyle: defaultBarStyle,
    bg,
    edges,
    style,
    ...props
  }: ContainerProps) => {
    const insets = useSafeAreaInsets();
    const {theme} = useStyles();

    const themeName = useThemeName();

    return (
      <>
        <SystemBars
          barStyle={
            defaultBarStyle ||
            (themeName === 'light' ? 'dark-content' : 'light-content')
          }
          animated
        />

        <SafeAreaView
          edges={
            Array.isArray(edges)
              ? (edges as Edge[])
              : {
                  ...defaultEdges,
                  ...edges, // override to default edges
                }
          }
          {...props}
          style={[
            {
              backgroundColor: bg || theme.colors.background,
              paddingTop: hasHeader
                ? Constants.HEADER_HEIGHT +
                  insets.top +
                  (containerPaddingTop || 0)
                : undefined,
            },
            style,
            styles.container,
          ]}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
