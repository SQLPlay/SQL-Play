import detox from 'detox';

beforeEach(async () => {
  await detox.init();
  await device.launchApp();
});

after(async () => {
  await detox.cleanup();
});
