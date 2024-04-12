import React, {useMemo} from 'react';

import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {
  BusLineCard,
  RowItem,
  RowItemContent,
  RowItemLeft,
  RowItemRight,
  Text,
} from '@components/ui';
import {DEFAULT_BOOKMARK} from '@constants/bookmark';
import {useAppStore} from '@store/app';
import {IBookmarkRoute} from '@store/types';
import {useUserStore} from '@store/user';
import {ITransit, TransitType} from '@typescript/api/routes';

export interface IFavoriteRouteCardProps extends IBookmarkRoute {}

export const FavoriteRouteCard = ({
  groupId,
  to,
  transitSteps,
}: IFavoriteRouteCardProps) => {
  const {styles, theme} = useStyles(stylesheet);

  /* Store */
  const app = useAppStore();
  const {groups} = useUserStore();

  const group = useMemo(
    () => groups.find(g => g.id === groupId) || DEFAULT_BOOKMARK,
    [groupId, groups],
  );

  const steps = useMemo(
    () => transitSteps.filter(transit => transit.type === TransitType.TRANSIT),
    [transitSteps],
  );
  return (
    <RowItem bw={1} bc={theme.colors.border} style={[styles.rowItemContainer]}>
      <RowItemLeft
        w={theme.spacing['10']}
        h={theme.spacing['12']}
        alignItems="center"
        justifyContent="center"
        bg={theme.colors.blueSoft1}
        br={theme.roundness}>
        <Text>📍</Text>
      </RowItemLeft>
      <RowItemContent>
        <Text
          color={theme.colors.gray2}
          size={theme.fonts.sizes.sm}
          numberOfLines={1}>
          {group.name}
        </Text>
        <Text size="lg" numberOfLines={1}>
          {to.name[app.language]}
        </Text>
      </RowItemContent>
      <RowItemRight gap={theme.spacing['1']}>
        {steps.slice(0, 2).map((transit, index) => {
          if (index === 1 && steps.length > 2) {
            return (
              <BusLineCard
                key={`transit-${transit.type}-${
                  (transit.step as ITransit).route_id
                }`}
                bg={theme.colors.gray3}
                color={theme.colors.gray5}>
                {`+${steps.length - 1}`}
              </BusLineCard>
            );
          }
          return (
            <BusLineCard
              key={`transit-${transit.type}-${
                (transit.step as ITransit).route_id
              }`}
              bg={(transit.step as ITransit).color}>
              {(transit.step as ITransit).route_id}
            </BusLineCard>
          );
        })}
      </RowItemRight>
    </RowItem>
  );
};

const stylesheet = createStyleSheet(theme => ({
  rowItemContainer: {
    padding: theme.spacing['1.5'],
    borderRadius: theme.spacing['4'],
    gap: theme.spacing['3'],
  },
}));
