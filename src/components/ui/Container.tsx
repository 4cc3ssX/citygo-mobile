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
import {useStyles} from 'react-native-unistyles';

import {Constants} from '@constants';
import {globalStyles} from '@styles/global';

interface ContainerProps extends SafeAreaViewProps {
  header?: boolean;
  handleKeyboard?: boolean;
  barStyle?: SystemBarStyle;
  navigationBarStyle?: SystemBarStyle;
  backgroundColor?: string;
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
    header,
    handleKeyboard,
    barStyle,
    navigationBarStyle,
    backgroundColor,
    edges,
    ...props
  }: ContainerProps) => {
    const {theme} = useStyles();
    const {top} = useSafeAreaInsets();

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
              backgroundColor: backgroundColor || theme.colors.background,
              paddingTop: header ? Constants.HEADER_HEIGHT + top : undefined,
            },
            globalStyles.container,
            globalStyles.flex1,
          ]}
        />
      </>
    );
  },
);
