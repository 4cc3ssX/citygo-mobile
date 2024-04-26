import {Linking} from 'react-native';

import {StatusBar} from 'react-native-bars';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export const LOG_TAG = '[ In-App Browser ]';

export const openBrowser = async (url: string) => {
  const oldStyle = StatusBar.pushStackEntry({
    barStyle: 'light-content',
    animated: true,
  });

  const isAvailable = await InAppBrowser.isAvailable();

  try {
    if (isAvailable && url.match(/^https?:\/\//)) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: '#000000',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,

        // Android Properties
        showTitle: true,
        toolbarColor: '#000000',
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: true,
        showInRecents: true,
        includeReferrer: true,

        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
      });
    } else {
      await Linking.openURL(url);
    }
  } catch (error) {
    console.log(LOG_TAG, 'Error', error);
  } finally {
    StatusBar.popStackEntry(oldStyle);
  }
};
