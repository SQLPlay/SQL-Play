/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  preset: 'ts-jest',
  testTimeout: 120000,
  testMatch: ['<rootDir>/e2e/**/*.e2e.ts'],
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: [
    'detox/runners/jest/reporter',
    [
      'jest-html-reporters',
      {
        publicPath: './html-report',
        filename: 'report.html',
        openReport: false,
      },
    ],
  ],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
