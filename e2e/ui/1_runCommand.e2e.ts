import detox from 'detox';
import ids from './ids.js';
import {tapOnId} from './utils.js';
import './init.js';

const expect = detox.expect;

describe('Test Basic Query Execution', () => {
  it('Show the input to run queries', async () => {
    await expect(element(by.id(ids.queryTextInput))).toBeVisible();
  });

  it('Delete and Type a query', async () => {
    const inputContainer = element(by.id(ids.queryTextInput));
    await inputContainer.clearText();
    await inputContainer.replaceText(
      "SELECT Firstname, City, Phone, Address, Email FROM 'employees'",
    );
  });

  it('Tap on the run button', async () => {
    await tapOnId(ids.runBtn);
  });

  it('Swipe the tables', async () => {
    const table = element(by.text('Firstname'));
    await expect(table).toBeVisible();
    await table.swipe('left', 'fast', 1);
  });
});
