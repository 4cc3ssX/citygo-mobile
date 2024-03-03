import React, {Children, cloneElement, memo, ReactElement} from 'react';
import {Pressable} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {HStack, IHStackProps} from './HStack';
import {Text} from './Text';
import {IVStackProps, VStack} from './VStack';

export interface IRowItemProps extends IHStackProps {
  children: ReactElement | ReactElement[];
  onPress?: () => void;
}

export interface IRowItemChildProps extends IVStackProps {
  styles?: ReturnType<typeof stylesheet>;
}

const RowItem = ({style, children, onPress, ...rest}: IRowItemProps) => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <Pressable onPress={onPress}>
      <HStack
        alignItems="center"
        bg={theme.colors.surface}
        style={[styles.container, styles.rowItemContainer, style]}
        {...rest}>
        {Children.map(children, child =>
          cloneElement(child, {
            styles,
          }),
        )}
      </HStack>
    </Pressable>
  );
};

RowItem.Left = memo(
  ({children, styles, style, ...rest}: IRowItemChildProps) => {
    return (
      <VStack style={[styles?.rowItemLeftContainer, style]} {...rest}>
        {children}
      </VStack>
    );
  },
);

RowItem.Content = memo(
  ({styles, children, style, ...rest}: IRowItemChildProps) => {
    return (
      <VStack style={[styles?.rowItemContentContainer, style]} {...rest}>
        {typeof children === 'string' ? (
          <Text size="md">{children}</Text>
        ) : (
          children
        )}
      </VStack>
    );
  },
);

RowItem.Right = memo(
  ({children, styles, style, ...rest}: IRowItemChildProps) => {
    return (
      <VStack style={[styles?.rowItemRightContainer, style]} {...rest}>
        {children}
      </VStack>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    borderRadius: theme.roundness,
  },
  rowItemContainer: {
    padding: theme.spacing['2'],
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
