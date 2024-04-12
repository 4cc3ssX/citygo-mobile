import React, {Children, cloneElement, memo, ReactElement} from 'react';
import {TouchableHighlight, TouchableHighlightProps} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {HStack} from './HStack';
import {IStackProps} from './Stack';
import {Text} from './Text';
import {VStack} from './VStack';

export interface IRowItemProps
  extends IStackProps,
    Omit<TouchableHighlightProps, 'hitSlop'> {
  children: ReactElement | (ReactElement | null)[];
  onPress?: () => void;
}

export interface IRowItemChildProps extends IStackProps {
  styles?: ReturnType<typeof stylesheet>;
}

const RowItem = memo(
  ({
    br,
    activeOpacity,
    underlayColor,
    style,
    children,
    onPress,
    ...rest
  }: IRowItemProps) => {
    const {styles, theme} = useStyles(stylesheet);

    return (
      <TouchableHighlight
        activeOpacity={activeOpacity || 0.75}
        underlayColor={underlayColor || 'transparent'}
        style={[styles.container, {borderRadius: br || theme.roundness}]}
        onPress={onPress}>
        <HStack
          alignItems="center"
          bg={theme.colors.surface}
          style={[
            styles.container,
            styles.rowItemContainer,
            {borderRadius: br || theme.roundness},
            style,
          ]}
          {...rest}>
          {Children.map(
            children,
            child =>
              child &&
              cloneElement(child, {
                styles,
              }),
          )}
        </HStack>
      </TouchableHighlight>
    );
  },
);

export const RowItemLeft = memo(
  ({children, styles, style, ...rest}: IRowItemChildProps) => {
    return (
      <VStack style={[styles?.rowItemLeftContainer, style]} {...rest}>
        {children}
      </VStack>
    );
  },
);

export const RowItemContent = memo(
  ({styles, children, style, ...rest}: IRowItemChildProps) => {
    return (
      <VStack style={[styles?.rowItemContentContainer, style]} {...rest}>
        {typeof children === 'string' ? (
          <Text size="md" numberOfLines={2}>
            {children}
          </Text>
        ) : (
          children
        )}
      </VStack>
    );
  },
);

export const RowItemRight = memo(
  ({children, styles, style, ...rest}: IRowItemChildProps) => {
    return (
      <HStack style={[styles?.rowItemRightContainer, style]} {...rest}>
        {children}
      </HStack>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    borderRadius: theme.roundness,
  },
  rowItemContainer: {
    padding: theme.spacing['2.5'],
    gap: theme.spacing['3.5'],
  },
  rowItemLeftContainer: {
    width: theme.spacing['11'],
    height: theme.spacing['11'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blueSoft1,
    borderRadius: theme.roundness,
  },
  rowItemContentContainer: {
    flex: 2,
    gap: theme.spacing['0.5'],
  },
  rowItemRightContainer: {},
}));

export {RowItem};
