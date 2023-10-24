module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
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
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
