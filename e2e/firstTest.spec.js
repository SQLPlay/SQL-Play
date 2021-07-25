describe('Test Basic UI', () => {
  before(async () => {
    await device.launchApp();
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });
  const tapOnId = async id => {
    await element(by.id(id)).tap();
  };

  it('Show the input to run queries', async () => {
    await expect(element(by.id('query-runner'))).toBeVisible();
  });

  it('Delete and Type a query', async () => {
    const inputContainer = element(by.id('query-input'));
    inputContainer.swipe('left');
    inputContainer.typeText("SELECT * FROM 'employees'");
  });

  it('Tap on the run button', async () => {
    await tapOnId('run-btn');
  });

  it('Swipe the tables', async () => {
    await element(by.id('table')).swipe('left', 'fast', 1);
  });

  // it('Open and close the search panel', async () => {
  //   // await device.pressBack();
  //   await tapOnId('search-btn');
  //   // await element(by.id('searchBox')).tap();

  //   const commandList = element(by.id('commandList'));
  //   await expect(commandList).toBeVisible();
  //   // await commandList.swipe('up');
  //   // await commandList.swipe('down');
  //   // await commandList.swipe('down');
  // });
});
