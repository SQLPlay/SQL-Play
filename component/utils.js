export const getLargestWidths = (arr) => {
  // first remap array with indexed
  const remappedArr = arr.reduce((acc, cur, i, prvArr) => {
    const line = prvArr.map((item) => item[i]);
    return i < prvArr[0].length ? [...acc, line] : acc;
  }, []);

  console.log('remapped', remappedArr);
  console.clear();
  //   //now find the highest length in the remapped array
  const maxWidths = remappedArr.map((item) => {
    // user the reduce on each item and find the largest element and return its length
    return item.reduce((acc, cur) => {
      if (acc) {
        return acc.length > cur.length
          ? acc.toString().length * 15
          : cur.toString().length * 15;
      }
    });
  });

  return maxWidths;
};
