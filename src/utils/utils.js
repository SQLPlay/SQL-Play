import rnTextSize from 'react-native-text-size';

export const getLargestWidths = async (arr) => {
  // first remap array with indexed
  const remappedArr = arr[0].map((_, idx) => arr.map((row) => row[idx]));

  // console.log('remapped', remappedArr);
  //now find the highest length in the remapped array
  const largestValues = remappedArr.map((item) => {
    // console.log('map ', item);

    // user the reduce on each item and find the largest element and return its length
    return item.reduce((acc, cur) => {
      if (acc === null || cur === null) {
        return acc;
      }
      return acc.toString().length >= cur.toString().length
        ? acc.toString()
        : cur.toString();
    }, '');
  });

  // console.log('largest values', largestValues);
  const widths = await Promise.all(
    largestValues.map(async (item) => {
      const val = await rnTextSize.measure({text: item, width: 220});
      return val.width + 18;
    }),
  );

  // (console.log)(widths);

  return widths;
};

export const debounce = (callback, delay = 250) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      callback(...args);
    }, delay);
  };
};

// returns 75/50 true false
export const shouldShowAd = () => {
  const rand = Math.floor(Math.random() * 5);
  if (rand === 1) {
    return true;
  } else {
    return false;
  }
};
