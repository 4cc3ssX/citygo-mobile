import React, {memo, useCallback} from 'react';

import {useStyles} from 'react-native-unistyles';

import {Icon} from '@components/icons';
import {
  Button,
  IStackProps,
  RowItem,
  RowItemContent,
  RowItemLeft,
  Stack,
  Text,
} from '@components/ui';
import {useAppStore} from '@store/app';
import {IStop} from '@typescript/api/stops';

export interface IStopCardProps extends IStackProps {
  stop: IStop;
  onPress: (stop: IStop) => void;
}

const StopCard = memo(({stop, onPress, ...props}: IStopCardProps) => {
  const app = useAppStore();
  const {theme} = useStyles();

  /* Handlers */
  const onPressHandler = useCallback(() => {
    onPress(stop);
  }, [onPress, stop]);

  return (
    <Stack
      br={theme.roundness}
      bg={theme.colors.surface}
      p={theme.spacing['3.5']}
      gap={theme.spacing['2']}
      {...props}>
      <RowItem>
        <RowItemLeft
          w={theme.spacing['12']}
          h={theme.spacing['14']}
          bg={theme.colors.blueSoft1}>
          <Icon name="gps" color={theme.colors.primary} size={24} />
        </RowItemLeft>
        <RowItemContent>
          <Text size="md">{stop.name[app.language]}</Text>
          <Text size="xs" color={theme.colors.gray2} numberOfLines={1}>
            {stop.road[app.language]}
          </Text>
        </RowItemContent>
      </RowItem>
      <Button size="lg" h={theme.spacing['12']} onPress={onPressHandler}>
        Confirm
      </Button>
    </Stack>
  );
});

export default StopCard;
