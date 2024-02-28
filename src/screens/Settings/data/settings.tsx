import React, {ReactNode} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '@components/icons';
import {RootStackParamsList} from '@navigations/Stack';

export interface ISettingItem {
  title: string;
  icon: ({color, size}: {color: string; size: number}) => ReactNode;
  to: keyof RootStackParamsList;
}

export interface ISettingData {
  title: string;
  data: ISettingItem[];
}

export const settings: ISettingData[] = [
  {
    title: 'Preferences',
    data: [
      {
        title: 'Language',
        icon: ({color, size}) => <Icon name="book" color={color} size={size} />,
        to: 'Language',
      },
      {
        title: 'AppTheme',
        icon: ({color, size}) => (
          <Ionicons name="moon" color={color} size={size} />
        ),
        to: 'AppTheme',
      },
      {
        title: 'Notifications',
        icon: ({color, size}) => <Icon name="bell" color={color} size={size} />,
        to: 'NotificationSettings',
      },
    ],
  },
];
