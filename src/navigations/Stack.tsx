import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTranslation} from 'react-i18next';

import {FindRouteValues} from '@helpers/validations';
import AppTheme from '@screens/AppTheme';
import ChooseFromMap from '@screens/ChooseFromMap';
import FindRoute from '@screens/FindRoute';
import Language from '@screens/Language';
import {NotificationSettings} from '@screens/Notifications';
import Routes from '@screens/Routes';
import Search from '@screens/Search';
import {IRoute} from '@typescript/api/routes';
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
    prevRouteName: keyof RootStackParamsList;
    prevRouteProps: any;
  };
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
        options={{title: t('AppTheme')}}
      />
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
    </RNStack.Navigator>
  );
}

export default memo(Stack);
