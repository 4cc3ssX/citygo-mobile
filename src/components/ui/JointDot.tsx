import React, {memo, ReactElement} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';

import {IStackProps, Stack} from './Stack';

export interface IJoinDotProps extends IStackProps {
  color: string;
  showDot?: boolean;
  icon?: ReactElement;
  dotStyle?: StyleProp<ViewStyle>;
}

export const JoinDot = memo(
  ({color, showDot = true, h, icon, dotStyle, ...rest}: IJoinDotProps) => {
    const {theme} = useStyles();
    return (
      <Stack
        w={theme.spacing['10']}
        h={h || theme.spacing['10']}
        alignItems="center"
        justifyContent="center"
        {...rest}>
        <View style={[styles.container, StyleSheet.absoluteFill]}>
          {showDot && (
            <View style={[styles.dot, dotStyle]}>
              {icon || <Icon name="marker" color={color} size={18} />}
            </View>
          )}
          <Stack w={theme.spacing[0.5]} h="100%" bg={color} />
        </View>
      </Stack>
    );
  },
);

const styles = createStyleSheet({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    zIndex: 4,
  },
});
