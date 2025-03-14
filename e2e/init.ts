beforeAll(async () => {
  await device.launchApp({newInstance: false});
});

afterAll(async () => {
  // await detox.cleanup();
});
