
beforeAll(async () => {
  await device.launchApp();
});

afterAll(async () => {
  await detox.cleanup();
});
