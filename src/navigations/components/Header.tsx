import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Button, HStack, Text, VStack} from '@components/ui';
import {Constants} from '@constants';

export const StackHeader = ({navigation, options}: NativeStackHeaderProps) => {
  const {top} = useSafeAreaInsets();

  const {styles, theme} = useStyles(stylesheet);

  /* Handlers */
  const onGoBackHandler = useCallback(async () => {
    const initialURL = await Linking.getInitialURL();

    if (initialURL) {
      // launched by deep link
      navigation.reset({
        index: 0,
        routes: [{name: 'MainDrawer'}],
      });
    } else {
      navigation.canGoBack() && navigation.goBack();
    }
  }, [navigation]);

  const onPressHelpHandler = useCallback(() => {
    navigation.navigate('Help');
  }, [navigation]);

  return (
    <HStack
      maxH={Constants.HEADER_HEIGHT + top}
      pt={
        options.presentation === 'modal'
          ? theme.spacing['3']
          : top + theme.spacing['3']
      }
      pb={theme.spacing['3']}
      px={theme.spacing['4']}
      alignItems="center"
      bg={theme.colors.surface}
      style={[styles.headerContainer, options.headerStyle]}>
      {options.presentation === 'modal' ? (
        <Button size="sm" variant="clear" onPress={onGoBackHandler}>
          <Ionicons
            name="chevron-back-outline"
            size={theme.spacing['6']}
            color={theme.colors.text}
          />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="clear"
          icon={
            <Ionicons
              name="chevron-back-outline"
              size={theme.spacing['6']}
              color={theme.colors.text}
            />
          }
          onPress={onGoBackHandler}>
          Back
        </Button>
      )}

      <VStack flex={2}>
        {options.title ? (
          <Text family="product" size="lg" type="medium" textAlign="center">
            {options.title}
          </Text>
        ) : null}
      </VStack>

      {(!options.presentation || options.presentation === 'card') && (
        <Button
          size="sm"
          variant="clear"
          icon={
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={theme.colors.text}
            />
          }
          onPress={onPressHelpHandler}>
          Help
        </Button>
      )}
    </HStack>
  );
};

const stylesheet = createStyleSheet(theme => ({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
}));
