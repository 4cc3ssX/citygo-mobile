import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import {useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {HStack} from '@components/ui';

export const StackHeader = () => {
  const {theme} = useStyles();
  return (
    <HStack alignItems="center">
      <TouchableOpacity>
        <View>
          <Ionicons name="chevron-back" color={theme.colors.text} />
        </View>
      </TouchableOpacity>
    </HStack>
  );
};
