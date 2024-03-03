import React from 'react';
import {Image} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {IRowItemProps, RowItem, Separator, Text} from '@components/ui';
import {FindRouteValues} from '@helpers/validations';

export interface IRouteInfoCardProps
  extends FindRouteValues,
    Omit<IRowItemProps, 'children'> {}

export const RouteInfoCard = ({from, to, ...rest}: IRouteInfoCardProps) => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <RowItem
      px={theme.spacing['4']}
      py={theme.spacing['2.5']}
      bg={theme.colors.gray3}
      gap={theme.spacing['1.5']}
      {...rest}>
      <RowItem.Left
        bg="transparent"
        minW={theme.spacing['20']}
        maxW={theme.spacing['24']}
        alignItems="flex-start"
        gap={theme.spacing['0.5']}>
        <Text size="xs" textAlign="left" color={theme.colors.gray2}>
          Start Point
        </Text>
        <Text family="product" size="md" textAlign="left" numberOfLines={1}>
          {from.name}
        </Text>
      </RowItem.Left>
      <RowItem.Content>
        <Separator size={1.5}>
          <Image
            source={require('@assets/images/ybs.png')}
            resizeMode="center"
            style={styles.image}
          />
        </Separator>
      </RowItem.Content>
      <RowItem.Right
        minW={theme.spacing['20']}
        maxW={theme.spacing['24']}
        alignItems="flex-end"
        gap={theme.spacing['1']}>
        <Text size="xs" color={theme.colors.gray2} textAlign="right">
          End Point
        </Text>
        <Text family="product" size="md" textAlign="right" numberOfLines={1}>
          {to.name}
        </Text>
      </RowItem.Right>
    </RowItem>
  );
};

const stylesheet = createStyleSheet(theme => ({
  image: {
    width: theme.spacing['14'],
    height: theme.spacing['5'],
    resizeMode: 'contain',
  },
}));
