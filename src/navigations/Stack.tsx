import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';
import {Region} from 'react-native-maps';

import {FindRouteValues} from '@helpers/validations';
import AppTheme from '@screens/AppTheme';
import ChooseFromMap from '@screens/ChooseFromMap';
import Directions from '@screens/Directions';
import FindRoute from '@screens/FindRoute';
import History, {HistoryDetails} from '@screens/History';
import Language from '@screens/Language';
import {NotificationSettings} from '@screens/Notifications';
import Routes from '@screens/Routes';
import Search from '@screens/Search';
import {IRecentRoute} from '@store/types';
import {IRoute, ITransitRoute} from '@typescript/api/routes';
import {IStop} from '@typescript/api/stops';

import {StackHeader} from './components/Header';
import Tab from './Tab';

export type RootStackParamsList = {
  MainTab: undefined;
  Language: undefined;
  NotificationSettings: undefined;
  AppTheme: undefined;
  Search: {
    chooseFor?: keyof FindRouteValues;
    stop?: IStop | undefined;
  };
  FindRoute: FindRouteValues;
  Routes: {
    initialRoute: IRoute | null;
  };
  ChooseFromMap: {
    initialRegion: Region | null;
    prevRouteName: keyof RootStackParamsList;
    prevRouteProps: any;
  };
  Directions: {
    transitRoute: ITransitRoute;
  } & FindRouteValues;
  LiveAction: {
    transitRoute: ITransitRoute;
  } & FindRouteValues;
  History: undefined;
  HistoryDetails: IRecentRoute;
  Bookmarks: undefined;
  FindOnMap: undefined
};

const RNStack = createNativeStackNavigator<RootStackParamsList>();

function Stack() {
  const {t} = useTranslation();

  return (
    <RNStack.Navigator
      screenOptions={{
        header: StackHeader,
      }}>
      <RNStack.Screen
        name="MainTab"
        component={Tab}
        options={{
          headerShown: false,
          title: 'Home', // back native button title
        }}
      />
      <RNStack.Group>
        <RNStack.Screen
          name="Language"
          component={Language}
          options={{title: t('Language')}}
        />
        <RNStack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{title: t('Notifications')}}
        />
        <RNStack.Screen
          name="AppTheme"
          component={AppTheme}
          options={{title: t('DarkMode')}}
        />
      </RNStack.Group>
      <RNStack.Screen
        name="Search"
        component={Search}
        options={{title: t('Search')}}
      />
      <RNStack.Screen
        name="FindRoute"
        component={FindRoute}
        options={{title: t('FindRoute')}}
      />
      <RNStack.Screen
        name="Routes"
        component={Routes}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
            maxHeight: 'auto',
          } as any,
        }}
      />
      <RNStack.Screen
        name="ChooseFromMap"
        component={ChooseFromMap}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
            maxHeight: 'auto',
          } as any,
        }}
      />
      <RNStack.Screen
        name="Directions"
        component={Directions}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
            maxHeight: 'auto',
          } as any,
        }}
      />
      <RNStack.Screen
        name="History"
        component={History}
        options={{title: t('History')}}
      />
      <RNStack.Screen
        name="HistoryDetails"
        component={HistoryDetails}
        options={{
          title: t('Details'),
          headerBackVisible: false,
          presentation: 'modal',
        }}
      />
    </RNStack.Navigator>
  );
}

export default Stack;
