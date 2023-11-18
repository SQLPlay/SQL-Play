import ids from './ids.js';
import {tapOnId} from './utils.js';
import './init.js';

describe('Test Command Search panel', () => {
  it('Open the search panel', async () => {
    await tapOnId(ids.searchBtn);
    const commandList = element(by.id(ids.bottomSheetHandle));
    await commandList.swipe('up');
    await expect(commandList).toBeVisible();
  });

  it('Search for Where query', async () => {
    const searchInput = element(by.id(ids.commandSearchurenput));
    await searchInput.replaceText('WHERE');
  });

  it('Tap on the first result', async () => {
    await tapOnId(ids.commandListItem);
    const query = element(by.id(ids.commandListExample)).atIndex(0);
    console.log(await query.getAttributes());
    // await expect(query).toBeVisible(20);
    await query.tap();
  });

  it.skip('Should container query text in input', async () => {
    const queryInput = element(by.id(ids.queryTextInput));
    const queryAttr = await queryInput.getAttributes();

    await expect(queryInput).toHaveValue(
      'SELECT column_name(s)\nFROM table_name\nWHERE column_name operator value',
    );
  });
});
