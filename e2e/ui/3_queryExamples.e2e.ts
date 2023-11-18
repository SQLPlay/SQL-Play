import ids from './ids.js';
import {tapOnId} from './utils.js';

describe('Run all the examples one by one', () => {
  for (let i = 0; i < 33; i++) {
    it('Open the search panel', async () => {
      await tapOnId(ids.searchBtn);
      const commandList = element(by.id(ids.bottomSheetHandle));
      await commandList.swipe('up', 'fast', 1);
    });

    // console.log(await listItems.getAttributes().elements.length);
    it(`Tap on example from no ${i + 1} `, async () => {
      const listItems = element(by.id(ids.commandListItem));
      await waitFor(listItems.atIndex(i))
        .toBeVisible()
        .whileElement(by.id(ids.commandListSheet))
        .scroll(400, 'down');

      await listItems.atIndex(i).tap();
      // console.log(await listItems.getAttributes().elements.length);
      const examples = element(by.id(ids.commandListExample));
      // const exampleAttr = await examples.getAttributes();

      // console.log(exampleAttr);
      await waitFor(examples.atIndex(0))
        .toBeVisible()
        .whileElement(by.id(ids.commandListSheet))
        .scroll(400, 'down');

      await examples.tap();

      // const totalExLength = exampleAttr?.elements?.length;

      // if there is only one example tap on it otherwise loop and tap all
      // if (!totalExLength) {
      //   await examples.tap();
      // } else {
      //   for (let j = 0; j < totalExLength; i++) {
      //     await examples.atIndex(j).tap();
      //   }
      // }
    });

    it('Tap on the run button', async () => {
      await tapOnId(ids.runBtn);
    });
  }
});
