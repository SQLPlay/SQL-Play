/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
    skipLegacyWorkersInjection: true,
    behavior: {
      init: {
        reinstallApp: true,
        exposeGlobals: true,
        keepLockFile: true,
      },
      launchApp: 'auto',
      cleanup: {
        shutdownDevice: true,
      },
    },
    artifacts: {
      rootDir: 'artifacts',
      plugins: {
        instruments: {enabled: false},
        log: {enabled: true},
        uiHierarchy: 'enabled',
        screenshot: {
          shouldTakeAutomaticSnapshots: true,
          keepOnlyFailedTestsArtifacts: true,
          takeWhen: {
            testStart: false,
            testDone: true,
          },
        },
        video: {
          android: {
            bitRate: 4000000,
          },
          simulator: {
            codec: 'hevc',
          },
        },
      },
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/SQL_PlayGround.app',
      build:
        'xcodebuild -workspace ios/Sql_Playground.xcworkspace -scheme SQL_PlayGround -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
      device: {
        type: 'iPhone 13',
      },
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/SQL_PlayGround.app',
      build:
        'xcodebuild -workspace ios/Sql_Playground.xcworkspace -scheme SQL_PlayGround -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
      device: {
        type: 'iPhone 13',
      },
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [8081],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=release && cd ..',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 13',
      },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_5_API_30',
      },
    },
  },
  configurations: {
    'ios.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.debug': {
      device: 'attached',
      app: 'android.debug',
    },
    'android.release': {
      device: 'attached',
      app: 'android.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};
