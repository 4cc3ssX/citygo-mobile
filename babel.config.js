module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@api': './src/api',
          '@hooks': './src/hooks',
          '@theme': './src/theme',
          '@assets': './src/assets',
          '@navigations': './src/navigations',
          '@typescript': './src/typescript',
          '@components': './src/components',
          '@store': './src/store',
          '@utils': './src/utils',
          '@configs': './src/configs',
          '@screens': './src/screens',
          '@helpers': './src/helpers',
          '@locales': './src/locales',
          '@styles': './src/styles',
          '@constants': './src/constants',
          '@errors': './src/errors',
        },
      },
    ],
  ],
};
