module.exports = {
  root: true,
  env: {
    // ... other environments
    'jest/globals': true,
  },
  globals: {
    // ... other globals
    by: 'readonly',
    device: 'readonly',
    element: 'readonly',
    expect: 'readonly',
    waitFor: 'readonly',
  },
  extends: '@react-native-community',
  plugins: ['jest'],
};
