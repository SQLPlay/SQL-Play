/** @type {import('@jest/types').Config.InitialOptions} */
const e2ePattern = '**/e2e/*.e2e.js';

module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.js'],
  testTimeout: 120000,
  testMatch: [e2ePattern],
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: [
    [
      'jest-html-reporters',
      {
        publicPath: './html-report',
        filename: 'report.html',
        openReport: true,
      },
    ],
  ],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
