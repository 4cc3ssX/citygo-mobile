import React from 'react';
import {useCallback} from 'react';
import {GestureResponderEvent, Pressable} from 'react-native';

import {useStyles} from 'react-native-unistyles';

import {openBrowser} from '@helpers/inAppBrowser';

import {ITextProps, Text} from './Text';

export interface ILinkProps extends ITextProps {
  to?: string;
}

export const Link = ({to, onPress, children, ...rest}: ILinkProps) => {
  const {theme} = useStyles();

  /* Handlers */
  const onPressHandler = useCallback(
    (e: GestureResponderEvent) => {
      if (to) {
        openBrowser(to);
      }

      if (typeof onPress === 'function') {
        onPress(e);
      }
    },
    [onPress, to],
  );

  return (
    <Pressable onPress={onPressHandler}>
      {typeof children === 'string' ? (
        <Text size="md" color={theme.colors.primary} underlined {...rest}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
