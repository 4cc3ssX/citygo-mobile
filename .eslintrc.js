module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['unused-imports', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    // override "simple-import-sort" config
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // React and React Native packages come first.
              ['^react', '^react-native', '^@?\\w'],
              // React Native Packages
              ['^react-[\\w\\-/]*'],
              // Other libraries.
              ['^[\\w\\-/]*'],
              // Internal packages.
              [
                '^@(api|hooks|theme|assets|navigations|typescript|components|store|utils|configs|screens|helpers|locales|styles|constants|errors)(/.*|$)',
              ],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ],
          },
        ],
      },
    },
  ],
};
