import React, {Children, cloneElement, memo, ReactElement} from 'react';
import {Pressable, View, ViewProps} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {globalStyles} from '@styles/global';

export interface IRowItemProps extends ViewProps {
  children: ReactElement[];
  onPress?: () => void;
}

export interface IRowItemChildProps extends ViewProps {
  styles?: ReturnType<typeof stylesheet>;
}

const RowItem = ({style, children, onPress, ...rest}: IRowItemProps) => {
  const {styles} = useStyles(stylesheet);
  return (
    <Pressable onPress={onPress}>
      <View
        style={[globalStyles.centerRow, styles.rowItemContainer, style]}
        {...rest}>
        {Children.map(children, child =>
          cloneElement(child, {
            styles,
          }),
        )}
      </View>
    </Pressable>
  );
};

RowItem.Left = memo(({children, ...rest}: IRowItemChildProps) => {
  return <View {...rest}>{children}</View>;
});

RowItem.Content = memo(({styles, children, ...rest}: IRowItemChildProps) => {
  return (
    <View style={styles?.rowItemContentContainer} {...rest}>
      {children}
    </View>
  );
});

RowItem.Right = memo(({children, ...rest}: IRowItemChildProps) => {
  return <View {...rest}>{children}</View>;
});

const stylesheet = createStyleSheet(theme => ({
  rowItemContainer: {
    gap: theme.spacing['1'],
  },
  rowItemContentContainer: {
    flex: 1,
    gap: theme.spacing['1'],
  },
}));

export default RowItem;
