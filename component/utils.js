import rnTextSize from 'react-native-text-size';

export const getLargestWidths = async (arr) => {
  // first remap array with indexed
  const remappedArr = arr[0].map((_, idx) => arr.map((row) => row[idx]));

  console.log('remapped', remappedArr);
  console.clear();
  //   //now find the highest length in the remapped array
  const largestValues = remappedArr.map((item) => {
    // user the reduce on each item and find the largest element and return its length
    return item.reduce((acc, cur) => {
      if (acc) {
        return acc.length > cur.length ? acc.toString() : cur.toString();
      } else {
          return "NULL";
      }
    });
  });

  const widths = await Promise.all(
    largestValues.map(async (item) => {
      const val = await rnTextSize.measure({text: item, width: 220});
      return val.width + 25;
    }),
  );

  console.log(widths);

  return widths;
};
