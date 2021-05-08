import {Platform} from 'react-native';
import rnTextSize from 'react-native-text-size';
import SInfo from 'react-native-sensitive-info';
import RNIap, {ProductPurchase, Subscription} from 'react-native-iap';

export const itemSkus: string[] | undefined = Platform.select({
  android: ['premium'],
  ios: ['premium'],
});

export const getLargestWidths = async (
  arr: Array<Array<any>>,
): Promise<Array<number>> => {
  // first remap array with indexed
  const remappedArr: any[] = arr[0].map((_, idx: number) =>
    arr.map(row => row[idx]),
  );

  // console.log('remapped', remappedArr);
  //now find the highest length in the remapped array
  const largestValues: string[] = remappedArr.map(item => {
    // console.log('map ', item);

    // user the reduce on each item and find the largest element and return its length
    return item.reduce((acc: any, cur: any) => {
      if (acc === null || cur === null) {
        return acc;
      }
      return acc.toString().length >= cur.toString().length
        ? acc.toString()
        : cur.toString();
    }, '');
  });

  // console.log('largest values', largestValues);
  const widths: Array<number> = await Promise.all(
    largestValues.map(async (item: string) => {
      const val = await rnTextSize.measure({text: item, width: 220});
      return val.width + 18;
    }),
  );

  return widths;
};

export const debounce = (callback: any, delay = 250) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: []) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      callback(...args);
    }, delay);
  };
};

// returns 75/50 true false
export const shouldShowAd = (): boolean => {
  const rand: number = Math.floor(Math.random() * 7);
  // console.log('rand', rand);
  if (rand === 1) {
    return true;
  } else {
    return false;
  }
};

export const savePremium = async (): Promise<void> => {
  try {
    await SInfo.setItem('purchase', 'sql.premium', {});
  } catch (err) {
    console.log('Error in saving purchase', err);
  }
};

export const restorePremium = async (): Promise<boolean> => {
  try {
    const restore: Array<
      ProductPurchase | Subscription
    > = await RNIap.getAvailablePurchases();
    // console.log('your item was', restore);
    if (itemSkus && restore[0].productId === itemSkus[0]) {
      savePremium();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getIsPremium = async (): Promise<boolean> => {
  try {
    const res = await SInfo.getItem('purchase', {});
    if (res === 'sql.premium') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
