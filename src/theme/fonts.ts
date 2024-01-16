import {configureFonts} from 'react-native-paper';
import {MD3Type} from 'react-native-paper/lib/typescript/types';

export const baseFont: Partial<MD3Type> = {
  fontFamily: 'Poppins-Regular',
};

export const baseFontMM: Partial<MD3Type> = {
  fontFamily: 'Padauk-Regular',
};

const baseVariants = configureFonts({config: baseFont});

const customVariants = {
  // Add own tokens if required:
  bold: {
    ...baseVariants.bodyMedium,
    fontFamily: 'Poppins-Bold',
  },
  medium: {
    ...baseVariants.bodyMedium,
    fontFamily: 'Poppins-Medium',
  },
} as const;

export const fonts = configureFonts({
  config: {
    ...baseVariants,
    ...customVariants,
  },
});
