import React from 'react';
import {Image, ImageProps, StyleSheet} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {IVStackProps, VStack} from './VStack';

export interface IAvatarProps
  extends IVStackProps,
    Pick<
      ImageProps,
      | 'resizeMode'
      | 'source'
      | 'defaultSource'
      | 'alt'
      | 'borderRadius'
      | 'blurRadius'
    > {
  imageProps?: Omit<
    ImageProps,
    | 'resizeMode'
    | 'source'
    | 'defaultSource'
    | 'alt'
    | 'borderRadius'
    | 'blurRadius'
  >;
}

const Avatar = ({
  source,
  children,
  style,
  imageProps,
  ...rest
}: IAvatarProps) => {
  const {styles} = useStyles(stylesheet);
  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      style={[styles.avatarContainer, style]}
      {...rest}>
      <Image
        resizeMode="cover"
        source={source}
        {...imageProps}
        style={[styles.avatarImage, imageProps?.style]}
      />
      {children}
    </VStack>
  );
};

const stylesheet = createStyleSheet(theme => ({
  avatarContainer: {
    width: theme.spacing['12'],
    height: theme.spacing['12'],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  avatarImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
}));

export {Avatar};
