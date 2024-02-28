import React, {memo, useEffect} from 'react';
import {StatusBar} from 'react-native';

import {AvoidSoftInput} from 'react-native-avoid-softinput';
import {NavigationBar, SystemBarStyle} from 'react-native-bars';
import {
  Edge,
  Edges,
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

interface ContainerProps extends SafeAreaViewProps {
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
    style,

    handleKeyboard,
    barStyle,
    navigationBarStyle,
    bg,
    edges,
    ...props
  }: ContainerProps) => {
    const {styles, theme} = useStyles(stylesheet);

    useEffect(() => {
      if (handleKeyboard) {
        AvoidSoftInput.setShouldMimicIOSBehavior(true);
        AvoidSoftInput.setEnabled(true);
      }
      return () => {
        AvoidSoftInput.setShouldMimicIOSBehavior(false);
        AvoidSoftInput.setEnabled(false);
      };
    }, [handleKeyboard]);

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
            style,
            {
              backgroundColor: bg || theme.colors.background,
            },
            styles.container,
          ]}
        />
      </>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing['6'],
  },
}));
