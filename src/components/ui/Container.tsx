import React, {memo} from 'react';
import {StatusBar, StyleSheet} from 'react-native';

import {NavigationBar, SystemBarStyle} from 'react-native-bars';
import {
  Edge,
  Edges,
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useStyles} from 'react-native-unistyles';

import {Constants} from '@constants';

interface ContainerProps extends SafeAreaViewProps {
  containerPaddingTop?: number;
  hasHeader?: boolean;
  handleKeyboard?: boolean;
  barStyle?: SystemBarStyle;
  navigationBarStyle?: SystemBarStyle;
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
    handleKeyboard,
    barStyle,
    navigationBarStyle,
    bg,
    edges,
    style,
    ...props
  }: ContainerProps) => {
    const insets = useSafeAreaInsets();
    const {theme} = useStyles();

    return (
      <>
        {barStyle ? (
          <StatusBar barStyle={barStyle} translucent animated />
        ) : null}
        {navigationBarStyle ? (
          <NavigationBar barStyle={navigationBarStyle} />
        ) : null}

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
