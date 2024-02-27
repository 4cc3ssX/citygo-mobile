import React from 'react';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button, IButtonProps} from './Button';

export interface IIconButton extends IButtonProps {}

export const IconButton = ({icon, ...rest}: IIconButton) => {
  const {styles} = useStyles(stylesheet);
  return (
    <Button
      color="white"
      alignItems="center"
      justifyContent="center"
      style={styles.container}
      activeOpacity={0.7}
      {...rest}>
      {icon}
    </Button>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: theme.spacing['12'],
    height: theme.spacing['12'],
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: theme.roundness,
  },
}));
