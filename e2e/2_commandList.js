import ids from './ids.js';
import {tapOnId} from './utils.js';

describe('Test Command Search panel', () => {
  it('Open the search panel', async () => {
    await tapOnId(ids.searchBtn);
    const commandList = element(by.id(ids.bottomSheetHandle));
    await commandList.swipe('up');
    await expect(commandList).toBeVisible();
  });

  it('Search for Where query', async () => {
    const searchInput = element(by.id(ids.commandSearchInput));
    await searchInput.replaceText('WHERE');
  });

  it('Tap on the first result', async () => {
    await tapOnId(ids.commandListItem);
    const query = element(by.id(ids.commandListItemQuery)).atIndex(0);
    await expect(query).toBeVisible();
    await query.tap();
  });

  it('Should container query text in input', async () => {
    const queryInput = element(by.id(ids.queryTextInput));
    // const queryAttr = await queryInput.getAttributes();

    expect(queryInput).toHaveValue(
      'SELECT column_name(s)\nFROM table_name\nWHERE column_name operator value',
    );
  });
});
