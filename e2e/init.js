import detox from 'detox';
import adapter from 'detox/runners/mocha/adapter.js';

before(async () => {
  await detox.init();
  await device.launchApp();
});

beforeEach(async function () {
  await adapter.beforeEach(this);
});

afterEach(async function () {
  await adapter.afterEach(this);
});

after(async () => {
  await detox.cleanup();
});
