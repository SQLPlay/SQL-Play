const tapOnId = id => element(by.id(id)).atIndex(0).tap();

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export {tapOnId};
