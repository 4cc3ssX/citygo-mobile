import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {globalStyles} from '@styles/global';

export const StackHeader = () => {
  const {theme} = useStyles();
  return (
    <View style={[globalStyles.centerRow]}>
      <TouchableOpacity>
        <View>
          <Ionicons name="chevron-back" color={theme.colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
