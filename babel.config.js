module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '~/screens': './src/screens',
          '~/component': './src/component',
          '~/utils': './src/utils',
          '~/store': './src/store',
          '~/api': './src/api',
          '~/types': './src/types',
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
