export const tapOnId = (id: string | RegExp) => element(by.id(id)).tap();

export const tapOnText = (id: string | RegExp) => element(by.text(id)).tap();

export const typeTextInId = (id: string | RegExp, text: string) =>
  element(by.id(id)).typeText(text);

export const sleep = (ms: number | undefined) =>
  new Promise(resolve => setTimeout(resolve, ms));
